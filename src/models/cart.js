const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  count: { type: Number, required: true },
  idProduct: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  idUser: { type: String, required: true, ref: "User" }, //idUser  là email của người dùng
});

module.exports = mongoose.model("Cart", cartSchema);
