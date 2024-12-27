const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
// Load preloaded texts
const texts = JSON.parse(fs.readFileSync('texts.json', 'utf-8'));

// Endpoints
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/library', (req, res) => {
    res.json(texts);
});

app.get('/library/:id', (req, res) => {
    const text = texts.find(t => t.id === parseInt(req.params.id));
    if (text) {
        res.json(text);
    } else {
        res.status(404).json({ error: "Text not found" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

