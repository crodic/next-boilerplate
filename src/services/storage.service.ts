import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import { env } from "@/env";
import path from "path";

// Initialize the driver based on env
let driver: any;

if (env.STORAGE_DISK === "s3") {
  // S3 setup requires installing `@flydrive/s3`
  throw new Error(
    "S3 driver is not implemented yet. Install @flydrive/s3 to use it."
  );
} else {
  // Local File System driver
  driver = new FSDriver({
    location: path.join(process.cwd(), "uploads"),
    visibility: "public",
  });
}

export const disk = new Disk(driver);

export class StorageService {
  /**
   * Save a file buffer to storage
   */
  static async saveFile(
    filePath: string,
    buffer: Buffer | ArrayBuffer | Uint8Array
  ): Promise<string> {
    const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as any);
    await disk.put(filePath, data);
    return this.getUrl(filePath);
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    const exists = await disk.exists(filePath);
    if (exists) {
      await disk.delete(filePath);
    }
  }

  /**
   * Get the public URL of a file
   */
  static getUrl(filePath: string): string {
    if (env.STORAGE_DISK === "s3") {
      return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${filePath}`;
    }
    // Local API route
    return `/api/uploads/${filePath}`;
  }

  /**
   * Read file stream
   */
  static async getStream(filePath: string) {
    return disk.getStream(filePath);
  }

  /**
   * Read file bytes
   */
  static async getBytes(filePath: string) {
    return disk.getBytes(filePath);
  }
}
