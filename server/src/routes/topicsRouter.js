import express from "express";

import topicsController from "../controller/topicsController.js";
import methodNotAllowed from "../utils/methodNotAllowed.js";

const router = express.Router();

router.route("/").get(topicsController.getAllTopics).all(methodNotAllowed);

export default router;
