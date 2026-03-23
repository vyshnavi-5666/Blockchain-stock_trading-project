const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  aadhaar: String,
  name: String,
  email: String,
  password: String,
  balance: { type: Number, default: 10000 },
  portfolio: [
    {
      stock: String,
      quantity: Number
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);