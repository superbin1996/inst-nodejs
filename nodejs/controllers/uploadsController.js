const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomAPIError = require("../errors/custom-api");

const uploadPostImage = async (req, res) => {
  // console.log(req.files);
  // Check uploaded or not
  if (!req.files) {
    throw new CustomAPIError("No file uploaded", StatusCodes.BAD_REQUEST);
  }
  let postImage = req.files.image;

  // Check headers data type
  if (!postImage.mimetype.startsWith('image')){
    throw new CustomAPIError('Please upload image', StatusCodes.BAD_REQUEST)
  }

  const maxSize = 1024*1024

  if(postImage.size > maxSize){
    throw new CustomAPIError('File size must be less than 4000kb', StatusCodes.BAD_REQUEST)
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${postImage.name}`
  );
  await postImage.mv(imagePath);

  res
    .status(StatusCodes.CREATED)
    .send({ image: { src: `/uploads/${postImage.name}` } });
};

module.exports = { uploadPostImage };
