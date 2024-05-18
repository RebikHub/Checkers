export default class Board {
  constructor() {
    // even - четное
    // odd - нечетное
    this.element = document.createElement('div')
    this.board = {
      a: {
        even: 'white',
        odd: 'black',
      },
      b: {
        even: 'black',
        odd: 'white',
      },
      c: {
        even: 'white',
        odd: 'black',
      },
      d: {
        even: 'black',
        odd: 'white',
      },
      e: {
        even: 'white',
        odd: 'black',
      },
      f: {
        even: 'black',
        odd: 'white',
      },
      g: {
        even: 'white',
        odd: 'black',
      },
      h: {
        even: 'black',
        odd: 'white',
      },
    },
    this.horizon = ['a','b','c','d','e','f','g','h']
    this.vertical = [1,2,3,4,5,6,7,8]

  }

  render(element) {
    const hor = this.horizon
    const ver = this.vertical.reverse()
    const board = this.board
    this.element.classList.add('board')

    const getColor = (number) => {
      return number % 2 === 0 ? 'even' : 'odd'
    }

    for (let i = 0; i < hor.length; i += 1) {
      const horElement = document.createElement('div')
      horElement.classList.add('line')
      for (let j = 0; j < ver.length; j += 1) {
        const cell = document.createElement('div')
        cell.classList.add(`${board[hor[i]][getColor(ver[j])]}`)
        cell.classList.add(`${[hor[i]]}-${ver[j]}`)
        const id = document.createElement('span')
        id.className = 'span-id'
        id.textContent = `${[hor[i]]}-${ver[j]}`
        cell.appendChild(id)
        horElement.appendChild(cell)
        this.element.appendChild(horElement)
      }
    }

    element.appendChild(this.element)
  }
}