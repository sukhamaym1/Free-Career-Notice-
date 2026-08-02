import { StorageProvider, MediaFile } from './types';

export class MediaService {
  private provider: StorageProvider;

  constructor(provider: StorageProvider) {
    this.provider = provider;
  }

  async listImages(): Promise<MediaFile[]> {
    try {
      return await this.provider.listImages();
    } catch (error) {
      console.error('Failed to list images:', error);
      throw new Error('Failed to load media library.');
    }
  }

  async uploadFile(file: File, fileName: string): Promise<string> {
    try {
      return await this.provider.uploadFile(file, fileName);
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file. Please try again.');
    }
  }

  async uploadImage(file: File, fileName: string): Promise<void> {
    try {
      await this.provider.uploadImage(file, fileName);
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  async deleteImage(path: string): Promise<void> {
    try {
      await this.provider.deleteImage(path);
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw new Error('Failed to delete image.');
    }
  }

  async renameImage(oldPath: string, newPath: string): Promise<void> {
    try {
      await this.provider.renameImage(oldPath, newPath);
    } catch (error) {
      console.error('Failed to rename image:', error);
      throw new Error('Failed to rename image.');
    }
  }
}
