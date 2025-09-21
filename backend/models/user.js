const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // later we can hash this with bcrypt
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
