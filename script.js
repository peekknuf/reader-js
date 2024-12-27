// script.js

const wpmSlider = document.getElementById('wpm');
const wpmDisplay = document.getElementById('wpm-display');
const textInput = document.getElementById('text-input');
const displayPanel = document.getElementById('display-panel');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const libraryButton = document.getElementById('library-btn');


let chunks = [];
let currentIndex = 0;
let readingInterval = null;
let isReading = false;
let libraryOpen = false;

const libraryContainer = document.createElement('div');
libraryContainer.id = 'library-container';


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

    const key = event.key;
    if (key !== '+' && key !== '_') return;

    let newValue = parseInt(wpmSlider.value);
    const step = key === '+' ? 50 : -50; // '+' increases, '_' decreases
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

textInput.addEventListener('input', updateWordCount);
updateWordCount();

// Event listeners for buttons
startButton.addEventListener('click', startReading);
pauseButton.addEventListener('click', stopReading);

resetButton.addEventListener('click', () => {
    stopReading();
    currentIndex = 0;
    chunks = [];
    displayPanel.textContent = 'Text will appear here';
});

document.addEventListener('keydown', adjustSpeed);

libraryButton.addEventListener('click', async () => {
    if (libraryOpen) {
        libraryContainer.style.display = 'none';
    } else {
        const response = await fetch('/library');
        const data = await response.json();
        displayBooks(data);
        libraryContainer.style.display = 'block';
    }
    libraryOpen = !libraryOpen;
});


function displayBooks(books) {
    libraryContainer.innerHTML = '';
    books.forEach(book => {
        const bookElement = document.createElement('div');
        const bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;
        bookTitle.addEventListener('click', () => loadTextToInput(book));  // Add event listener for title click

        bookElement.appendChild(bookTitle);
        libraryContainer.appendChild(bookElement);
    });

    if (!document.body.contains(libraryContainer)) {
        document.body.appendChild(libraryContainer);
    }
}

// Function to load text into the text input
function loadTextToInput(book) {
    const textInput = document.getElementById('text-input');
    textInput.value = book.content;
}