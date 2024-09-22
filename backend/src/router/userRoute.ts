import { Router } from "express";
import userController from "../controller/userController";
import otpController from "../controller/otpController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/multerMiddleware";
import imageController from "../controller/imageController";

const router = Router();

router.post("/register", userController.register);
router.post("/sendOtp", otpController.sendOtptoUser);
router.post("/verifyOtp", otpController.verifyOtp);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.get("/validateToken/:token", userController.validateResetToken);
router.post("/resetPassword", userController.resetPassoword);
router.post(
  "/uploadImage",
  authMiddleware,
  upload.array("images"),
  imageController.uploadImage
);
router.get("/all-images", authMiddleware, imageController.fetchAllImages);
router.put("/updateImage/:imageId", authMiddleware, upload.single("image"),imageController.updateImage);
router.delete('/deleteImage/:imageId',authMiddleware,imageController.deleteImage)

export default router;
