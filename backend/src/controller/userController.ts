import { Request, Response } from "express";
import User, { IUser } from "../model/userModel";

import bcrypt from "bcryptjs";
import {
  createAuthToken,
  createResetToken,
  validateToken,
} from "../utils/jwtGenerate";
import { SendToMail } from "../utils/nodemailer";
import { TokenExpiredError } from "jsonwebtoken";

const saltRounds = 10;
const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, saltRounds);
};

class UserController {
  public register = async (req: Request, res: Response) => {
    try {
      const { email, password, phoneNumber } = req.body;
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        res
          .status(409)
          .json({ message: "User Already Exist", data: "", success: false });
        return;
      }
      const hashedPassword = hashPassword(password);
      const newUser = new User({
        email,
        password: hashedPassword,
        phoneNumber,
      });
      await newUser.save();
      const accessToken = createAuthToken(newUser._id);
      const userResponse: IUser = newUser.toObject();
      userResponse.password = "";
      res.status(201).json({
        message: "User Created successfull",
        data: userResponse,
        success: true,
        accessToken: accessToken,
      });
    } catch (error) {
      console.log("error on register", error);
      res
        .status(500)
        .json({ messsage: "Internal sever error", error, success: false });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const existEmail = await User.findOne({ email });
      if (!existEmail) {
        res.status(404).json({ messsage: "User Not found", success: false });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existEmail.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", success: false });
      }

      const accessToken = createAuthToken(existEmail._id);
      const userResponse = existEmail.toObject();
      userResponse.password = "";
      res.status(200).json({
        message: "Login successful",
        data: userResponse,
        success: true,
        accessToken: accessToken,
      });
    } catch (error) {
      res
        .status(500)
        .json({ messsage: "Internal sever error", error, success: false });
    }
  };

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const existUser = await User.findOne({ email });
      if (!existUser) {
        res.status(404).json({ message: "User Not foud ", success: false });
        return;
      }

      const accessToken = createResetToken(existUser._id);
      const context = `http://localhost:5173/resetPassword/${accessToken}`;

      await SendToMail(email, context);

      res.status(200).json({
        message: "Reset Password Link send to your Mail",
        success: true,
      });
    } catch (error) {
      console.log("error", error);
      res
        .status(500)
        .json({ messsage: "Internal sever error", error, success: false });
    }
  };

  public validateResetToken = (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const decoded = validateToken(token, "reset");
      return res
        .status(200)
        .json({ message: "Token valid", userId: decoded.id, success: true });
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res
        .status(400)
        .json({ message: "Invalid token", error: error.message });
    }
  };

  public resetPassoword = async (req: Request, res: Response) => {
    try {
      const { token,newPassword } = req.body;


      const decoded = validateToken(token, "reset");
      const existUser = await User.findById(decoded.id);
      if (!existUser) {
        return res
          .status(404)
          .json({ message: "User not found ", success: false });
      }
      const hashedPassword = hashPassword(newPassword);
      await User.findByIdAndUpdate(decoded.id, {
        $set: { password: hashedPassword },
      });

      res
        .status(200)
        .json({ message: "successfully reset  password", success: true });
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }
      console.log("error", error);
      return res
        .status(500)
        .json({ message: "internal Server error ", error: error.message });
    }
  };
}

export default new UserController();
