const { default: mongoose } = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, required:true, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, required:true, ref: "User" },
    isLike: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LikeSchema.index({ post: 1, user: 1}, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
