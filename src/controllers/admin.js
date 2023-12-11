const bcrypt = require("bcryptjs");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let isUser = false;
    const user = await UserModel.findOne({
      email: email,
    });

    if (user.role == "admin") {
      isUser = true;
    }
    if (user.role == "chat") {
      isUser = true;
    }

    // giải mã password trong Db và so với password người dùng nhập
    const validatePassword = await bcrypt.compare(password, user.password);

    if (isUser && validatePassword) {
      console.log(isUser);
      //tạo token
      const token = jwt.sign({ _id: user._id }, "mk");
      res.cookie("token", token, { httpOnly: true });
      res.json({
        message: "Success",
        user: user,
        isLogin: true,
        token: token,
      });
    } else {
      res.json({
        message: "User Not Found!",
        isLogin: false,
        invalidatePassword: true,
      });
    }
  } catch (err) {
    res.json(err);
    next();
  }
};
