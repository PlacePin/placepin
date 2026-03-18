import type { Request, Response } from "express";
import { Readable } from "stream";
import cloudinary from "../../middleware/cloudinary";
import { getUserById, updateUserById, excludeFields } from "../../utils/user";

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : null;
}

export const uploadProfilePic = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Invalid token" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const currentUser = await getUserById(userId, excludeFields);
    const oldProfilePic = (currentUser as any)?.profilePic as string | undefined;

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_pics", resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve(result);
        }
      );
      Readable.from(req.file!.buffer).pipe(uploadStream);
    });

    const updatedUser = await updateUserById(userId, { profilePic: result.secure_url });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    if (oldProfilePic) {
      const publicId = extractPublicId(oldProfilePic);
      if (publicId) cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    res.status(200).json({ profilePic: result.secure_url });
  } catch (err) {
    console.error("Profile pic upload error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
};
