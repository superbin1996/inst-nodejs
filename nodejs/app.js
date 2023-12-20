require("dotenv").config();
require('express-async-errors')
const notFoundMiddleware = require("./middleware/not-found");
const authenticatedUser = require('./middleware/authentication')
const allowAny = require('./middleware/allowAny')

const express = require("express");
const app = express();
const fileUpload = require('express-fileupload')

// for using req.body
app.use(express.json())
app.use(fileUpload())

const connectDB = require('./db/connect')

// // routers
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts')
const getFollowRouter = require('./routes/getFollow')
const followRouter = require('./routes/follow')
const commentRouter = require('./routes/comments')
const getLikeRouter = require('./routes/getLike')
const likeRouter = require('./routes/likes')
const profileRouter = require('./routes/profile')
const errorHandlerMiddleware = require("./middleware/error-handler");

// app.get("/", (req, res) => {
//   res.send("Hello");
// });

// // routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/getFollow', allowAny, getFollowRouter)
app.use('/api/v1/follow', authenticatedUser, followRouter)
app.use('/api/v1/comments', authenticatedUser, commentRouter)
app.use('/api/v1/posts', authenticatedUser, postRouter)
app.use('/api/v1/getLike', allowAny, getLikeRouter)
app.use('/api/v1/like', authenticatedUser, likeRouter)
app.use('/api/v1/profile', allowAny, profileRouter)

// error handler
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = 5000;
const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
