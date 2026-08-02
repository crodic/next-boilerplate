import { env } from "@/env";
import type { StorageDriver } from "./storage.interface";
import { LocalDriver } from "./local.driver";
import { CloudinaryDriver } from "./cloudinary.driver";
import { UploadThingDriver } from "./uploadthing.driver";

/**
 * Factory function that creates the appropriate storage driver
 * based on the STORAGE_DISK environment variable.
 */
function createStorageDriver(): StorageDriver {
  switch (env.STORAGE_DISK) {
    case "cloudinary":
      return new CloudinaryDriver();
    case "uploadthing":
      return new UploadThingDriver();
    case "s3":
      throw new Error(
        "S3 driver is not implemented yet. Install @flydrive/s3 to use it."
      );
    case "local":
    default:
      return new LocalDriver();
  }
}

/** Singleton storage driver instance */
export const storageDriver = createStorageDriver();

export { type StorageDriver } from "./storage.interface";
export { LocalDriver } from "./local.driver";
