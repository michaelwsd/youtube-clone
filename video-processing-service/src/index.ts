import express from "express";
import { isVideoNew, setVideo } from "./firestore";
import { 
    uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setUpDirectories
  } from './storage';

// set up directories
setUpDirectories();

const app = express();
/*
Used in Express.js apps to set up parsing JSON data in HTTP requests
express.json() is a middleware -> function that processes incoming requests before handled by route handlers
express.json() specifically handles requests where the body of the HTTP request is in JSON format
*/
app.use(express.json()); 

// This defines a route handler for POST requests made to the /process-video endpoint
// req includes the body, headers, etc, res sends a response back to the client
app.post('/process-video', async (req, res): Promise<any> => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message); // get the file name 
        if (!data.name) {
            throw new Error('Invalid message payload received.');
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad Request: Missing Filename.');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if (!isVideoNew(videoId)) {
        return res.status(400).send('Bad Request: video already processing or processed.');
    } else {
        await setVideo(videoId, {
        id: videoId,
        uid: videoId.split('-')[0],
        status: 'processing'
        });
    }

    // download raw video from cloud storage
    await downloadRawVideo(inputFileName);

    // process video into 360p
    try {
        await convertVideo(inputFileName, outputFileName)
    } catch (err) {
        // if error occurs, process two asynchronous operations concurrently
        // in this case, delete downloaded/potentially processed videos
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        return res.status(500).send('Process failed.');
    }

    // upload the processed video to the cloud storage
    await uploadProcessedVideo(outputFileName);
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Processing finished successfully.');
})

/*
When deployed to a hosting platform, platform will provide its own port number via the PORT environmental variable
Many cloud platforms dynamically assign a port number for the application
*/ 
const port = process.env.PORT || 3000;
// listen starts the server and bind it to a specific port
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})
