type BoardConfig = {
  [key in string]: {
  even: string
  odd: string
}
}

export default class Board {
  app: Element
  element: HTMLDivElement
  horizon: string[]
  vertical: number[]
  board: BoardConfig
  constructor (app: Element) {
    this.app = app
    this.element = document.createElement('div')
    this.horizon = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    this.vertical = [1, 2, 3, 4, 5, 6, 7, 8]
    this.board = Board.createBoardConfig(this.horizon)
  }

  static createBoardConfig (horizon: string[]) {
    const config: BoardConfig = {}
    const colors = ['white', 'black']
    horizon.forEach((letter, index) => {
      config[letter] = {
        even: colors[index % 2],
        odd: colors[(index + 1) % 2]
      }
    })
    return config
  }

  render () {
    const board = this.board
    this.element.classList.add('board')

    const getColor = (number: number) => (number % 2 === 0 ? 'even' : 'odd')

    this.horizon.forEach((horLetter) => {
      const horElement = document.createElement('div')
      horElement.classList.add('line')
      this.vertical.slice().reverse().forEach((verNumber) => {
        const cell = document.createElement('div')
        cell.classList.add(board[horLetter][getColor(verNumber)])
        cell.classList.add(`${horLetter}-${verNumber}`)
        horElement.appendChild(cell)
      })
      this.element.appendChild(horElement)
    })

    this.app.appendChild(this.element)
  }
}
