// Import Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Loads .env file


// Initialize App
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serves files from 'public' folder (HTML, CSS, JS)

// Connect to MongoDB Atlas
// Make sure your .env file has: 
// MONGO_URL=mongodb+srv://techveli:Kimberly71%21@cluster0.4do64ff.mongodb.net/mongo1

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// define a simple schema and model for demonstration
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model("User", userSchema);

//connect pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.get("/users-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "users.html"));
});

//CRUD Operations
// CREATE user
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE user
app.put("/api/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ===============================
// 7️⃣ Start Server
// ===============================
// Render uses its own port in process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
