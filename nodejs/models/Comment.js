const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: {type:String, required: [true, 'Please provide comment']},
}, {timestamps:true});

module.exports = mongoose.model("Comment", CommentSchema);
