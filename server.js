const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/songs', (req, res) => {
    const dirPath = path.join(__dirname, 'assets');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        const songs = files
            .filter(file => file.endsWith('.mp3'))
            .map(file => ({
                title: file.replace('.mp3', ''),
                src: `/assets/${file}`,
                img: `/assets/${file.replace('.mp3', '.jpg')}`
            }));
        res.json(songs);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});