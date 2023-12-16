const getAllPosts = (req, res) => {
  res.status(200).json({ greed: "hello" });
};

const getPost = (req, res) => {
  res.send("get post");
};

const createPost = (req, res) => {
  res.status(200).json(req.user);

};

const updatePost = (req, res) => {
  res.send('update post')
};

const deletePost = (req, res) => {
  res.send("delete post");
};

module.exports = { getAllPosts, getPost, createPost, updatePost, deletePost };
