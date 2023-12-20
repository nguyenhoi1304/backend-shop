const bcrypt = require("bcryptjs");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

exports.getDetail = async (req, res, next) => {
  try {
    //Tìm thông tin User qua email
    const user = await UserModel.findOne({ email: req.params.id }).lean();
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.findAll = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.limit;
  let totalUsers;
  UserModel.find()
    .countDocuments()
    .then((count) => {
      totalUsers = count;
      return UserModel.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .then((users) => {
          res.status(200).json({
            message: "Successfully",
            users: users,
            totalUsers: totalUsers,
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.register = async (req, res, next) => {
  const { fullname, email, password, phone } = req.body;

  //Mã hóa password thành 12 ký tự ngẫu nhiên
  const hashPassword = await bcrypt.hash(password, 12);
  try {
    //Kiểm tra xem người dùng đã nhập đầy đủ các trường hay chưa?
    if (!password || !fullname || !email || !phone) {
      res.json({ message: "Chưa điền đầy đủ các thông tin" });
    } else {
      //Kiểm tra xem email đăng ký đã tồn tại hay chưa?
      const isEmail = await UserModel.findOne({ email: email });
      if (isEmail) {
        res.json({ message: "Email đã tồn tại" });
      } else {
        res.json({
          isRegister: true,
          password: password,
          fullName: fullname,
          phoneNumber: phone,
          email: email,
        });
        UserModel.create({
          fullName: fullname,
          email: email,
          password: hashPassword,
          phoneNumber: phone,
          address: "Something...",
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err });
    next();
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    // giải mã password trong Db và so với password người dùng nhập
    const validatePassword = await bcrypt.compare(password, user.password);

    if (user && validatePassword) {
      //tạo token
      const token = jwt.sign({ _id: user._id }, "mk");
      res.cookie("token", token, { httpOnly: true, maxAge: 60000 });
      res.json({
        message: "Success",
        user: user,
        isLogin: true,
        token: token,
      });
    } else {
      res.json({
        message: "Password Not Correct!",
        isLogin: false,
        invalidatePassword: true,
      });
    }
  } catch (err) {
    res.json({
      message: "User Not Found!",
      isLogin: false,
      invalidateUser: true,
    });
    next();
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
};
