/**
 * Storage Driver Interface
 * All storage drivers must implement this interface.
 */
export interface StorageDriver {
  /**
   * Save a file buffer to storage.
   * @param filePath - The relative path/key for the file (e.g., "avatars/user123.png")
   * @param buffer - The file data as Buffer
   * @param mimeType - Optional MIME type of the file
   * @returns The public URL of the saved file
   */
  saveFile(
    filePath: string,
    buffer: Buffer,
    mimeType?: string
  ): Promise<string>;

  /**
   * Delete a file from storage.
   * @param filePathOrUrl - The file path/key or full URL to delete
   */
  deleteFile(filePathOrUrl: string): Promise<void>;

  /**
   * Get the public URL of a file.
   * @param filePath - The relative path/key for the file
   * @returns The public URL
   */
  getUrl(filePath: string): string;
}
