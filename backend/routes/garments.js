const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Garment = require("../models/garment");
const twilio = require("../node_modules/twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// ✅ Helper: Normalize phone numbers into E.164
function formatPhoneNumber(phone) {
  if (!phone) return null;

  let cleaned = phone.replace(/\D/g, ""); // remove non-digits

  // If number starts with 0 and is 11 digits → remove leading 0
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // If it's 10 digits (Indian number), prefix with +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // If it starts with "91" and is 12 digits, prefix "+"
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned}`;
  }

  // If already includes "+", return as is
  if (phone.startsWith("+")) {
    return phone;
  }

  return null; // invalid
}

// POST - Save garment
router.post("/", async (req, res) => {
  try {
    const { garmentType, measurements, submitDate, cost, userId, phoneNumber } = req.body;

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const newGarment = new Garment({
      garmentType,
      measurements,
      submitDate,
      cost,
      userId,
      phoneNumber: formattedPhone, // ✅ store normalized phone
    });

    await newGarment.save();
    res.status(201).json({ message: "Garment saved successfully!", garment: newGarment });
    console.log("✅ Saved garment:", newGarment);
  } catch (error) {
    console.error("❌ Error saving garment:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch garments for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId); // cast properly
    const garments = await Garment.find({ userId });
    res.json(garments);
  } catch (error) {
    console.error("❌ Error fetching garments:", error);
    res.status(500).json({ error: "Error fetching garments" });
  }
});

// DELETE - Remove garment
router.delete("/:id", async (req, res) => {
  try {
    await Garment.findByIdAndDelete(req.params.id);
    res.json({ message: "Garment deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting garment:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update garment
router.put("/:id", async (req, res) => {
  try {
    const { measurements, submitDate, status, cost, phoneNumber } = req.body;
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const updatedGarment = await Garment.findByIdAndUpdate(
      req.params.id,
      { measurements, submitDate, status, cost, phoneNumber: formattedPhone },
      { new: true }
    );

    res.json(updatedGarment);
  } catch (error) {
    console.error("❌ Error updating garment:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update only garment status and send SMS if Completed
router.put("/:id/status", async (req, res) => {
  try {
    const garment = await Garment.findById(req.params.id);

    if (!garment) {
      return res.status(404).json({ message: "Garment not found" });
    }

    garment.status = req.body.status;
    await garment.save();

    // ✅ Send SMS when status becomes "Completed"
    if (garment.status === "Completed" && garment.phoneNumber) {
      try {
        await client.messages.create({
          body: `Hello! Your ${garment.garmentType} is now ready for pickup ✅`,
          from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
          to: garment.phoneNumber, // already normalized
        });
        console.log(`📩 SMS sent to ${garment.phoneNumber}`);
      } catch (smsErr) {
        console.error("❌ SMS sending failed:", smsErr);
      }
    }

    res.json({ message: "Status updated (SMS sent if Completed)" });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
