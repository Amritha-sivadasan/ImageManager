import mongoose, { Document, Schema } from "mongoose";

export interface IImageData extends Document {
  useId: mongoose.Types.ObjectId;
  imageUrl: string;
  title: string;
  order: number;
}

const ImageSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  imageurl: { type: String, required: true },
  title:{type:String, required:true},
  order:{type:Number,required:true}
},{timestamps:true});


const Images= mongoose.model<IImageData>('Image',ImageSchema)

export default Images