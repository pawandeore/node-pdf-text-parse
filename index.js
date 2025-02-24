const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();
const port = 9000;

// Set up multer for file upload
const upload = multer({ dest: "uploads/" });

// Endpoint to upload PDF and return text
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const filePath = req.file.path;

    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        
        // Remove the uploaded file after parsing
        fs.unlinkSync(filePath);

        res.json({ text: data.text });
    } catch (error) {
        res.status(500).send("Error parsing PDF.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
