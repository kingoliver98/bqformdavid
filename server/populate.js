import Topic from "./src/models/topic.js";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/connectDB.js";
import topicData from "./topics.json" assert { type: "json" };

const populateDBWithTopics = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Topic.deleteMany();
    await Topic.insertMany(topicData);

    console.log("Topics added successfully!");
  } catch (error) {
    console.log(`Could not upload because of ${error.message}`);
  }
};

populateDBWithTopics();
