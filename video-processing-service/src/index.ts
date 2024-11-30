import express from "express";
import ffmpeg from "fluent-ffmpeg"; // this is just a Command Line Tool/Wrapper, the computer also needs to install ffmpeg

// create an instance of express
const app = express();
const port = 3000;

// specify a root path 
app.get("/", (req, res) => { // every endpoint (url) has a request and response
    res.send("Hello World!");
})

// start server 
app.listen(port, () => { // we are listening on this port and execute the following code 
    console.log(`Video processing service listening at http://localhost:${port}`);
})