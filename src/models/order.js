const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  idUser: { type: String, required: true, ref: "User" },
  products: [
    {
      idProduct: { type: String, required: true, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  fullName: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  total: { type: Number, required: true },
  delivery: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
