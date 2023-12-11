const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

exports.sendEmailService = async (
  idUser, // Không xóa
  phone,
  address,
  fullName,
  productArr,
  total,
  to
) => {
  console.log("productArr", productArr);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_USERNAME, // gmail của mình : là người gửi thông tin đặt hàng cho khách
      pass: process.env.EMAIL_PASSWORD, // pass được tạo cấp 2 mã hóa để bảo mật thông tin gmail của mình
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"ShopPumkk" <nguyenhoi130499@gmail.com>', // email của mình gửi tin nhắn đi
    to: to, // email của người nhận
    subject: "Đơn đặt hàng của bạn tại ShopPumkk", // Tiêu đề của email
    text: "Hello world?", // plain text body
    html: `
          <div className="table-responsive mb-4">
            <h2>Dear ${fullName}</h2>
            <p>Phone: ${phone}</p>
            <p>Address: ${address}</p>
            <table className="table">
              <thead className="bg-light">
                <tr className="text-center">
                  <th className="border-0" scope="col">
                    <strong className="text-small text-uppercase">Tên sản phẩm</strong>
                  </th>
                  <th className="border-0" scope="col">
                    <strong className="text-small text-uppercase">Hình ảnh</strong>
                  </th>
    
                  <th className="border-0" scope="col">
                    <strong className="text-small text-uppercase">Giá</strong>
                  </th>
                  <th className="border-0" scope="col">
                    <strong className="text-small text-uppercase">Số lượng</strong>
                  </th>
                  <th className="border-0" scope="col">
                    <strong className="text-small text-uppercase">Thành tiền</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
              ${productArr?.map(
                (value, index) =>
                  `<tr className="text-center" key={index}>
                  <td className="align-middle border-0">
                    <div className="media align-items-center justify-content-center">
                      ${value.nameProduct}
                    </div>
                  </td>
                  <td className="pl-0 border-0">
                    <div className="media align-items-center justify-content-center">
                      <img src=${value.img} alt="..." width="70" />
                    </div>
                  </td>
  
                  <td className="align-middle border-0">
                    <p className="mb-0 small">${parseInt(
                      value.priceProduct
                    ).toLocaleString()} VND</p>
                  </td>
                  <td className="align-middle border-0">
                    <div className="quantity justify-content-center">
                      <span
                        className="form-control form-control-sm text-center border-0 shadow-0 p-0"
                        type="text"
                      >${value.count}</span>
                    </div>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">
                      ${(
                        parseInt(value.priceProduct) * parseInt(value.count)
                      ).toLocaleString()} VND
                    </p>
                  </td>
                </tr>`
              )}
              <p>Tổng Thanh Toán:</p>
                <span>${parseInt(total).toLocaleString()}/VND</span>
                <h2>Cảm ơn bạn!</h2>
              </tbody>
            </table>
          </div>`,
  });
  return info;
};
