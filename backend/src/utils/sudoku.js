// Basic Sudoku utilities: validate, solve (backtracking), generate (pick from presets)

export function cloneBoard(b) { return b.map(r => [...r]); }

export function isSafe(board, r, c, val) {
  for (let i=0;i<9;i++) if (board[r][i]===val || board[i][c]===val) return false;
  const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) if (board[br+i][bc+j]===val) return false;
  return true;
}

export function solve(board) {
  // board is 9x9 with 0 for empty
  const b = cloneBoard(board);
  function dfs() {
    for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (b[r][c]===0) {
      for (let v=1; v<=9; v++) {
        if (isSafe(b, r, c, v)) { b[r][c]=v; if (dfs()) return true; b[r][c]=0; }
      }
      return false;
    }
    return true;
  }
  const ok = dfs();
  return ok ? b : null;
}

const PRESETS = [
  [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9],
  ],
  [
    [0,0,0,2,6,0,7,0,1],
    [6,8,0,0,7,0,0,9,0],
    [1,9,0,0,0,4,5,0,0],
    [8,2,0,1,0,0,0,4,0],
    [0,0,4,6,0,2,9,0,0],
    [0,5,0,0,0,3,0,2,8],
    [0,0,9,3,0,0,0,7,4],
    [0,4,0,0,5,0,0,3,6],
    [7,0,3,0,1,8,0,0,0],
  ],
];

export function randomPuzzle() {
  const idx = Math.floor(Math.random()*PRESETS.length);
  return PRESETS[idx].map(r => [...r]);
}

// Create a fully solved board by solving a preset to completion.
function solvedFromPreset() {
  const base = randomPuzzle();
  // Fill the preset to a solved grid
  const full = solve(base);
  if (full) return full;
  // Fallback: try the first preset
  return solve(PRESETS[0]) || PRESETS[0].map(r => [...r]);
}

// Remove cells from a solved board to match difficulty. Does not guarantee uniqueness
// but is sufficient for our use case.
function carveHoles(solved, blanks) {
  const grid = solved.map(r => [...r]);
  const coords = [];
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) coords.push([r,c]);
  // shuffle
  for (let i=coords.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }
  let removed = 0;
  for (const [r,c] of coords) {
    if (removed>=blanks) break;
    const backup = grid[r][c];
    grid[r][c] = 0;
    removed++;
  }
  return grid;
}

export function generatePuzzle(level = 'medium') {
  const lvl = String(level || 'medium').toLowerCase();
  const targets = { easy: 36, medium: 45, hard: 55 }; // number of blanks
  const blanks = targets[lvl] ?? targets.medium;
  const solved = solvedFromPreset();
  return carveHoles(solved, blanks);
}

export function findOneHint(board) {
  // returns { r, c, val } or null
  const solved = solve(board);
  if (!solved) return null;
  for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (board[r][c]===0) {
    return { r, c, val: solved[r][c] };
  }
  return null;
}
