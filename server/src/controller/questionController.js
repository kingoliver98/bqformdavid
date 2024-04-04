import Question from "../models/question.js";
import User from "../models/user.js";
import Topic from "../models/topic.js";

const askQuestion = async (req, res, next) => {
  const { userId } = req.user;
  const { title, topic, question, image } = req.body;

  if (!title || !topic || !question) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const chooseTopic = await Topic.findOne({ name: topic });
    if (!chooseTopic) {
      return res.status(400).json({
        message: "Topic selected not found",
      });
    }
    const questionData = {
      title,
      topic: chooseTopic.name,
      question,
      askedBy: user._id,
      image,
    };
    const questions = await Question.create(questionData);
    res.status(201).json({ questions, msg: "Question created successfully" });
  } catch (error) {
    next(error);
  }
};

const getQuestionsByTopicNames = async (req, res, next) => {
  const { q: topicNames } = req.query;
  if (!topicNames) {
    return res.status(400).json({
      message: "Topic params is missing",
    });
  }
  try {
    const questions = await Question.find({ topic: topicNames }).populate(
      "askedBy",
      "username profilePhoto"
    );
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

const getQuestionsByATopic = async (req, res, next) => {
  const { topicName } = req.params;
  if (!topicName) {
    return res.status(400).json({
      message: "Topic params is missing",
    });
  }
  try {
    const questions = await Question.find({ topic: topicName }).populate(
      "askedBy",
      "profilePhoto username"
    );
    if (!questions) {
      return res.status(404).json({
        message: `Could not find questions matching ${topicName}`,
      });
    }
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find().populate(
      "askedBy",
      "profilePhoto username"
    );
    if (!questions) {
      return res.status(504).json({
        message: "Could not get questions",
      });
    }
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

const getAllQuestionsByRandom = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .populate("askedBy", "profilePhoto username")
      .sort({ _id: -1 });
    if (!questions) {
      return res.status(504).json({
        message: "Could not get questions",
      });
    }
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

const likeAQuestion = async (req, res, next) => {
  const { userId } = req.user;
  const { questionId } = req.params;
  if (!userId && !questionId) {
    return res.status(504).json({
      message: "userId and Question params missing",
    });
  }
  try {
    const question = await Question.findByIdAndUpdate(questionId, {
      $addToSet: { likes: userId },
    });

    if (!question) {
      return res.status(504).json({
        message: "Question not found",
      });
    }
    if (question.likes.includes(userId)) {
      res.status(500).send("You already liked this question");
    }
    res.status(200).json("Question liked");
  } catch (error) {
    next(error);
  }
};

const dislikeAQuestion = async (req, res, next) => {
  const { userId } = req.user;
  const { questionId } = req.params;
  if (!userId && !questionId) {
    return res.status(504).json({
      message: "userId and Question params missing",
    });
  }
  try {
    const question = await Question.findByIdAndUpdate(questionId, {
      $pull: { likes: userId },
    });

    if (!question) {
      return res.status(504).json({
        message: "Question not found",
      });
    }
    res.status(200).json("Question disliked");
  } catch (error) {
    next(error);
  }
};

const getASingleQuestion = async (req, res, next) => {
  const { questionId } = req.params;
  if (!questionId) {
    return res.status(504).json({
      message: "Question params missing",
    });
  }
  try {
    const question = await Question.findById(questionId).populate(
      "askedBy",
      "profilePhoto username"
    );
    if (!question) {
      return res.status(504).json({
        message: "Question not found",
      });
    }
    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};

export default {
  askQuestion,
  getQuestionsByTopicNames,
  getQuestionsByATopic,
  getAllQuestions,
  getAllQuestionsByRandom,
  likeAQuestion,
  dislikeAQuestion,
  getASingleQuestion,
};
