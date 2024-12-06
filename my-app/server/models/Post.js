const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true }); // Automatically manage `createdAt` and `updatedAt`

module.exports = mongoose.model("Post", PostSchema);

