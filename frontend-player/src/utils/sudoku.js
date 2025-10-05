// Simple static puzzle; 0 means empty
export const puzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

export function isValid(board, r, c, val) {
  for (let i=0;i<9;i++) if (board[r][i]===val || board[i][c]===val) return false;
  const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) if (board[br+i][bc+j]===val) return false;
  return true;
}

export function percentComplete(board) {
  let filled=0; for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (board[r][c]!==0) filled++;
  return Math.round((filled/81)*100);
}
