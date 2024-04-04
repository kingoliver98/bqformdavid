import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const app = express();

import connectDB from "./src/config/connectDB.js";

import authRouter from "./src/routes/authRouter.js";
import topicsRouter from "./src/routes/topicsRouter.js";
import questionRouter from "./src/routes/questionRouter.js";
import commentRouter from "./src/routes/commentRouter.js";

import notFound from "./src/middlewares/notFound.js";
import errorHandler from "./src/middlewares/error.js";

const port = process.env.PORT || 3000;

// allows request from all urls
app.use(cors());

// allows us have access to the req.body
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/questions", questionRouter);
app.use("/api/comments", commentRouter);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    // connect to the db first
    await connectDB(process.env.MONGO_URI);
    console.log("DB Connected!");

    // server starts listening
    app.listen(port, () => {
      console.log(`Server is Listening on port: ${port}`);
    });
  } catch (error) {
    console.log(`Could not connect because of: ${error.message}`);
  }
};

startServer();
