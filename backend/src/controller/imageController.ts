import { Request, Response } from "express";
import Images, { IImageData } from "../model/ImgeModel";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../config/cloudinaryConfig";

class ImageController {
  public uploadImage = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const images = req.files as Express.Multer.File[];
      const titles = req.body.titles as string[];
      if (!req.user) {
        return res.status(403).json({ message: "User not authenticated" });
      }
      if (!images || images.length === 0 || !titles || titles.length === 0) {
        return res.status(403).json({ message: "No images uploaded yet" });
      }

      const existingImages = await Images.find({
        userId: (req.user as JwtPayload).id,
      })
        .sort({ order: -1 })
        .limit(1);
      const startingIndex =
        existingImages.length > 0 ? existingImages[0].order + 1 : 0;

      const uploadPromises = images.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const uploadResults = await Promise.all(uploadPromises);

      const imageDetails: IImageData[] = uploadResults.map((result, index) => ({
        userId: (req.user as JwtPayload).id,
        title: Array.isArray(titles) ? titles[index] : titles,
        imageUrl: result.secure_url,
        order: startingIndex + index,
      }));

      await Images.insertMany(imageDetails);

      res
        .status(200)
        .json({ message: "Images uploaded successfully", success: true });
    } catch (error) {
      res.status(500).json({
        message: "somthing went wrong on upload images",
        success: false,
      });
    }
  };

  public fetchAllImages = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = (req.user as JwtPayload).id;
      const allImages = await Images.find({ userId });
      if (allImages.length > 0) {
        res.status(200).json({ message: "", success: true, data: allImages });
      } else {
        res.status(200).json({ message: "", success: false, data: allImages });
      }
    } catch (error) {
      res.status(500).json({
        message: "somthing went wrong on upload images",
        success: false,
      });
    }
  };

  public updateImage = async (req: Request, res: Response) => {
    try {
      const { imageId } = req.params;
      const { title } = req.body;
      const image = req.file;
      const existingImage = await Images.findById(imageId);
      let updateImageurl = existingImage?.imageUrl;
      let updatedTitle = existingImage?.title;
      if (title) {
        updatedTitle = title;
      }
      if (image) {
        const result = await cloudinary.uploader.upload(image?.path);
        updateImageurl = result.secure_url;
      }

      const update = await Images.updateOne(
        { _id: imageId },
        { $set: { imageUrl: updateImageurl, title: updatedTitle } },
        { new: true }
      ).exec();
      console.log("update", update);
      res.status(200).json({
        message: "successfully UpdatedImge",
        success: true,
        data: update,
      });
    } catch (error) {
      res.status(500).json({
        message: "somthing went wrong on update images",
        success: false,
      });
    }
  };

  public deleteImage = async (req: Request, res: Response) => {
    try {
      const { imageId } = req.params;
      await Images.findByIdAndDelete(imageId);
      res.status(200).json({ messge: "successfully deleted", success: true });
    } catch (error) {
      res.status(500).json({
        message: "somthing went wrong on delete images",
        success: false,
      });
    }
  };
}

export default new ImageController();
