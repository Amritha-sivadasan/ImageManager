import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id:string
  email: string;
  phoneNumber: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User",userSchema);
export default User