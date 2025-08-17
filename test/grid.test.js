import { generateGrid } from '../src/grid.js';

const words = [
  'banana', 'mango', 'lagos', 'naira', 'zebra',
  'python', 'react', 'coded', 'music', 'dance',
  'trade', 'money', 'books', 'hope', 'giant'
];

const gridSize = 12;
const grid = generateGrid(words, gridSize);

const directions = [
  { dr: 0, dc: 1 }, { dr: 0, dc: -1 },
  { dr: 1, dc: 0 }, { dr: -1, dc: 0 },
  { dr: 1, dc: 1 }, { dr: -1, dc: -1 },
  { dr: -1, dc: 1 }, { dr: 1, dc: -1 }
];

function existsWord(word) {
  const reversed = word.split('').reverse().join('');
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      for (const { dr, dc } of directions) {
        let str = '';
        for (let i = 0; i < word.length; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) break;
          str += grid[nr][nc];
        }
        if (str === word || str === reversed) return true;
      }
    }
  }
  return false;
}

for (const w of words) {
  if (!existsWord(w)) {
    console.error(`Word ${w} not found in grid`);
    process.exit(1);
  }
}
console.log('All words placed successfully');
