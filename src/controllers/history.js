const orderModel = require("../models/order");
const ProductModel = require("../models/product");

exports.getAll = async (req, res, next) => {
  const result = await orderModel.find();
  res.json(result);
};

exports.detail = async (req, res, next) => {
  const id = req.params.id;

  try {
    const order = await orderModel.findOne({ _id: id }).lean();
    const products = await ProductModel.find().lean();
    //Thông tin khách hàng nhập  khi đặt hàng
    const information = {
      idUser: order._id,
      fullName: order.fullName,
      phone: order.phone,
      address: order.address,
      total: order.total,
    };

    let result = [];
    //tìm và hiển thị ra product có chứa id trong order trùng với id trong product
    for (let i = 0; i < order.products.length; i++) {
      let product = products.filter(
        (value) => value._id == order.products[i].idProduct
      )[0];
      //push các thông tin cần  vào mảng result
      result.push({
        idProduct: product._id,
        imgProduct: product.img1,
        nameProduct: product.name,
        priceProduct: product.price,
        count: order.products[i].quantity,
      });
    }

    res.json({ information: information, cart: result });
  } catch (err) {
    console.log(err);
    next();
  }
};
exports.historiesUser = async (req, res, next) => {
  const idUser = req.query.idUser;
  try {
    // Hiển thị các History của User đang đăng nhập
    const allHistory = await orderModel.find({ idUser: idUser });
    res.json(allHistory);
  } catch (e) {
    console.log(e);
  }
};
