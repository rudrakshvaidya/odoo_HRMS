const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
