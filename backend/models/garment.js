const mongoose = require("mongoose");

const garmentSchema = new mongoose.Schema({
  garmentType: { type: String, required: true },
  measurements: { type: Object, required: true },
  submitDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  cost:{type: Number,required:true},
  phoneNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ link to user
});

module.exports = mongoose.model("Garment", garmentSchema);
