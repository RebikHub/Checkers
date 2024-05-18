import Checker from "./checker"

export default class Game {
  constructor() {
    this.whoseMove = 'white'
    this.startPositionWhite = ['a-1','a-3','b-2','c-1','c-3','d-2','e-1','e-3','f-2','g-1','g-3','h-2']
    this.startPositionBlack = ['a-7','b-6','b-8','c-7','d-6','d-8','e-7','f-6','f-8','g-7','h-6','h-8']
    this.playableCells = ['a-5','b-4','c-5','d-4','e-5','f-4','g-5','h-4']
  }

  start() {
    const cells = document.querySelectorAll('.black')
    const whites = this.startPositionWhite
    const blacks = this.startPositionBlack

    for (let i = 0; i < whites.length; i += 1) {
      for (let j = 0; j < cells.length; j += 1) {
        if (cells[j].classList.contains(whites[i])) {
          const checker = Checker.white()
          checker.dataset.id = whites[i]
          cells[j].appendChild(checker)
        }
      }
    }

    for (let i = 0; i < blacks.length; i += 1) {
      for (let j = 0; j < cells.length; j += 1) {
        if (cells[j].classList.contains(blacks[i])) {
          const checker = Checker.black()
          checker.dataset.id = blacks[i]
          cells[j].appendChild(checker)
        }
      }
    }

    this.gamePlay()
  }

  gamePlay() {
    if (this.whoseMove === 'white') {
      const checkers = document.querySelectorAll('.checker-white')
      for (const checker of checkers) {
        checker.addEventListener('click', (e) => {
          const id = e.target.dataset.id
          const splitId = id.split('-')
          console.log(id, splitId);
          
        })
      }
    }

    if (this.whoseMove === 'black') {
      const checkers = document.querySelectorAll('.checker-black')
      for (const checker of checkers) {
        checker.addEventListener('click', (e) => {
          console.log(e.target.dataset.id);
        })
      }
    }
  }
}