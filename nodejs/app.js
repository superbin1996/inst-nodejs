require("dotenv").config();
require('express-async-errors')
const notFoundMiddleware = require("./middleware/not-found");
const authenticateUser = require('./middleware/authentication')

const express = require("express");
const app = express();
// for using req.body
app.use(express.json())


const connectDB = require('./db/connect')

// // routers
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts')
const errorHandlerMiddleware = require("./middleware/error-handler");

// app.get("/", (req, res) => {
//   res.send("Hello");
// });

// // routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/posts', authenticateUser, postRouter)

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
