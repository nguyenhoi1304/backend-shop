const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

exports.checkPermissionAdmin = async (req, res, next) => {
  try {
    //  ở phía client thêm axios authorization
    let token;
    //Bước 1: Người dùng đăng nhập hay chưa?
    //Nhận được token khi người dùng đăng nhập thành công
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    //Bước 2: Kiểm tra token
    if (!token)
      return res
        .status(401)
        .json({ message: "Bạn chưa đăng nhập", authentication: false });
    //Bước 3: Kiểm tra quyền của người dùng? token => _id
    const decoded = jwt.verify(token, "mk");

    //Lấy ra User đang đăng nhập thông qua _id
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(403).json({ message: "Token lỗi" });
    }
    if (user.role !== "admin" && user.role !== "chat") {
      return res.status(400).json({ message: "Bạn chưa có quyền truy cập" });
    }

    //Bước 4: next
    next();
  } catch (err) {
    return res.json({ name: err.name, message: err.message });
  }
};
