import { generateGrid } from './grid.js';

const categories = {
  Fruits: ['BANANA', 'MANGO'],
  Geography: ['LAGOS'],
  Economy: ['NAIRA', 'TRADE', 'MONEY'],
  Animals: ['ZEBRA'],
  Technology: ['PYTHON', 'REACT', 'CODED'],
  Arts: ['MUSIC', 'DANCE', 'BOOKS'],
  Misc: ['HOPE', 'GIANT']
};

const allWords = Object.values(categories).flat();
const gridSize = 12;

const gameContainer = document.getElementById('game');
const newGameBtn = document.getElementById('new-game');

let gridEl;
let wordListEl;
let isMouseDown = false;
let startCell = null;
let currentPath = [];
let foundWords = new Set();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeGame() {
  gameContainer.innerHTML = '';
  const grid = generateGrid(shuffle([...allWords]), gridSize);

  gridEl = document.createElement('div');
  wordListEl = document.createElement('div');
  gridEl.className = 'grid';
  wordListEl.className = 'word-list';
  gridEl.style.setProperty('--grid-size', gridSize);

  grid.forEach((row, r) => {
    row.forEach((letter, c) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = letter.toUpperCase();
      cell.dataset.row = r;
      cell.dataset.col = c;
      gridEl.appendChild(cell);
    });
  });

  for (const [category, list] of Object.entries(categories)) {
    const section = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = category;
    section.appendChild(heading);
    list.forEach((word) => {
      const w = document.createElement('div');
      w.textContent = word;
      w.id = `word-${word}`;
      section.appendChild(w);
    });
    wordListEl.appendChild(section);
  }

  gameContainer.appendChild(gridEl);
  gameContainer.appendChild(wordListEl);

  isMouseDown = false;
  startCell = null;
  currentPath = [];
  foundWords = new Set();

  gridEl.addEventListener('mousedown', handleMouseDown);
  gridEl.addEventListener('mouseover', handleMouseOver);
}

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
  if (allWords.includes(letters)) match = letters;
  else if (allWords.includes(reversed)) match = reversed;

  if (match && !foundWords.has(match)) {
    currentPath.forEach((c) => c.classList.add('found'));
    foundWords.add(match);
    const wEl = document.getElementById(`word-${match}`);
    if (wEl) wEl.classList.add('found');
  }
}

function handleMouseDown(e) {
  if (!e.target.classList.contains('cell')) return;
  isMouseDown = true;
  startCell = e.target;
  currentPath = [startCell];
  startCell.classList.add('selected');
}

function handleMouseOver(e) {
  if (!isMouseDown || !e.target.classList.contains('cell')) return;
  const path = getPath(startCell, e.target);
  if (!path) return;
  clearSelection();
  currentPath = path;
  currentPath.forEach((cell) => cell.classList.add('selected'));
}

function handleMouseUp() {
  if (!isMouseDown) return;
  isMouseDown = false;
  checkSelection();
  clearSelection();
}

document.addEventListener('mouseup', handleMouseUp);
newGameBtn.addEventListener('click', initializeGame);

initializeGame();
