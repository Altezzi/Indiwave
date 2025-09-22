import fs from 'fs';
import path from 'path';

export interface CoverDownloadResult {
  success: boolean;
  localPath?: string;
  error?: string;
}

export class CoverDownloader {
  private static readonly COVERS_DIR = path.join(process.cwd(), 'public', 'covers');
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Download a cover image from MangaDex and store it locally
   */
  static async downloadCover(
    mangaId: string,
    coverUrl: string,
    retryCount: number = 0
  ): Promise<CoverDownloadResult> {
    try {
      // Ensure covers directory exists
      if (!fs.existsSync(this.COVERS_DIR)) {
        fs.mkdirSync(this.COVERS_DIR, { recursive: true });
      }

      // Generate filename from manga ID
      const filename = `${mangaId}.jpg`;
      const localPath = path.join(this.COVERS_DIR, filename);
      const publicPath = `/covers/${filename}`;

      // Check if file already exists
      if (fs.existsSync(localPath)) {
        return {
          success: true,
          localPath: publicPath
        };
      }

      // Download the image
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the image data
      const imageBuffer = await response.arrayBuffer();
      
      // Save to file
      fs.writeFileSync(localPath, Buffer.from(imageBuffer));

      return {
        success: true,
        localPath: publicPath
      };

    } catch (error) {
      console.error(`Error downloading cover for ${mangaId}:`, error);
      
      // Retry logic
      if (retryCount < this.MAX_RETRIES) {
        console.log(`Retrying download for ${mangaId} (attempt ${retryCount + 1}/${this.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
        return this.downloadCover(mangaId, coverUrl, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get the local cover path for a manga ID
   */
  static getLocalCoverPath(mangaId: string): string {
    const filename = `${mangaId}.jpg`;
    return `/covers/${filename}`;
  }

  /**
   * Check if a local cover exists
   */
  static hasLocalCover(mangaId: string): boolean {
    const filename = `${mangaId}.jpg`;
    const localPath = path.join(this.COVERS_DIR, filename);
    return fs.existsSync(localPath);
  }

  /**
   * Delete a local cover file
   */
  static deleteLocalCover(mangaId: string): boolean {
    try {
      const filename = `${mangaId}.jpg`;
      const localPath = path.join(this.COVERS_DIR, filename);
      
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting cover for ${mangaId}:`, error);
      return false;
    }
  }

  /**
   * Get all local cover files
   */
  static getLocalCovers(): string[] {
    try {
      if (!fs.existsSync(this.COVERS_DIR)) {
        return [];
      }
      
      return fs.readdirSync(this.COVERS_DIR)
        .filter(file => file.endsWith('.jpg'))
        .map(file => file.replace('.jpg', ''));
    } catch (error) {
      console.error('Error reading covers directory:', error);
      return [];
    }
  }
}
