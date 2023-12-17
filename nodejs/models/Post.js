const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    status: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
