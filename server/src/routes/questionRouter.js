import express from "express";
const router = express.Router();
import questionController from "../controller/questionController.js";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import verifyAuth from "../middlewares/verifyAuth.js";

router
  .route("/ask")
  .post(verifyAuth, questionController.askQuestion)
  .all(methodNotAllowed);

router
  .route("/get")
  .get(questionController.getQuestionsByTopicNames)
  .all(methodNotAllowed);

router
  .route("/topic/:topicName")
  .get(questionController.getQuestionsByATopic)
  .all(methodNotAllowed);

router.route("/").get(questionController.getAllQuestions).all(methodNotAllowed);
router
  .route("/random")
  .get(questionController.getAllQuestionsByRandom)
  .all(methodNotAllowed);

router
  .route("/:questionId/like")
  .put(verifyAuth, questionController.likeAQuestion)
  .all(methodNotAllowed);

router
  .route("/:questionId/dislike")
  .put(verifyAuth, questionController.dislikeAQuestion)
  .all(methodNotAllowed);

router
  .route("/find/:questionId")
  .get(questionController.getASingleQuestion)
  .all(methodNotAllowed);

export default router;
