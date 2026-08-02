import { storageDriver, LocalDriver } from "./storage";

/**
 * Storage Service - Facade for file storage operations.
 * Delegates to the configured storage driver (local, cloudinary, uploadthing, s3).
 */
export class StorageService {
  /**
   * Save a file buffer to storage
   */
  static async saveFile(
    filePath: string,
    buffer: Buffer | ArrayBuffer | Uint8Array,
    mimeType?: string
  ): Promise<string> {
    const data = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer as any);
    return storageDriver.saveFile(filePath, data, mimeType);
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePathOrUrl: string): Promise<void> {
    return storageDriver.deleteFile(filePathOrUrl);
  }

  /**
   * Get the public URL of a file
   */
  static getUrl(filePath: string): string {
    return storageDriver.getUrl(filePath);
  }

  /**
   * Read file stream (only available for local driver)
   */
  static async getStream(filePath: string) {
    if (storageDriver instanceof LocalDriver) {
      return storageDriver.getStream(filePath);
    }
    throw new Error("getStream is only available for local storage driver");
  }

  /**
   * Read file bytes (only available for local driver)
   */
  static async getBytes(filePath: string) {
    if (storageDriver instanceof LocalDriver) {
      return storageDriver.getBytes(filePath);
    }
    throw new Error("getBytes is only available for local storage driver");
  }
}
