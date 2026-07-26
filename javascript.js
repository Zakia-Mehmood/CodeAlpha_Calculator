let currentInput = '0';
let historyInput = '';
let shouldResetScreen = false;

const currentDisplay = document.getElementById('current-display');
const historyDisplay = document.getElementById('history-display');

// Append numbers to the calculator memory
function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        resetCurrentScreen();
    }
    
    // Prevent repetitive decimal dot errors
    if (number === '.' && currentInput.includes('.')) return;
    
    currentInput += number;
    updateDisplay();
}

// Append math operator characters
function appendOperator(operator) {
    if (shouldResetScreen) shouldResetScreen = false;
    
    // Ensure an operator isn't typed back-to-back
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

function clearScreen() {
    currentInput = '0';
    historyInput = '';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function resetCurrentScreen() {
    currentInput = '';
    shouldResetScreen = false;
}

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    historyDisplay.innerText = historyInput;
}

// Evaluates math strings using secure calculation logic
function calculateResult() {
    let expression = currentInput;
    
    try {
        // Safe string calculation step
        let result = Function(`"use strict"; return (${expression})`)();
        
        // Handle floating-point precision decimals (e.g. 0.1 + 0.2)
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(6));
        }
        
        historyInput = currentInput + " =";
        currentInput = String(result);
        shouldResetScreen = true;
    } catch (error) {
        currentInput = "Error";
        shouldResetScreen = true;
    }
    updateDisplay();
}

// BONUS FEATURE: Real-time Keyboard Event Listeners
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') appendNumber(key);
    if (key === '+' || key === '-' || key === '%' ) appendOperator(key);
    if (key === '*') appendOperator('*');
    if (key === '/') event.preventDefault(); appendOperator('/');
    if (key === 'Enter' || key === '=') calculateResult();
    if (key === 'Backspace') deleteLast();
    if (key === 'Escape') clearScreen();
});
