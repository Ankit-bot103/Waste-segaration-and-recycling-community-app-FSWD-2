const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ serve frontend

mongoose
  .connect("mongodb://127.0.0.1:27017/wasteApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  points: { type: Number, default: 0 }
}));

const Report = mongoose.model("Report", new mongoose.Schema({
  name: String,
  wasteType: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
}));

const Recycle = mongoose.model("Recycle", new mongoose.Schema({
  userEmail: String,
  type: String,
  quantity: Number,
  createdAt: { type: Date, default: Date.now }
}));

app.post("/api/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name & email required" });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email });
      await user.save();
    }
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/report", async (req, res) => {
  try {
    const { name, wasteType, description } = req.body;
    const report = new Report({ name, wasteType, description });
    await report.save();
    res.json({ message: "Report saved" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/load-reports", async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

app.post("/api/recycle", async (req, res) => {
  try {
    let { userEmail, type, quantity } = req.body;
    quantity = Number(quantity);

    if (!userEmail || !type || isNaN(quantity) || quantity <= 0)
      return res.status(400).json({ error: "Invalid data" });

    const recycle = new Recycle({ userEmail, type, quantity });
    await recycle.save();

    let user = await User.findOne({ email: userEmail });
    if (user) {
      user.points += quantity * 10;
      await user.save();
    }

    res.json({ message: "Recycling saved", recycle, newPoints: user.points });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/recycle-list", async (req, res) => {
  const list = await Recycle.find().sort({ createdAt: -1 });
  res.json(list);
});

app.get("/api/user-points/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json({ points: user ? user.points : 0 });
});

app.get("/api/centers", (req, res) => {
  res.json([
    { name: "Green Earth Recycling Center", distance: 2 },
    { name: "EcoBin Facility", distance: 3.5 }
  ]);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
