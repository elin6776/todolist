const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/lib/main").config();

const Post = require("./models/Post");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/posts/:id", async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (updatedPost) {
        res.status(200).json(updatedPost);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

app.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

