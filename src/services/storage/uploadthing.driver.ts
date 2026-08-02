import { UTApi } from "uploadthing/server";
import type { StorageDriver } from "./storage.interface";

/**
 * UploadThing storage driver.
 * Uses UTApi for server-side file operations.
 * Requires UPLOADTHING_TOKEN environment variable.
 */
export class UploadThingDriver implements StorageDriver {
  private utapi: UTApi;

  constructor() {
    this.utapi = new UTApi();
  }

  async saveFile(
    filePath: string,
    buffer: Buffer,
    mimeType?: string
  ): Promise<string> {
    // Extract filename from path
    const fileName = filePath.split("/").pop() || filePath;

    // Cast to BlobPart — Buffer is compatible at runtime but TS strict mode
    // has ArrayBufferLike vs ArrayBuffer type conflict
    const blob = new Blob([buffer as unknown as BlobPart], {
      type: mimeType || "application/octet-stream",
    });
    const file = new File([blob], fileName, {
      type: mimeType || "application/octet-stream",
    });

    const response = await this.utapi.uploadFiles([file]);

    if (!response[0] || response[0].error) {
      const errorMessage =
        response[0]?.error?.message || "Unknown upload error";
      throw new Error(`UploadThing upload failed: ${errorMessage}`);
    }

    // Use ufsUrl (the recommended URL field)
    return response[0].data.ufsUrl;
  }

  async deleteFile(filePathOrUrl: string): Promise<void> {
    let fileKey: string;

    if (
      filePathOrUrl.includes("utfs.io") ||
      filePathOrUrl.includes("uploadthing.com")
    ) {
      // Extract file key from UploadThing URL
      // URL format: https://utfs.io/f/{fileKey} or https://{app}.ufs.sh/f/{fileKey}
      const url = new URL(filePathOrUrl);
      const pathParts = url.pathname.split("/");
      fileKey = pathParts[pathParts.length - 1] || filePathOrUrl;
    } else {
      fileKey = filePathOrUrl;
    }

    try {
      await this.utapi.deleteFiles([fileKey]);
    } catch {
      // Silently ignore delete errors (file may not exist)
    }
  }

  getUrl(filePath: string): string {
    // For UploadThing, the URL is returned after upload and should be stored.
    // This method cannot reliably construct a URL without the file key.
    return filePath;
  }
}
