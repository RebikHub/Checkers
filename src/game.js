import Checker from './checker'

export default class Game {
  constructor () {
    this.whoseMove = 'white'
    this.startPositionWhite = ['a-1', 'a-3', 'b-2', 'c-1', 'c-3', 'd-2', 'e-1', 'e-3', 'f-2', 'g-1', 'g-3', 'h-2']
    this.startPositionBlack = ['a-7', 'b-6', 'b-8', 'c-7', 'd-6', 'd-8', 'e-7', 'f-6', 'f-8', 'g-7', 'h-6', 'h-8']
    this.playableCells = ['a-5', 'b-4', 'c-5', 'd-4', 'e-5', 'f-4', 'g-5', 'h-4']
  }

  start () {

    // лучше прикаждом ходе тут обновлять все состояние доски и тут вычислять новые клетки и шашки
    const cells = document.querySelectorAll('.black')
    const whites = this.startPositionWhite
    const blacks = this.startPositionBlack

    for (let i = 0; i < whites.length; i += 1) {
      for (let j = 0; j < cells.length; j += 1) {
        if (cells[j].classList.contains(whites[i])) {
          Game.createChecker(cells[j], whites[i], 'white')
        }
      }
    }

    for (let i = 0; i < blacks.length; i += 1) {
      for (let j = 0; j < cells.length; j += 1) {
        if (cells[j].classList.contains(blacks[i])) {
          Game.createChecker(cells[j], blacks[i], 'black')
        }
      }
    }

    this.gamePlay()
  }

  gamePlay () {
    const checkers = document.querySelectorAll(`.checker-${this.whoseMove}`)
    for (const checker of checkers) {
      checker.addEventListener('click', this.clickMove.bind(this))
    }
  }

  clickMove (e) {
    const id = e.target.dataset.id
    const moves = this.possibleMoves(this.playableCells, id)

    this.clearStylePossibleMove()
    moves.forEach((move) => {
      const el = document.querySelector(`.${move}`)
      if (el) {
        el.classList.add('possible-move')
      }
    })
    this.step(moves, id)
  }

  removeListenerCheckers () {
    const checkers = document.querySelectorAll(`.checker-${this.whoseMove}`)
    for (const checker of checkers) {
      checker.removeEventListener('click', this.clickMove.bind(this))
    }
  }

  step (moves, id) {
    moves.forEach((cell) => {
      const element = document.querySelector(`.${cell}`)
      if (element) {
        element.addEventListener('click', () => {
          Game.removeChecker(id)
          Game.createChecker(element, cell, this.whoseMove)
          this.clearStylePossibleMove()
          this.playableCells = [...this.playableCells.filter((c) => cell !== c)]
          this.playableCells.push(id)
          this.removeListenerCheckers()
          this.whoseMove = this.whoseMove === 'white' ? 'black' : 'white'
          this.gamePlay()
        })
      }
    })
  }

  static createChecker (cell, id, color) {
    const checker = Checker[color]()
    checker.dataset.id = id
    cell.appendChild(checker)
  }

  static removeChecker (id) {
    const cell = document.querySelector(`.${id}`)
    const checker = document.querySelector(`[data-id=${id}]`)

    if (cell && checker) {
      cell.removeChild(checker)
    }
  }

  clearStylePossibleMove () {
    this.playableCells.forEach((cell) => {
      const el = document.querySelector(`.${cell}`)
      if (el) {
        el.classList.remove('possible-move')
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

  possibleMoves (cells, id) {
    const position = this.currentPosition(id)
    const moves = [
      {
        x: position.x - 1,
        y: position.y + 1
      }, {
        x: position.x + 1,
        y: position.y + 1
      }
    ].map((move) => `${Game.converterNumber(move.x)}-${move.y}`)
    const result = []
    cells.forEach((cell) => {
      moves.forEach((move) => {
        if (cell === move) {
          result.push(move)
        }
      })
    })
    return result
  }
}
