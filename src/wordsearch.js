import { generateGrid } from './grid.js';

const words = [
  'banana', 'mango', 'lagos', 'naira', 'zebra',
  'python', 'react', 'coded', 'music', 'dance',
  'trade', 'money', 'books', 'hope', 'giant'
];

const gridSize = 12;
const grid = generateGrid(words, gridSize);

const gameContainer = document.getElementById('game');
const gridEl = document.createElement('div');
const wordListEl = document.createElement('div');

gridEl.className = 'grid';
wordListEl.className = 'word-list';

gridEl.style.setProperty('--grid-size', gridSize);

grid.forEach((row, r) => {
  row.forEach((letter, c) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = letter;
    cell.dataset.row = r;
    cell.dataset.col = c;
    gridEl.appendChild(cell);
  });
});

words.forEach((word) => {
  const w = document.createElement('div');
  w.textContent = word;
  w.id = `word-${word}`;
  wordListEl.appendChild(w);
});

gameContainer.appendChild(gridEl);
gameContainer.appendChild(wordListEl);

let isMouseDown = false;
let startCell = null;
let currentPath = [];
const foundWords = new Set();

function clearSelection() {
  currentPath.forEach((cell) => cell.classList.remove('selected'));
  currentPath = [];
}

function getPath(start, end) {
  const sr = parseInt(start.dataset.row, 10);
  const sc = parseInt(start.dataset.col, 10);
  const er = parseInt(end.dataset.row, 10);
  const ec = parseInt(end.dataset.col, 10);

  let dr = er - sr;
  let dc = ec - sc;

  if (dr === 0 && dc === 0) return [start];

  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

  const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const path = [];
  for (let i = 0; i < length; i++) {
    const r = sr + stepR * i;
    const c = sc + stepC * i;
    const cell = gridEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return null;
    path.push(cell);
  }
  return path;
}

function checkSelection() {
  if (currentPath.length === 0) return;
  const letters = currentPath.map((c) => c.textContent).join('');
  const reversed = letters.split('').reverse().join('');
  let match = null;
  if (words.includes(letters)) match = letters;
  else if (words.includes(reversed)) match = reversed;

  if (match && !foundWords.has(match)) {
    currentPath.forEach((c) => c.classList.add('found'));
    foundWords.add(match);
    const wEl = document.getElementById(`word-${match}`);
    if (wEl) wEl.classList.add('found');
  }
}

gridEl.addEventListener('mousedown', (e) => {
  if (!e.target.classList.contains('cell')) return;
  isMouseDown = true;
  startCell = e.target;
  currentPath = [startCell];
  startCell.classList.add('selected');
});

gridEl.addEventListener('mouseover', (e) => {
  if (!isMouseDown || !e.target.classList.contains('cell')) return;
  const path = getPath(startCell, e.target);
  if (!path) return;
  clearSelection();
  currentPath = path;
  currentPath.forEach((cell) => cell.classList.add('selected'));
});

document.addEventListener('mouseup', () => {
  if (!isMouseDown) return;
  isMouseDown = false;
  checkSelection();
  clearSelection();
});
