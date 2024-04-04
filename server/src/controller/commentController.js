import Comment from "../models/comment.js";
import Question from "../models/question.js";
import User from "../models/user.js";

const makeAComment = async (req, res, next) => {
  const { userId } = req.user;
  const { questionId } = req.params;
  const { comment } = req.body;

  if (!userId || !questionId || !comment) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }
  try {
    const question = await Question.findById(questionId).populate(
      "askedBy",
      "username profilePhoto"
    );
    if (!question) {
      return res.status(504).json({
        message: "Question not found",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(504).json({
        message: "User not found",
      });
    }
    const commentObj = {
      comment: comment,
      questionId: questionId,
      askedBy: user._id,
    };
    const addComment = await Comment.create(commentObj);
    res.status(201).json({ addComment, msg: "Comment added successfully" });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  const { questionId } = req.params;

  if (!questionId) {
    return res.status(400).json({
      message: "Question id is missing",
    });
  }

  try {
    const comments = await Comment.find({ questionId: questionId })
      .populate("askedBy", "username profilePhoto")
      .sort({ _id: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export default { makeAComment, getComments };
