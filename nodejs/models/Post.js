const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    status: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // image: {type:String, required:[true, "Please upload image"]},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
