import express from "express";
const router = express.Router();
import authController from "../controller/authController.js";
import methodNotAllowed from "../utils/methodNotAllowed.js";
import verifyAuth from "../middlewares/verifyAuth.js";

router.route("/").get(verifyAuth, authController.getUser).all(methodNotAllowed);
router.route("/signup").post(authController.signupUser).all(methodNotAllowed);
router.route("/signin").post(authController.signinUser).all(methodNotAllowed);

export default router;
