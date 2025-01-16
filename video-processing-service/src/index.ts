import express from "express";
import ffmpeg from "fluent-ffmpeg"; // this is just a wrapper, we need the actual library

const app = express();
/*
Used in Express.js apps to set up parsing JSON data in HTTP requests
express.json() is a middleware -> function that processes incoming requests before handled by route handlers
express.json() specifically handles requests where the body of the HTTP request is in JSON format
*/
app.use(express.json()); 

// This defines a route handler for POST requests made to the /process-video endpoint
// req includes the body, headers, etc, res sends a response back to the client
app.post('/process-video', (req, res) => {
    // specifies the parameters we need in the request body, and retrieve them
    const inputFilePath = req.body.inputFilePath; // file path of the video to be processed
    const outputFilePath = req.body.outputFilePath; // retrieves the path where the processed video will be saved

    // mandates the inputs 
    if (!inputFilePath || !outputFilePath) res.status(400).send('Bad Request: Missing file path');

    // convert video 
    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') // specifies video file and 360p
        .on('end', function() { // specifies what happens when process finishes
            console.log('Processing finished successfully');
            res.status(200).send('Processing finished successfully');
        }) 
        .on('error', function(err: any) { // what to do with error, sometimes can be caused by memory overhead with video file size
            console.log('An error occurred: ' + err.message);
            res.status(500).send('An error occurred: ' + err.message);
        })
        .save(outputFilePath);
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
