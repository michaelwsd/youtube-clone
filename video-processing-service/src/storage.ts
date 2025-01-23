// allows upload, download and manage files from google cloud storage buckets
import { Storage } from "@google-cloud/storage"; 
// build in file system module, allows read and write to files on the local system
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

// Create instance of GCS
const storage = new Storage();

// Bucket is object storage used to store files, organize and manages files in a scalable and efficient way 
// Bucket names must be globally unique
const rawVideoBucketName = "1729-yt-raw-videos"; // download from this bucket
const processedVideoBucketName = "1729-yt-processed-videos"; // upload to this bucket 

// path names, videos here should be cleaned up after uploading to save storage
const localRawVideoPath = "./raw-videos"; // downloaded raw videos here
const localProcessedVideoPath = "./processed-videos"; // processed videos stored here

// Create local directories for raw and processed videos 
export function setUpDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // takes raw file 
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
           // convert to 360p
          .outputOptions("-vf", "scale=-1:360") 
          .on("end", function () {
            console.log("Processing finished successfully");
            resolve(); // resolves promise
          })
          .on("error", function (err: any) {
            console.log("An error occurred: " + err.message);
            reject(err); // return error 
          })
          .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName) // access this bucket
        .file(fileName) // specify the file in this bucket
        .download({
            destination: `${localRawVideoPath}/${fileName}` // save the file to this location
        });

    // Promise<void> is implicitly returned if successful
    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}
  
/**
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    // Upload video to this bucket
    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });
    
    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`);
    
    // make file public so anyone with the URL can access without authentication
    await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
* @param fileName - The name of the file to delete from the
* {@link localProcessedVideoPath} folder.
* @returns A promise that resolves when the file has been deleted.
* 
*/
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
  }

// HELPER FUNCTIONS
// Ensure directory exists 
function ensureDirectoryExistence(dirPath: string) {
    // check if directory exists
    if (!fs.existsSync(dirPath)) {
        // recursive ensures all missing parent directories/folders are also created
        // i.e. for "./parent/child", error if parent folder doesn't exist and recursive is false
        fs.mkdirSync(dirPath, {recursive: true});
        console.log(`Directory created at ${dirPath}`);
    }
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
    // delete the local file asynchronously
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            // delete the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping delete.`);
            resolve();
        }
    })
}
  