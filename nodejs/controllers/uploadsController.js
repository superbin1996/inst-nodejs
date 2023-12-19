const path = require('path')

const uploadPostImage = async (req, res) => {
  console.log(req);
  let postImage = req.files.image;
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${postImage.name}`
  );
  await postImage.mv(imagePath);

  res.send("upload file");
};

module.exports = { uploadPostImage };
