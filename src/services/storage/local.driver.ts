import { Disk } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import path from "path";
import type { StorageDriver } from "./storage.interface";

/**
 * Local filesystem storage driver using flydrive.
 * Suitable for development environments.
 */
export class LocalDriver implements StorageDriver {
  private disk: Disk;

  constructor() {
    const driver = new FSDriver({
      location: path.join(process.cwd(), "uploads"),
      visibility: "public",
    });
    this.disk = new Disk(driver);
  }

  async saveFile(filePath: string, buffer: Buffer): Promise<string> {
    await this.disk.put(filePath, buffer);
    return this.getUrl(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    const exists = await this.disk.exists(filePath);
    if (exists) {
      await this.disk.delete(filePath);
    }
  }

  getUrl(filePath: string): string {
    return `/api/uploads/${filePath}`;
  }

  /**
   * Read file as a stream (used by the /api/uploads/[...path] serve route)
   */
  async getStream(filePath: string) {
    return this.disk.getStream(filePath);
  }

  /**
   * Read file bytes (used by the /api/uploads/[...path] serve route)
   */
  async getBytes(filePath: string) {
    return this.disk.getBytes(filePath);
  }
}
