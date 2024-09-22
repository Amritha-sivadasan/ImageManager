import { Router } from "express";
import userController from "../controller/userController";
import otpController from "../controller/otpController";

const router = Router();

router.post("/register", userController.register);
router.post("/sendOtp", otpController.sendOtptoUser);
router.post("/verifyOtp", otpController.verifyOtp);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.get("/validateToken/:token", userController.validateResetToken);
router.post('/resetPassword',userController.resetPassoword)


export default router;
