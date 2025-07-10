import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Extract frames from video using ffmpeg
 */
export async function extractFramesFromVideo(videoPath: string): Promise<string[]> {
  const outputDir = path.join(process.cwd(), 'public', 'temp_frames');
  const framePattern = path.join(outputDir, 'frame_%03d.jpg');
  
  try {
    // Create temp directory
    await execAsync(`mkdir -p "${outputDir}"`);
    
    // Extract 3 frames from the video (beginning, middle, end)
    await execAsync(`ffmpeg -i "${videoPath}" -vf "select='eq(pict_type,I)*not(mod(n,30))',scale=512:512" -frames:v 3 "${framePattern}" -y`);
    
    // Get the generated frame files
    const { stdout } = await execAsync(`ls "${outputDir}"/frame_*.jpg`);
    const frameFiles = stdout.trim().split('\n').filter(file => file.length > 0);
    
    return frameFiles;
  } catch (error) {
    console.error('Error extracting frames:', error);
    throw new Error('Failed to extract frames from video');
  }
}

/**
 * Encode image to base64
 */
export async function encodeImageToBase64(imagePath: string): Promise<string> {
  try {
    const fs = require('fs').promises;
    const imageBuffer = await fs.readFile(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error encoding image to base64:', error);
    throw new Error('Failed to encode image');
  }
}

/**
 * Clean up temporary files
 */
export async function cleanupTempFiles(files: string[]): Promise<void> {
  const cleanupPromises = files.map(async (file) => {
    try {
      await unlink(file);
    } catch (error) {
      console.warn(`Failed to delete ${file}:`, error);
    }
  });
  
  await Promise.all(cleanupPromises);
  
  // Clean up temp frames directory
  try {
    await execAsync('rm -rf public/temp_frames');
  } catch (error) {
    console.warn('Failed to clean up temp frames directory:', error);
  }
}