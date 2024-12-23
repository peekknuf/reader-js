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

wpmSlider.addEventListener('input', () => {
    wpmDisplay.textContent = `${wpmSlider.value} WPM`;
});

function splitTextIntoChunks(text, highlightPosition = 'first') {
    return text.split(/\s+/).map(word => {
        if (!word) return '';
        const middleIndex = Math.floor(word.length / 2);

        if (highlightPosition === 'first') {
            const firstLetter = word.charAt(0);
            return `<span style="font-weight: bold;">${firstLetter}</span>${word.slice(1)}`;
        } else if (highlightPosition === 'middle') {
            const middleLetter = word.charAt(middleIndex);
            return `${word.slice(0, middleIndex)}<span style="font-weight: bold;">${middleLetter}</span>${word.slice(middleIndex + 1)}`;
        }
        return word;
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
    if (isReading) return;

    if (!chunks.length) {
        const highlightPosition = document.querySelector('input[name="highlight"]:checked').value;
        chunks = splitTextIntoChunks(textInput.value, highlightPosition);
    }

    isReading = true;
    const intervalTime = 60000 / parseInt(wpmSlider.value);
    readingInterval = setInterval(displayNextWord, intervalTime);
}

function stopReading() {
    clearInterval(readingInterval);
    readingInterval = null;
    isReading = false;
}

function adjustSpeed(event) {
    if (!event.shiftKey) return;

    let newValue = parseInt(wpmSlider.value);
    if (event.key === '+' || event.key === '=') {
        if (newValue < wpmSlider.max) {
            newValue += 50;
        }
    } else if (event.key === '-' || event.key === '_' || event.keyCode === 109) {
        if (newValue > wpmSlider.min) {
            newValue -= 50;
        }
    } else {
        return;
    }

    wpmSlider.value = newValue;
    wpmDisplay.textContent = `${newValue} WPM`;

    if (isReading) {
        stopReading();
        startReading();
    }
}

startButton.addEventListener('click', () => {
    if (!textInput.value.trim()) {
        alert('Please paste some text to read!');
        return;
    }
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