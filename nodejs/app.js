const path = require('path')
require("dotenv").config();
require('express-async-errors')
// extra security packages
const helmet = require('helmet');
const cors = require('cors');
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

const notFoundMiddleware = require("./middleware/not-found");
const authenticatedUser = require('./middleware/authentication')
const allowAny = require('./middleware/allowAny')

const express = require("express");
const app = express();
const fileUpload = require('express-fileupload')

app.use(express.static('./public'))
// app.use(express.static(path.resolve(__dirname, '../react/src/assets/images')));


app.set('trust proxy', 2);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );
// for using req.body
app.use(express.json())
app.use(helmet());
app.use(cors());
// app.use(xss());
app.use(fileUpload())

const connectDB = require('./db/connect')

// // routers
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts')
const getPostRouter = require('./routes/post')
const getFollowRouter = require('./routes/getFollow')
const followRouter = require('./routes/follow')
const commentRouter = require('./routes/comments')
const getLikeRouter = require('./routes/getLike')
const likeRouter = require('./routes/like')
const profileRouter = require('./routes/profile')
const errorHandlerMiddleware = require("./middleware/error-handler");

// app.get("/", (req, res) => {
//   res.send("Hello");
// });
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
// });

// // routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/getFollow', allowAny, getFollowRouter)
app.use('/api/v1/follow', authenticatedUser, followRouter)
app.use('/api/v1/comments', authenticatedUser, commentRouter)
app.use('/api/v1/posts', authenticatedUser, postRouter)
app.use('/api/v1/post', allowAny, getPostRouter)
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
