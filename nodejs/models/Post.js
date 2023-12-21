const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    status: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    image: { type: String, default: '/uploads/OIG.GxnYU.1GGy0NmEQ3sn8s.jpg' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
