require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your routes
const garmentRoutes = require('./routes/garments'); 
const userRoutes = require('./routes/users');
const earningsRoute = require("./routes/earnings");

const app = express();   // ✅ app must be created first
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.Mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "TailorManage"
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/garments', garmentRoutes);
app.use('/api/users', userRoutes);   // ✅ now works
app.use("/api/earnings", earningsRoute);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
