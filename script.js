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


/**
 * Split a given text into an array of strings, each containing a word of the
 * original text, with the first or middle character highlighted.
 *
 * @param {string} text The text to split.
 * @param {string} [highlightPosition='first'] The position of the character to
 *   highlight.  Can be either 'first' or 'middle'.
 * @param {string} [highlightTag='span'] The tag to use for highlighting.
 * @return {string[]} An array of strings, each containing a word of the original
 *   text with the chosen character highlighted.
 */
function splitTextIntoChunks(text, highlightPosition = 'first', highlightTag = 'span') {
    if (typeof text !== "string" || !text.trim()) return [];

    return text.split(/\s+/).map(word => {
        if (!word) return '';
        const middleIndex = Math.floor(word.length / 2);
        switch (highlightPosition) {
            case 'first':
                return `<${highlightTag} style="font-weight: bold;">${word.charAt(0)}</${highlightTag}>${word.slice(1)}`;
            case 'middle':
                return `${word.slice(0, middleIndex)}${word.length % 2 === 0 ? '' : ' '}<${highlightTag} style="font-weight: bold;">${word.charAt(middleIndex)}</${highlightTag}>${word.slice(middleIndex + 1)}`;
            default:
                return word;
        }
    });
}


/**
 * Displays the current word chunk in the display panel and increments the index.
 * If all chunks have been displayed, it stops the reading process.
 */
function displayNextWord() {
    if (currentIndex < chunks.length) {
        displayPanel.innerHTML = chunks[currentIndex];
        currentIndex++;
    } else {
        stopReading();
    }
}

/**
 * Starts the reading process if the text input field is not empty and the
 * process is not already running.
 *
 * @return {void}
 */
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

/**
 * Listens for Shift + '+' or Shift + '-' keypresses and adjusts the WPM slider
 * by 50 steps in the corresponding direction. If the reading process is running,
 * it stops and restarts with the new WPM value.
 *
 * @param {KeyboardEvent} event The event object of the keypress.
 * @return {void}
 */
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