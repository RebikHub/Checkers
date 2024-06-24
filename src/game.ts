import Checker from './checker.js'
import Enemy from './enemy.js'

type Coordinate = { x: number; y: number; }
type Move = { move: string[]; cut: string[]; }

export default class Game {
  whoseMove: string
  positionWhite: string[]
  positionBlack: string[]
  emptyCells: string[]
  jokers: Set<string>
  moves: null | Move
  id: undefined | null | string
  elementTitle: null | HTMLDivElement
  timer: null | number
  positionRandom: string[]
  enemy: Enemy
  constructor (enemy: Enemy) {
    this.whoseMove = 'white'
    this.positionWhite = ['a-1', 'a-3', 'b-2', 'c-1', 'c-3', 'd-2', 'e-1', 'e-3', 'f-2', 'g-1', 'g-3', 'h-2']
    this.positionBlack = ['a-7', 'b-6', 'b-8', 'c-7', 'd-6', 'd-8', 'e-7', 'f-6', 'f-8', 'g-7', 'h-6', 'h-8']
    this.emptyCells = ['a-5', 'b-4', 'c-5', 'd-4', 'e-5', 'f-4', 'g-5', 'h-4']
    this.jokers = new Set()
    this.moves = null
    this.id = null
    this.elementTitle = null
    this.timer = null
    this.positionRandom = []
    this.enemy = enemy
  }

  start () {
    const app = document.querySelector('#app')
    if ((this.enemy.cpu || this.enemy.human) && app) {
      this.setupCheckers('white', this.positionWhite)
      this.setupCheckers('black', this.positionBlack)
      this.setupEventListeners()
      const div = document.createElement('div')
      div.classList.add('whose-move')
      div.textContent = `Сейчас ходят: ${this.whoseMove === 'white' ? 'Белые' : 'Черные'}`
      app.insertAdjacentElement('beforebegin', div)
      this.elementTitle = div
    } else {
      this.enemy.mount(this.start.bind(this))
    }
  }

  reset () {
    this.removeCheckers(this.positionWhite)
    this.removeCheckers(this.positionBlack)
    this.whoseMove = 'white'
    this.positionWhite = ['a-1', 'a-3', 'b-2', 'c-1', 'c-3', 'd-2', 'e-1', 'e-3', 'f-2', 'g-1', 'g-3', 'h-2']
    this.positionBlack = ['a-7', 'b-6', 'b-8', 'c-7', 'd-6', 'd-8', 'e-7', 'f-6', 'f-8', 'g-7', 'h-6', 'h-8']
    this.emptyCells = ['a-5', 'b-4', 'c-5', 'd-4', 'e-5', 'f-4', 'g-5', 'h-4']
    this.jokers.clear()
    this.moves = null
    this.id = null
    const btn = document.querySelector('.btn-reset')
    if (btn && this.elementTitle) {
      this.elementTitle.removeChild(btn)
    }
    if (this.elementTitle) {
      this.elementTitle.textContent = `Сейчас ходят: ${this.whoseMove === 'white' ? 'Белые' : 'Черные'}`
    }
    this.setupCheckers('white', this.positionWhite)
    this.setupCheckers('black', this.positionBlack)
  }

  randomBlackChecker () {
    this.positionRandom = [...this.positionBlack]
    let checkerId: string | null = null
    let moves = null

    while (this.positionRandom.length > 0) {
      checkerId = this.positionRandom[Math.floor(Math.random() * this.positionRandom.length)]
      moves = this.possibleMoves(checkerId)
      if (moves.cut.length > 0) {
        this.id = checkerId
        this.moves = moves
        this.addStylePossibleMove(moves)
        return
      }
      this.positionRandom = this.positionRandom.filter(i => i !== checkerId)
    }

    this.positionRandom = [...this.positionBlack]

    while (this.positionRandom.length > 0) {
      checkerId = this.positionRandom[Math.floor(Math.random() * this.positionRandom.length)]
      moves = this.possibleMoves(checkerId)
      if (moves.move.length > 0) {
        this.id = checkerId
        this.moves = moves
        this.addStylePossibleMove(moves)
        return
      }

      this.positionRandom = this.positionRandom.filter(i => i !== checkerId)
    }
  }

  randomMove (moves: string[]) {
    const stepCell = moves[Math.floor(Math.random() * moves.length)]
    return stepCell
  }

  moveCPU () {
    this.randomBlackChecker()
    if (this.moves && this.moves.cut.length > 0 && this.id) {
      const stepCell = this.randomMove(this.moves.cut)
      this.cutChecker(this.id, stepCell)
      if (this.checkCutSteps(stepCell).length === 0) {
        this.switchPlayer()
      } else {
        this.moveCPU()
      }
    } else if (this.moves && this.moves.move.length > 0 && this.id) {
      const stepCell = this.randomMove(this.moves.move)
      this.moveChecker(this.id, stepCell)
      this.switchPlayer()
    }
  }

  setupCheckers (color: string, positions: string[]) {
    positions.forEach(position => {
      this.createChecker(position, color)
    })
  }

  removeCheckers (positions: string[]) {
    positions.forEach(position => {
      this.removeChecker(position)
    })
  }

  setupEventListeners () {
    const cells = document.querySelectorAll('.black')
    cells.forEach(cell => {
      cell.addEventListener('click', this.handleCellClick.bind(this))
    })
  }

  handleCellClick (e: Event) {
    const target = e.target
    if (target instanceof HTMLElement) {
    const isCurrentPlayerChecker = target.className.includes(this.whoseMove) && target.dataset.id

    if (isCurrentPlayerChecker) {
      this.id = target.dataset.id
      if (this.id) 
      this.moves = this.possibleMoves(this.id)
      if (this.moves)
      this.addStylePossibleMove(this.moves)
    } else {
      const stepCell = target.className.split(' ')[1]

      if (this.whoseMove === 'white' && this.enemy.cpu) {
        if (this.moves && this.moves.move.includes(stepCell) && this.id) {
          this.moveChecker(this.id, stepCell)
          this.switchPlayer()
        } else if (this.moves && this.moves.cut.includes(stepCell) && this.id) {
          this.cutChecker(this.id, stepCell)
          if (this.checkCutSteps(stepCell).length === 0) {
            this.switchPlayer()
          }
        }
      } else if (this.enemy.human) {
        if (this.moves && this.moves.move.includes(stepCell) && this.id) {
          this.moveChecker(this.id, stepCell)
          this.switchPlayer()
        } else if (this.moves && this.moves.cut.includes(stepCell) && this.id) {
          this.cutChecker(this.id, stepCell)
          if (this.checkCutSteps(stepCell).length === 0) {
            this.switchPlayer()
          }
        }
      }

      this.checkWinner()
    }
  }
  }

  addJoker (id: string, checker: Element) {
    const position = this.currentPosition(id)
    if (this.jokers.has(id)) {
      checker.classList.add('joker')
    } else if (checker.className.includes('white') && position.y === 8) {
      checker.classList.add('joker')
      this.jokers.add(id)
    } else if (checker.className.includes('black') && position.y === 1) {
      checker.classList.add('joker')
      this.jokers.add(id)
    }
  }

  moveChecker (id: string, stepCell: string) {
    this.removeChecker(id)
    if (this.jokers.has(id)) {
      this.jokers.delete(id)
      this.jokers.add(stepCell)
    }
    this.createChecker(stepCell, this.whoseMove)
    this.updatePositions()
  }

  cutChecker (id: string, stepCell: string) {
    this.moveChecker(id, stepCell)

    const positon = this.currentPosition(id)
    const cutPosition = this.currentPosition(stepCell)

    const removeId = {
      x: (positon.x > cutPosition.x) ? cutPosition.x + 1 : cutPosition.x - 1,
      y: (positon.y > cutPosition.y) ? cutPosition.y + 1 : cutPosition.y - 1
    }
    this.jokers.delete(Game.numberToId(removeId))
    this.removeChecker(Game.numberToId(removeId))
    this.updatePositions()
  }

  switchPlayer () {
    this.whoseMove = this.whoseMove === 'white' ? 'black' : 'white'
    if (this.elementTitle) this.elementTitle.textContent = `Сейчас ходят: ${this.whoseMove === 'white' ? 'Белые' : 'Черные'}`
    if (this.whoseMove === 'black' && this.enemy.cpu) {
      this.moves = null
      this.id = null
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => this.moveCPU(), 2000)
    }
  }

  updatePositions (clear = true) {
    const cells = document.querySelectorAll('.black')
    const blackCells = document.querySelectorAll('.checker-black')
    const whiteCells = document.querySelectorAll('.checker-white')

    this.positionBlack = (Array.from(blackCells) as HTMLElement[]).map(item => item.dataset.id ? item.dataset.id : '')
    this.positionWhite = (Array.from(whiteCells)  as HTMLElement[]).map(item => item.dataset.id ? item.dataset.id : '')

    const occupiedCells = [...this.positionBlack, ...this.positionWhite]
    this.emptyCells = Array.from(cells).map(cell => cell.classList[1]).filter(cell => !occupiedCells.includes(cell))

    if (clear) this.clearStylePossibleMove()
  }

  checkWinner () {
    if (this.elementTitle && this.positionBlack.length === 0) {
      this.elementTitle.textContent = 'Победили белые!'
    } else if (this.elementTitle && this.positionWhite.length === 0) {
      this.elementTitle.textContent = 'Победили черные!'
    }

    if (this.positionBlack.length === 0 || this.positionWhite.length === 0) {
      this.enemy.mount(this.reset.bind(this))
    }
  }

  createChecker (id: string, color: string) {
    const element = document.querySelector(`.${id}`)
    const checker = Checker[color as 'white' | 'black']()
    if (checker && element) {
      checker.dataset.id = id
      element.appendChild(checker)
      this.addJoker(id, checker)
    } else {
      console.error(`Checker of color ${color} could not be created.`)
    }
  }

  removeChecker (id: string) {
    const cell = document.querySelector(`.${id}`)
    const checker = cell ? cell.querySelector(`[data-id=${id}]`) : null

    if (checker && cell) {
      cell.removeChild(checker)
    } else {
      console.warn(`Checker with id ${id} not found.`)
    }
  }

  clearStylePossibleMove () {
    document.querySelectorAll('.black').forEach(cell => cell.classList.remove('possible-move'))
  }

  addStylePossibleMove (moves: Move) {
    this.clearStylePossibleMove()
    moves.move.concat(moves.cut).forEach(move => {
      const el = document.querySelector(`.${move}`)
      if (el) {
        el.classList.add('possible-move')
      }
    })
  }

  static converterLetter (letter: string) {
    return 'abcdefgh'.indexOf(letter) + 1
  }

  static converterNumber (number: number) {
    return 'abcdefgh'[number - 1]
  }

  currentPosition (id: string) {
    const [letter, number] = id.split('-')
    return {
      x: Game.converterLetter(letter),
      y: Number(number)
    }
  }

  static numberToId (position: Coordinate) {
    return `${Game.converterNumber(position.x)}-${position.y}`
  }

  checkCutSteps (cell: string) {
    const moves = this.possibleMoves(cell)
    return moves.cut
  }

  possibleMoves (id: string) {
    const position = this.currentPosition(id)
    const direction = this.whoseMove === 'white' ? 1 : -1

    if (this.jokers.has(id)) {
      const dir = this.whoseMove === 'white' ? 1 : -1
      const step = 8

      const moves: {
        upLeft: Coordinate[],
        upRight: Coordinate[],
        downLeft: Coordinate[],
        downRight: Coordinate[]
      } = {
        upLeft: [],
        upRight: [],
        downLeft: [],
        downRight: []
      }

      for (let i = 1; i <= step; i += 1) {
        moves.upLeft.push({ x: position.x - i, y: position.y + i * dir })
        moves.upRight.push({ x: position.x + i, y: position.y + i * dir })
        moves.downLeft.push({ x: position.x - i, y: position.y - i * dir })
        moves.downRight.push({ x: position.x + i, y: position.y - i * dir })
      }

      const result: {
        move: string[],
        cut: string[]
      } = {
        move: [],
        cut: []
      }

      const loopArray = (array: string[]) => {
        for (let i = 0; i < array.length; i++) {
          const cell: string = array[i]
          if (this[this.whoseMove === 'white' ? 'positionBlack' : 'positionWhite'].includes(cell)) {
            const cutPosition = this.currentPosition(cell)
            const cutMove = {
              x: position.x < cutPosition.x ? cutPosition.x + 1 : cutPosition.x - 1,
              y: position.y < cutPosition.y ? cutPosition.y + 1 : cutPosition.y - 1
            }
            result.cut.push(Game.numberToId(cutMove))
            break
          } else if (this[this.whoseMove === 'white' ? 'positionWhite' : 'positionBlack'].includes(cell)) {
            result.move.push(cell)
            break
          } else {
            result.move.push(cell)
          }
        }
      }

      loopArray(moves.upLeft.map(Game.numberToId))
      loopArray(moves.upRight.map(Game.numberToId))
      loopArray(moves.downLeft.map(Game.numberToId))
      loopArray(moves.downRight.map(Game.numberToId))

      result.move = result.move.filter(cell => this.emptyCells.includes(cell))
      result.cut = result.cut.filter(cell => this.emptyCells.includes(cell))

      return result
    }

    const moves = [
      { x: position.x - 1, y: position.y + direction },
      { x: position.x + 1, y: position.y + direction }
    ].map(Game.numberToId)

    const backMoves = [
      { x: position.x - 1, y: position.y - direction },
      { x: position.x + 1, y: position.y - direction }
    ].map(Game.numberToId)

    const result: {
      move: string[],
      cut: string[]
    } = {
      move: [],
      cut: []
    }

    const addMoves = (moveList: string[], targetColor: string, cut?: string) => {
      moveList.forEach((cell) => {
        if (this[targetColor as 'positionBlack' | 'positionWhite'].includes(cell)) {
          const cutPosition = this.currentPosition(cell)
          const cutMove = {
            x: position.x < cutPosition.x ? cutPosition.x + 1 : cutPosition.x - 1,
            y: position.y < cutPosition.y ? cutPosition.y + 1 : cutPosition.y - 1
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
