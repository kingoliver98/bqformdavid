import express from "express";
const router = express.Router();
import commentController from "../controller/commentController.js";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import verifyAuth from "../middlewares/verifyAuth.js";

router
  .route("/create/:questionId")
  .post(verifyAuth, commentController.makeAComment)
  .all(methodNotAllowed);

router
  .route("/get/:questionId")
  .get(commentController.getComments)
  .all(methodNotAllowed);

export default router;
