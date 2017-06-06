const _ = require('lodash')

// dimension of the board, altho we make 1 dimensional
const DIM = 9

// size of the board (array)
const SIZE = DIM * DIM

const EMPTY = '☯'

// where the empty space starts (considering 1 based index)
let pos = SIZE

function buildBoard () {
  var a = new Array(SIZE).fill(0).map((x, i) => i + 1)
    // where the void starts
  a[pos - 1] = EMPTY
  return a
}

var board = buildBoard()

function prettyPrintBoard (board) {
  console.log('------------------------------')
  console.log(board.join(','))
  console.log('------------------------------')
  let line = []
  board.forEach(function (x, i) {
    line.push('' + x + '\t')
    if (i < SIZE - 1 && i % DIM === DIM - 1) line.push('\n')
  })
  console.log(line.join(''))
  console.log('-------------------------------')
}

function reverseMove (move) {
  switch (move) {
    case 'u': return 'd'
    case 'd': return 'u'
    case 'l': return 'r'
    case 'r': return 'l'
  }
}

function printSolution (moves) {
  console.log('solution:', moves.reverse().map(reverseMove).join(', '))
}

// print back as the problem proposed it
function formatAsOutput () {
  const table = []
  for (var i = 0; i < DIM; i++) {
    table.push(board.slice(i*DIM, i*DIM + DIM))
  }
  return JSON.stringify({
    puzzle: table
  })
}

const moveRule = {
  u: () => pos - DIM > 0,
  d: () => SIZE - pos > DIM,
  l: () => pos % DIM !== 1,
  r: () => pos % DIM !== 0
}

function possibleMoves () {
  const moves = []
  for (let move in moveRule) {
    if (moveRule[move]()) moves.push(move)
  }
  return moves
}

function doMove (move) {
  // console.log('move:', move, 'current pos:', pos)
  let newEmptyPos
  switch (move) {
    case 'u':
      newEmptyPos = pos - DIM
      break
    case 'd':
      newEmptyPos = pos + DIM
      break
    case 'l':
      newEmptyPos = pos - 1
      break
    case 'r':
      newEmptyPos = pos + 1
      break
    default:
      console.error('!!!')
      break
  }
    // console.log({nep: newEmptyPos - 1, nev: board[newEmptyPos - 1], bp: board[pos - 1]})
  board[pos - 1] = board[newEmptyPos - 1]
  pos = newEmptyPos
  board[pos - 1] = EMPTY
}

console.log('start:')
prettyPrintBoard(board)

// max number of moves to be executed during simulation
const maxMoves = Math.pow(DIM, DIM - 1)
// const maxMoves = 2

const movesExecuted = []

for (var i = 0; i < maxMoves; i++) {
  const lastMove = movesExecuted.length < 1 ? null : movesExecuted[movesExecuted.length - 1]
  // make sure to not undo previous move
  const nextMoves = possibleMoves().filter(move => move !== reverseMove(lastMove))
  // pick one random from possible next moves
  const nextMove = _.sample(nextMoves)
  movesExecuted.push(nextMove)
  doMove(nextMove)
  // prettyPrintBoard(board)
}

// printSolution(movesExecuted)


console.log('final:')
prettyPrintBoard(board)
console.log(formatAsOutput());
