import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "@/env";
import type { StorageDriver } from "./storage.interface";

/**
 * Cloudinary storage driver.
 * Uploads files to Cloudinary CDN.
 */
export class CloudinaryDriver implements StorageDriver {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async saveFile(
    filePath: string,
    buffer: Buffer,
    _mimeType?: string
  ): Promise<string> {
    // Remove file extension from public_id (Cloudinary adds it automatically)
    const publicId = filePath.replace(/\.[^/.]+$/, "");

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "auto",
          folder: "", // Use filePath as-is (e.g., "avatars/user123")
          overwrite: true,
        },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
            return;
          }
          if (!result) {
            reject(new Error("Cloudinary upload returned no result"));
            return;
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });
  }

  async deleteFile(filePathOrUrl: string): Promise<void> {
    let publicId: string;

    if (filePathOrUrl.includes("cloudinary.com")) {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
      const urlParts = filePathOrUrl.split("/upload/");
      if (urlParts[1]) {
        // Remove version prefix (v1234567890/) and file extension
        publicId = urlParts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
      } else {
        publicId = filePathOrUrl.replace(/\.[^/.]+$/, "");
      }
    } else {
      publicId = filePathOrUrl.replace(/\.[^/.]+$/, "");
    }

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // Silently ignore delete errors (file may not exist)
    }
  }

  getUrl(filePath: string): string {
    // For Cloudinary, the URL is generated after upload and stored.
    // This method is a fallback that constructs a predictable URL.
    const publicId = filePath.replace(/\.[^/.]+$/, "");
    return cloudinary.url(publicId, { secure: true });
  }
}
