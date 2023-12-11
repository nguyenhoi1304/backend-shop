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

exports.findAll = async (req, res, next) => {
  //Lấy ra tất cả user
  const allUser = await UserModel.find().lean();
  res.json(allUser);
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
