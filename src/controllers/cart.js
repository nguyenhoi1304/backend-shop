const CartModel = require("../models/cart");

exports.shoppingCart = async (req, res, next) => {
  const idUser = req.query.idUser;
  const useraddCart = await CartModel.find({ idUser: idUser }).populate(
    "idProduct"
  );

  const data = useraddCart.map((detail) => {
    return {
      idUser: detail.idUser,
      idProduct: detail.idProduct._id,
      count: detail.count,
      img: detail.idProduct.img1,
      nameProduct: detail.idProduct.name,
      priceProduct: detail.idProduct.price,
    };
  });
  res.json(data);
};

exports.add = async (req, res, next) => {
  //idUser  là email của người dùng
  const { idUser, idProduct, count } = req.body;

  try {
    if (!count || !idProduct || !idUser) {
      res.json({
        message: "Vui lòng nhập dữ liệu, không được để trống!",
      });
    } else {
      //tìm xem người dùng và sản phẩm thêm vào đã có sẵn hay chưa => nếu có thì + count
      const oldCart = await CartModel.findOne({
        idUser: idUser,
        idProduct: idProduct,
      }).lean();

      if (oldCart) {
        const updateCart = await CartModel.findOneAndUpdate(
          {
            idUser: idUser,
            idProduct: idProduct,
          },
          { count: oldCart.count + count }
        ).lean();
        res.json({
          message: "updated",
          count: oldCart.count + count,
          idProduct: idProduct,
          idUser: idUser,
        });
      } else {
        res.json({
          message: "Success",
          count: count,
          idProduct: idProduct,
          idUser: idUser,
        });
        CartModel.create({
          count,
          idProduct,
          idUser,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
exports.update = async (req, res, next) => {
  const { idUser, idProduct, count } = req.body;

  try {
    //findOneAndReplace(1,2,3) => 1: nhận vào điều kiện tìm , 2: các thành phần cần chỉnh sửa => gán giá trị nhận được thay giá trị hiện có,  3: trả về dữ liệu mới ngay
    const updateCart = await CartModel.findOneAndReplace(
      {
        idUser: idUser,
        idProduct: idProduct,
      },
      { count: count, idProduct: idProduct, idUser: idUser },
      { new: true }
    );

    res.json(updateCart);
  } catch (err) {
    console.log(err);
  }
};
exports.delete = async (req, res, next) => {
  const { idUser, idProduct } = req.query;
  // Tìm và xóa theo người đăng nhập và sản phẩm được chọn để xóa
  try {
    const productDelete = await CartModel.findOneAndDelete({
      idUser: idUser,
      idProduct: idProduct,
    });
    res.json(productDelete);
  } catch (err) {
    console.log(err);
  }
};
