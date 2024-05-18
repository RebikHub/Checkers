import Board from './src/board'
import Game from './src/game'
import './style.css'

const app = document.querySelector('#app')

const board = new Board()
const game = new Game()

board.render(app)

game.start()
