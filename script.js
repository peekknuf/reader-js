// script.js
const wpmSlider = document.getElementById('wpm');
const wpmDisplay = document.getElementById('wpm-display');
const textInput = document.getElementById('text-input');
const displayPanel = document.getElementById('display-panel');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');

let chunks = [];
let interval = null;
let currentIndex = 0;

// Update WPM display
wpmSlider.addEventListener('input', () => {
    wpmDisplay.textContent = `${wpmSlider.value} WPM`;
});

// Split text into chunks
function splitTextIntoChunks(text) {
    return text.split(/\s+/).map(word => {
        if (!word) return ''; // Handle empty words (e.g., multiple spaces)
        const firstLetter = word.charAt(0);
        const rest = word.slice(1);
        return `<span style="font-weight: bold;">${firstLetter}</span>${rest}`;
    });
}

// Start reading
startButton.addEventListener('click', () => {
    if (!textInput.value.trim()) {
        alert('Please paste some text to read!');
        return;
    }

    if (!chunks.length) {
        chunks = splitTextIntoChunks(textInput.value);
    }

    const intervalTime = 60000 / wpmSlider.value;

    if (!interval) {
        interval = setInterval(() => {
            if (currentIndex < chunks.length) {
                displayPanel.innerHTML = chunks[currentIndex];
                currentIndex++;
            } else {
                clearInterval(interval);
                interval = null;
            }
        }, intervalTime);
    }
});

// Pause reading
pauseButton.addEventListener('click', () => {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
});

// Reset reading
resetButton.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    currentIndex = 0;
    chunks = [];
    displayPanel.textContent = 'Text will appear here';
});

