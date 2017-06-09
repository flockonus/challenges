const _ = require('lodash')
require('colors')
// const fs = require('fs')

// dimension of the board, altho we make 1 dimensional
const DIM = parseInt(process.argv[2])

if (isNaN(DIM) || !DIM) throw new Error('missing argv 1: rows, argv 2: input filename')

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

// memory of board states - board(String): moveCount(Number) (just store the count to optm. memory usage)
var states = new Map()

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

// max number of moves to be executed during simulation
const maxMoves = 8e6
// const maxMoves = 362880 // for DIM = 3
// const maxMoves = 2

// not using now
var movesExecuted = []
var moveCount = 0
var repeatedPositions = 0
var newPositions = 0

// // stream to the file well be writting
// var stream
// // keep a buffer to the solution file we are creating
// var writeQueue = []
// function bufferedAppend (row) {
//   writeQueue.push(row + ',\n')
//   // this doesnt seem to optimize anything really
//   if (writeQueue.length > 100) {
//     stream.write(writeQueue.join(''))
//     writeQueue = []
//   }
// }

// just dont start before we can write to file
function buildSolutions () {
  console.log(`start - DIM: ${DIM} ${maxMoves} moves`)

  // add solution case
  // const firstNode = {s: moveCount, m: ''}
  states.set(board + '', moveCount)
  // bufferedAppend(`"${board + ''}": ${JSON.stringify(firstNode)}`)
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
    const prevEffort = states.get(serializedBoard)
    if (prevEffort) {
      // TODO optimize see if we should switch up states based on the number here
      // 'reset' the step count to rely on the fact we have seen this state happen before
      moveCount = prevEffort
      // console.log('  -- seen this state before, skipping it')
      repeatedPositions++
    } else {
      // const node = {
      //   s: moveCount,
      //   m: reverseMove(nextMove)
      // }
      states.set(serializedBoard, moveCount)
      newPositions++
      // bufferedAppend(`"${serializedBoard}": ${JSON.stringify(node)}`)
    }
    // prettyPrintBoard(board)
    moveCount++
  }
  console.log('stats:', {newPositions, repeatedPositions})
}

// find solution for given input
function findSolutionForInput () {
  var startTime = Date.now()
  board = require('./input/' + process.argv[3]).puzzle
  pos = _.indexOf(board, EMPTY) + 1
  movesExecuted = []

  var maxMovesToSolution = 8e6
  moveCount = 0
  var solution

  console.log('looking for solution, max moves:', maxMovesToSolution)
  prettyPrintBoard(board)

  while (moveCount < maxMovesToSolution) {
    solution = states.get(board + '')
    if (solution) {
      console.log('solved!!', solution, moveCount, '=', solution + moveCount, 'in', (Date.now() - startTime) + 'ms')
      break
    }
    // prettyPrintBoard(board)

    const lastMove = movesExecuted.length < 1 ? null : movesExecuted[movesExecuted.length - 1]
    // make sure to not undo previous move
    const nextMoves = possibleMoves().filter(move => move !== reverseMove(lastMove))
    // pick one random from possible next moves
    const nextMove = _.sample(nextMoves)
    // console.log('next:', nextMove, 'possible:', possibleMoves())
    movesExecuted.push(nextMove)
    doMove(nextMove)

    moveCount++
  }

  if (!solution) {
    console.log('could not solve :(')
  }
}

// const filePath = `map-${DIM}.json`
// erase previous solution map file if we had any
// try { fs.unlinkSync(filePath) } catch (e) {}

// ignoring the file writing part
// stream = fs.createWriteStream(filePath)
// stream.once('open', function (fd) {
//   stream.write('{\n')
//   run()
//   // push a bogus state so there is no comma left over in the JSON
//   bufferedAppend(`"":{}`)
//   stream.write(writeQueue.join(''))
//   stream.write('}\n')
//   stream.end()
// })

buildSolutions()

findSolutionForInput()
