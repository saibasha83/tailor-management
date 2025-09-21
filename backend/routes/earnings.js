const express = require("express");
const mongoose = require("mongoose"); // ✅ FIXED
const router = express.Router();
const Garment = require("../models/garment");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("userId received:", userId);

    if (!userId) return res.status(400).json({ message: "userId required" });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const earnings = await Garment.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submitDate" } },
          total: { $sum: "$cost" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = earnings.map((e) => ({ date: e._id, amount: e.total }));
    res.json(result);
  } catch (err) {
    console.error("Earnings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
