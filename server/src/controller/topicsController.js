import Topic from "../models/topic.js";

const getAllTopics = async (req, res) => {
  const topics = await Topic.find({});
  res.status(200).json({ topics });
};

export default { getAllTopics };
