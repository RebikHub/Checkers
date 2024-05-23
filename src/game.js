import Checker from './checker'

export default class Game {
  constructor () {
    this.whoseMove = 'white'
    this.positionWhite = ['a-1', 'a-3', 'b-2', 'c-1', 'c-3', 'd-2', 'e-1', 'e-3', 'f-2', 'g-1', 'g-3', 'h-2']
    this.positionBlack = ['a-7', 'b-6', 'b-8', 'c-7', 'd-6', 'd-8', 'e-7', 'f-6', 'f-8', 'g-7', 'h-6', 'h-8']
    this.emptyCells = ['a-5', 'b-4', 'c-5', 'd-4', 'e-5', 'f-4', 'g-5', 'h-4']
  }

  start () {
    // лучше прикаждом ходе тут обновлять все состояние доски и тут вычислять новые клетки и шашки
    const cells = document.querySelectorAll('.black')
    const whites = this.positionWhite
    const blacks = this.positionBlack

    for (let i = 0; i < whites.length; i += 1) {
      for (let j = 0; j < cells.length; j += 1) {
        if (cells[j].classList.contains(whites[i])) {
          this.createChecker(cells[j], whites[i], 'white')
        }
      }
    }

    for (let i = 0; i < blacks.length; i += 1) {
      for (let j = 0; j < cells.length; j += 1) {
        if (cells[j].classList.contains(blacks[i])) {
          this.createChecker(cells[j], blacks[i], 'black')
        }
      }
    }

    let moves = null
    let id = null
    for (const cell of cells) {
      cell.addEventListener('click', (e) => {
        if (e.target.className.includes(this.whoseMove) && e.target.dataset.id) {
          id = e.target.dataset.id
          moves = this.possibleMoves(id)
          this.addStylePossibleMove(moves)
        } else {
          const stepCell = e.target.className.split(' ')[1]
          if (moves != null && moves.move.includes(stepCell)) {
            const element = document.querySelector(`.${stepCell}`)
            this.removeChecker(id)
            this.createChecker(element, stepCell, this.whoseMove)
            this.updatePositions()
            this.whoseMove = this.whoseMove === 'white' ? 'black' : 'white'
          } else if (moves != null && moves.cut.includes(stepCell)) {
            const element = document.querySelector(`.${stepCell}`)
            this.removeChecker(id)
            this.createChecker(element, stepCell, this.whoseMove)
            this.updatePositions()
            this.whoseMove = this.whoseMove === 'white' ? 'black' : 'white'
          }
        }
      })
    }
  }

  updatePositions () {
    const cells = document.querySelectorAll('.black')
    const allCells = []
    const blackCells = document.querySelectorAll('.checker-black')
    const whiteCells = document.querySelectorAll('.checker-white')
    this.positionBlack = [...Array.from(blackCells).map((item) => item.dataset.id)]
    this.positionWhite = [...Array.from(whiteCells).map((item) => item.dataset.id)]

    const checkersCells = [...this.positionBlack, ...this.positionWhite]
    for (const cell of cells) {
      allCells.push(cell.classList[1])
    }
    this.emptyCells = allCells.filter((c) => !checkersCells.includes(c))
    this.clearStylePossibleMove()
  }

  createChecker (cell, id, color) {
    const checker = Checker[color]()
    checker.dataset.id = id
    cell.appendChild(checker)
  }

  removeChecker (id) {
    const cell = document.querySelector(`.${id}`)
    const checker = document.querySelector(`[data-id=${id}]`)

    if (cell && checker) {
      cell.removeChild(checker)
    }
  }

  clearStylePossibleMove () {
    const cells = document.querySelectorAll('.black')
    Array.from(cells).forEach((cell) => {
      cell.classList.remove('possible-move')
    })
  }

  addStylePossibleMove (moves) {
    this.clearStylePossibleMove()
    moves.forEach((move) => {
      const el = document.querySelector(`.${move}`)
      if (el) {
        el.classList.add('possible-move')
      }
    })
  }

  static converterLetter (letter) {
    switch (letter) {
      case 'a':
        return 1
      case 'b':
        return 2
      case 'c':
        return 3
      case 'd':
        return 4
      case 'e':
        return 5
      case 'f':
        return 6
      case 'g':
        return 7
      case 'h':
        return 8
      default:
        return 0
    }
  }

  static converterNumber (number) {
    switch (number) {
      case 1:
        return 'a'
      case 2:
        return 'b'
      case 3:
        return 'c'
      case 4:
        return 'd'
      case 5:
        return 'e'
      case 6:
        return 'f'
      case 7:
        return 'g'
      case 8:
        return 'h'
      default:
        return 0
    }
  }

  currentPosition (id) {
    const splitId = id.split('-')
    const x = +Game.converterLetter(splitId[0])
    const y = +splitId[1]
    return {
      x,
      y
    }
  }

  possibleMoves (id) {
    const cutDownMove = []
    const position = this.currentPosition(id)
    const moves = [
      {
        x: this.whoseMove === 'white' ? position.x - 1 : position.x - 1,
        y: this.whoseMove === 'white' ? position.y + 1 : position.y - 1
      }, {
        x: this.whoseMove === 'white' ? position.x + 1 : position.x + 1,
        y: this.whoseMove === 'white' ? position.y + 1 : position.y - 1
      }
    ].map((move) => `${Game.converterNumber(move.x)}-${move.y}`)

    moves.forEach((cell, index) => {
      if (this.whoseMove === 'white' && this.positionBlack.includes(cell)) {
        const cutDownCell = this.currentPosition(cell)
        if (index === 0) {
          cutDownMove.push({
            x: cutDownCell.x - 1,
            y: cutDownCell.y + 1
          })
        }

        if (index === 1) {
          cutDownMove.push({
            x: cutDownCell.x + 1,
            y: cutDownCell.y + 1
          })
        }
      } else if (this.whoseMove === 'black' && this.positionWhite.includes(cell)) {
        const cutDownCell = this.currentPosition(cell)
        if (index === 0) {
          cutDownMove.push({
            x: cutDownCell.x - 1,
            y: cutDownCell.y - 1
          })
        }

        if (index === 1) {
          cutDownMove.push({
            x: cutDownCell.x + 1,
            y: cutDownCell.y - 1
          })
        }
      }
    })

    const cutDownMoves = cutDownMove.map((move) => `${Game.converterNumber(move.x)}-${move.y}`)

    const result = {
      cut: [],
      move: []
    }
    this.emptyCells.forEach((cell) => {
      moves.forEach((move) => {
        if (cell === move) {
          result.move.push(move)
        }
      })

      cutDownMoves.forEach((move) => {
        if (cell === move) {
          result.cut.push(move)
        }
      })
    })
    return result
  }
}
