require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const Request = require("./models/Request");
const authRoutes = require("./routes/auth");
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: 'https://client-8q74.onrender.com'  
}));
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);

app.post("/api/requests", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error saving request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/requests", async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/api/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/requests/latest", async (req, res) => {
  try {
    const latestRequest = await Request.findOne().sort({ _id: -1 });
    res.json(latestRequest || {});
  } catch (error) {
    console.error("Error fetching latest request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
