const { sendEmailService } = require("../services/EmailService");
const OrderModel = require("../models/order");
const ProductModel = require("../models/product");

exports.ordersAll = async (req, res, next) => {
  const data = await OrderModel.find();
  res.json(data);
};

exports.placeOrder = async (req, res, next) => {
  const {
    idUser,
    products,
    delivery,
    status,
    fullName,
    phone,
    address,
    total,
  } = req.body;

  // nếu nhập đầy đủ các trường dữ liệu thì sẽ đặt hàng thành công, tạo đơn đặt hàng  => message: Success
  try {
    if (!idUser || !products || !delivery || !status) {
      res.json({
        message: "fill all",
      });
    } else {
      // hàm này để update lại số lượng sản phẩm khi người dùng đặt hàng thành công
      const updateCountProduct = () =>
        products.map(async (item) => {
          const data = await ProductModel.updateOne(
            { _id: item.idProduct },
            { $inc: { count: -item.quantity } }
          );
          return data;
        });
      updateCountProduct();
      res.json({
        message: "Success",
      });
      OrderModel.create({
        idUser: idUser,
        products: products,
        fullName: fullName,
        phone: +phone,
        address: address,
        total: total,
        delivery: delivery,
        status: status,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.sendEmail = async (req, res, next) => {
  const { idUser, phone, address, fullName, productArr, to } = req.body;

  //Tìm ra tổng số tiền tất cả các sản phẩm cần thanh toán
  const priceProductArr = productArr?.map((value) => {
    return parseInt(value.priceProduct) * parseInt(value.count);
  });
  const total = priceProductArr.reduce((acc, cur) => {
    return acc + cur;
  });

  try {
    //nếu có đăng nhập => gửi thông tin qua hàm SendEmail đính kèm dữ liệu
    if (idUser) {
      const response = await sendEmailService(
        idUser,
        phone,
        address,
        fullName,
        productArr,
        total,
        to
      );
      return res.json(response);
    }
  } catch (e) {
    console.log(e);
    next();
  }
};
