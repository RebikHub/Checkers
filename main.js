import Board from './board'
import Checker from './checker'
import Game from './game'
import './style.css'

const app = document.querySelector('#app')

const board = new Board()
const game = new Game()

board.render(app)

game.start()
