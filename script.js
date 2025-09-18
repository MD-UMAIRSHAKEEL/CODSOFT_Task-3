const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const historybtn = document.getElementById('history-btn');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const themebtn = document.getElementById('theme-btn');

let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForNext = false;
let history = [];

function updateDisplay() {
  display.textContent = currentValue;
}

function updateHistoryPanel() {
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function handleDigit(d) {
  if (waitingForNext) {
    currentValue   = d;
    waitingForNext = false;
  } else {
    currentValue = currentValue === '0' ? d : currentValue + d;
  }
}

function handleDecimal() {
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
}

function calculate(a, b, op) {
  if      (op === '+') return a + b;
  else if (op === '-') return a - b;
  else if (op === 'x') return a * b;
  else if (op === '÷') return b === 0 ? 'Error' : a / b;
  return b;
}

function handleOperator(nextOp) {
  const inputValue = parseFloat(currentValue);

  if (operator && waitingForNext) {
    operator = nextOp;
    return;
  }

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    currentValue  = String(parseFloat(result.toFixed(10)));
    previousValue = result;
  }

  operator       = nextOp;
  waitingForNext = true;
}

function handleEquals() {
  if (operator === null) return;
  const inputValue = parseFloat(currentValue);
  const result     = calculate(previousValue, inputValue, operator);
  history.push(`${previousValue} ${operator} ${inputValue} = ${result}`);
  updateHistoryPanel();

  currentValue   = String(parseFloat(result.toFixed(10)));
  previousValue  = null;
  operator       = null;
  waitingForNext = true;
}

function handleClear() {
  currentValue   = '0';
  previousValue  = null;
  operator       = null;
  waitingForNext = false;
}

function handleDelete() {
  if (waitingForNext || currentValue === '0') return;
  currentValue = currentValue.slice(0, -1) || '0';
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const { type, value } = btn.dataset;

    if      (type === 'digit')    handleDigit(value);
    else if (type === 'decimal')  handleDecimal();
    else if (type === 'operator') handleOperator(value);
    else if (type === 'equals')   handleEquals();
    else if (type === 'clear')    handleClear();
    else if (type === 'delete')   handleDelete();
    updateDisplay();
  });
});


historybtn.addEventListener('click', () => {
  historyPanel.classList.toggle('hidden');
  historybtn.textContent =
    historyPanel.classList.contains('hidden')
      ? 'Show History'
      : 'Hide History';
});

const clearHistoryBtn = document.getElementById('clear-history');

clearHistoryBtn.addEventListener('click', () => {
  history = []; 
  updateHistoryPanel(); 
});

themebtn.addEventListener('click', () => {
  const body = document.body;
  const isLight = body.getAttribute('data-theme') === 'light';

  body.setAttribute('data-theme', isLight ? 'dark' : 'light');
  themebtn.textContent = isLight ? 'Light Mode' : 'Dark Mode';
});

updateDisplay();
updateHistoryPanel();