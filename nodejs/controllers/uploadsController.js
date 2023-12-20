const { StatusCodes } = require("http-status-codes");
const path = require("path");

const uploadPostImage = async (req, res) => {
  console.log(req);
  let postImage = req.files.image;
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${postImage.name}`
  );
  await postImage.mv(imagePath);

  res
    .status(StatusCodes.CREATED)
    .send({ image: { src: `/upload/${postImage.name}` } });
};

module.exports = { uploadPostImage };
