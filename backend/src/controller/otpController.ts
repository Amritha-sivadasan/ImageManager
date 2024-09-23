import { Request, Response } from "express";
import { Otp } from "../model/otpModel";

import User from "../model/userModel";
import { generateOtp } from "../utils/otp-generatot";
import { sendOtp } from "../utils/nodemailer";

class OtpController {
  public sendOtptoUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const existEmail = await User.findOne({ email });
      if (existEmail) {
        res.status(409).json({
          success: false,
          message: "User Aleady Exist Please try with another email",
        });
        return;
      }

      const otp = await generateOtp();
      await Otp.updateOne({ email }, { $set: { otp } }, {upsert: true })
     await sendOtp(email, otp);

      res.status(200).json({ message: "Otp send successfully", success: true });
    } catch (error) {
      console.log('eroor',error);
      
      res.status(500).json({message:'Internal server error', error,  success:false})
    }
  };


   public verifyOtp=  async(req:Request,res:Response)=>{
    try {
      const {email, otp}= req.body

      if(!email){
        return res.status(404).json({message:'Email is not found',success:false,})
      }
      const otpExist = await Otp.findOne({email})
      if(!otpExist){
        return res.status(404).json({message:"Invalid Otp",success:false})
      }
        
      if(otpExist && otpExist.otp !==otp){
        return res.status(404).json({message:"Invalid Otp",success:false})
      }

       await Otp.deleteOne({email})
      res.status(200).json({message:"Otp verified Successfully",success:true})
     
    } catch (error) {
        res.status(500).json({message:'Internal server error', error,  success:false})
    }
   }
}

export default new OtpController()
