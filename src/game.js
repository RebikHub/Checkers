import Checker from './checker'

export default class Game {
  constructor () {
    this.whoseMove = 'white'
    this.positionWhite = ['a-1', 'a-3', 'b-2', 'c-1', 'c-3', 'd-2', 'e-1', 'e-3', 'f-2', 'g-1', 'g-3', 'h-2']
    this.positionBlack = ['a-7', 'b-6', 'b-8', 'c-7', 'd-6', 'd-8', 'e-7', 'f-6', 'f-8', 'g-7', 'h-6', 'h-8']
    this.emptyCells = ['a-5', 'b-4', 'c-5', 'd-4', 'e-5', 'f-4', 'g-5', 'h-4']
    this.moves = null
    this.id = null
  }

  start () {
    this.setupCheckers('white', this.positionWhite)
    this.setupCheckers('black', this.positionBlack)
    this.setupEventListeners()
  }

  setupCheckers (color, positions) {
    const cells = document.querySelectorAll('.black')
    positions.forEach(position => {
      const cell = Array.from(cells).find(cell => cell.classList.contains(position))
      if (cell) this.createChecker(cell, position, color)
    })
  }

  setupEventListeners () {
    const cells = document.querySelectorAll('.black')
    cells.forEach(cell => {
      cell.addEventListener('click', this.handleCellClick.bind(this))
    })
  }

  handleCellClick (e) {
    const target = e.target
    const isCurrentPlayerChecker = target.className.includes(this.whoseMove) && target.dataset.id

    if (isCurrentPlayerChecker) {
      this.id = target.dataset.id
      this.moves = this.possibleMoves(this.id)
      this.addStylePossibleMove(this.moves)
    } else {
      const stepCell = target.className.split(' ')[1]
      if (this.moves && this.moves.move.includes(stepCell)) {
        this.moveChecker(this.id, stepCell)
      } else if (this.moves && this.moves.cut.includes(stepCell)) {
        this.cutChecker(this.id, stepCell)
      }
    }
  }

  moveChecker (id, stepCell) {
    const element = document.querySelector(`.${stepCell}`)
    this.removeChecker(id)
    this.createChecker(element, stepCell, this.whoseMove)
    this.updatePositions()
    this.switchPlayer()
  }

  cutChecker (id, stepCell) {
    const element = document.querySelector(`.${stepCell}`)
    this.removeChecker(id)
    this.createChecker(element, stepCell, this.whoseMove)

    const removeId = {
      x: (this.currentPosition(id).x + this.currentPosition(stepCell).x) / 2,
      y: (this.currentPosition(id).y + this.currentPosition(stepCell).y) / 2
    }
    this.removeChecker(Game.numberToId(removeId))
    this.updatePositions()
    this.switchPlayer()
  }

  switchPlayer () {
    this.whoseMove = this.whoseMove === 'white' ? 'black' : 'white'
  }

  updatePositions () {
    const cells = document.querySelectorAll('.black')
    const blackCells = document.querySelectorAll('.checker-black')
    const whiteCells = document.querySelectorAll('.checker-white')

    this.positionBlack = Array.from(blackCells).map(item => item.dataset.id)
    this.positionWhite = Array.from(whiteCells).map(item => item.dataset.id)

    const occupiedCells = new Set([...this.positionBlack, ...this.positionWhite])
    this.emptyCells = Array.from(cells).map(cell => cell.classList[1]).filter(cell => !occupiedCells.has(cell))

    this.clearStylePossibleMove()
  }

  createChecker (cell, id, color) {
    const checker = Checker[color]()
    if (checker) {
      checker.dataset.id = id
      cell.appendChild(checker)
    } else {
      console.error(`Checker of color ${color} could not be created.`)
    }
  }

  removeChecker (id) {
    const cell = document.querySelector(`.${id}`)
    const checker = cell ? cell.querySelector(`[data-id=${id}]`) : null

    if (checker) {
      cell.removeChild(checker)
    } else {
      console.warn(`Checker with id ${id} not found.`)
    }
  }

  clearStylePossibleMove () {
    document.querySelectorAll('.black').forEach(cell => cell.classList.remove('possible-move'))
  }

  addStylePossibleMove (moves) {
    this.clearStylePossibleMove()
    moves.move.concat(moves.cut).forEach(move => {
      const el = document.querySelector(`.${move}`)
      if (el) {
        el.classList.add('possible-move')
      }
    })
  }

  static converterLetter (letter) {
    return 'abcdefgh'.indexOf(letter) + 1
  }

  static converterNumber (number) {
    return 'abcdefgh'[number - 1]
  }

  currentPosition (id) {
    const [letter, number] = id.split('-')
    return {
      x: Game.converterLetter(letter),
      y: Number(number)
    }
  }

  static numberToId (position) {
    return `${Game.converterNumber(position.x)}-${position.y}`
  }

  possibleMoves (id) {
    const position = this.currentPosition(id)
    const direction = this.whoseMove === 'white' ? 1 : -1

    const moves = [
      { x: position.x - 1, y: position.y + direction },
      { x: position.x + 1, y: position.y + direction }
    ].map(Game.numberToId)

    const backMoves = [
      { x: position.x - 1, y: position.y - direction },
      { x: position.x + 1, y: position.y - direction }
    ].map(Game.numberToId)

    const result = {
      move: [],
      cut: []
    }

    const addMoves = (moveList, targetColor, cut) => {
      moveList.forEach((cell) => {
        if (this[targetColor].includes(cell)) {
          const cutPosition = this.currentPosition(cell)
          const cutMove = {
            x: cutPosition.x + (cutPosition.x - position.x),
            y: cutPosition.y + (cutPosition.y - position.y)
          }
          result.cut.push(Game.numberToId(cutMove))
        } else if (!cut) {
          result.move.push(cell)
        }
      })
    }

    addMoves(moves, this.whoseMove === 'white' ? 'positionBlack' : 'positionWhite')
    addMoves(backMoves, this.whoseMove === 'white' ? 'positionBlack' : 'positionWhite', 'cut')

    result.move = result.move.filter(cell => this.emptyCells.includes(cell))
    result.cut = result.cut.filter(cell => this.emptyCells.includes(cell))

    return result
  }
}
