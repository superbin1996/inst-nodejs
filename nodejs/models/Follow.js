const { default: mongoose } = require("mongoose");

const FollowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required:true, ref: "User" },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {timestamps:true});

FollowSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Follow", FollowSchema);
