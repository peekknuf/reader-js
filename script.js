// script.js

const wpmSlider = document.getElementById('wpm');
const wpmDisplay = document.getElementById('wpm-display');
const textInput = document.getElementById('text-input');
const displayPanel = document.getElementById('display-panel');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');


let chunks = [];
let currentIndex = 0;
let readingInterval = null;
let isReading = false;

wpmSlider.addEventListener('input', updateWpmDisplay);

function splitTextIntoChunks(text, highlightPosition = 'first') {
    return text.split(/\s+/).map(word => {
        if (!word) return '';
        const middleIndex = Math.floor(word.length / 2);

        switch (highlightPosition) {
            case 'first':
                return `<span style="font-weight: bold;">${word.charAt(0)}</span>${word.slice(1)}`;
            case 'middle':
                return `${word.slice(0, middleIndex)}<span style="font-weight: bold;">${word.charAt(middleIndex)}</span>${word.slice(middleIndex + 1)}`;
            default:
                return word;
        }
    });
}

function displayNextWord() {
    if (currentIndex < chunks.length) {
        displayPanel.innerHTML = chunks[currentIndex];
        currentIndex++;
    } else {
        stopReading();
    }
}

function startReading() {
    if (isReading || !textInput.value.trim()) return;

    const highlightPosition = document.querySelector('input[name="highlight"]:checked').value;
    chunks = splitTextIntoChunks(textInput.value, highlightPosition);
    isReading = true;
    setReadingInterval();
}

function stopReading() {
    clearInterval(readingInterval);
    readingInterval = null;
    isReading = false;
}

function setReadingInterval() {
    const intervalTime = 60000 / parseInt(wpmSlider.value);
    readingInterval = setInterval(displayNextWord, intervalTime);
}

function updateWpmDisplay() {
    wpmDisplay.textContent = `${wpmSlider.value} WPM`;
}

function adjustSpeed(event) {
    if (!event.shiftKey) return;

    let newValue = parseInt(wpmSlider.value);
    const step = event.key === '+' || event.key === '=' ? 50 : -50;
    newValue += step;
    wpmSlider.value = Math.min(Math.max(newValue, wpmSlider.min), wpmSlider.max);
    updateWpmDisplay();

    if (isReading) {
        stopReading();
        startReading();
    }
}

function updateWordCount() {
    const text = document.getElementById('text-input').value;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    document.getElementById('word-count').textContent = wordCount;
}

document.getElementById('text-input').addEventListener('input', updateWordCount);
updateWordCount();

startButton.addEventListener('click', () => {
    const highlightPosition = document.querySelector('input[name="highlight"]:checked').value;
    chunks = splitTextIntoChunks(textInput.value, highlightPosition);
    startReading();
});

pauseButton.addEventListener('click', stopReading);

resetButton.addEventListener('click', () => {
    stopReading();
    currentIndex = 0;
    chunks = [];
    displayPanel.textContent = 'Text will appear here';
});

document.addEventListener('keydown', adjustSpeed);