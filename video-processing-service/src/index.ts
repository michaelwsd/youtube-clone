import express from "express";

const app = express();
const port = 3000;

// when the root url is accessed, a response string is sent back to the user
app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})
