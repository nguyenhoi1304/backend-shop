const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: "client", require: true },
});

module.exports = mongoose.model("User", userSchema);
