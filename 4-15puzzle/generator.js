const _ = require('lodash')
require('colors')
const fs = require('fs')

// dimension of the board, altho we make 1 dimensional
const DIM = 4

// size of the board (array)
const SIZE = DIM * DIM

const EMPTY = -1

// where the empty space starts (considering 1 based index)
let pos = SIZE

function buildBoard () {
  var a = new Array(SIZE).fill(0).map((x, i) => i + 1)
    // where the void starts
  a[pos - 1] = EMPTY
  return a
}

// memory of board states - board(String): {move, steps}
var states = {}

var board = buildBoard()

function prettyPrintBoard (board) {
  console.log('------------------------------')
  const weights = board.map((x, idx) => x === EMPTY ? 0 : x - idx - 1)
  const diffOutput = weights.concat('sum:')
  // last value is the sum
  diffOutput.push(weights.reduce((sum, x) => sum + x, 0))
  // last value is absolute sum
  diffOutput.push(weights.reduce((sum, x) => sum + Math.abs(x), 0))
  console.log(diffOutput.map(diff => (
    typeof diff === 'string' ? diff
    : diff === 0 ? ''
    : diff > 0 ? ('+' + diff).toString().yellow
    : diff.toString().green)).join('\t')
  )
  console.log(board.join('\t'))
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
    table.push(board.slice(i * DIM, i * DIM + DIM))
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

// return a copy of the board
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

function saveSolutions (states) {
  // could be much more efficient to save as an array
  fs.writeFileSync(`map-${DIM}.json`, JSON.stringify(states))
}

// max number of moves to be executed during simulation
const maxMoves = 3e6
// const maxMoves = 362880 // for DIM = 3
// const maxMoves = 2

// not using now
const movesExecuted = []
var moveCount = 0
var repeatedPositions = 0
var newPositions = 0

console.log(`start: ${maxMoves} moves`)
// prettyPrintBoard(board)
for (var i = 0; i < maxMoves; i++) {
  const lastMove = movesExecuted.length < 1 ? null : movesExecuted[movesExecuted.length - 1]
  // make sure to not undo previous move
  const nextMoves = possibleMoves().filter(move => move !== reverseMove(lastMove))
  // pick one random from possible next moves
  const nextMove = _.sample(nextMoves)
  // console.log('next:', nextMove, 'possible:', possibleMoves())
  movesExecuted.push(nextMove)
  doMove(nextMove)
  // can link the current state of the board, to the move and number of steps that led to it
  // cast to string (hope is faster than .join(','))
  const serializedBoard = board + ''
  const sameStateBefore = states[serializedBoard]
  if (sameStateBefore) {
    // 'reset' the step count to rely on the fact we have seen this state happen before
    moveCount = sameStateBefore.steps
    // console.log('  -- seen this state before, skipping it')
    repeatedPositions++
  } else {
    states[serializedBoard] = {
      steps: moveCount,
      move: reverseMove(nextMove)
    }
    newPositions++
  }
  // prettyPrintBoard(board)
  moveCount++
}

// printSolution(movesExecuted)
console.log({newPositions, repeatedPositions})
saveSolutions(states)
