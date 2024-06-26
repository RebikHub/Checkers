import Board from './src/board'
import Enemy from './src/enemy'
import Game from './src/game'
import './style.css'

const app = document.querySelector('#app')

if (app) {
  const enemy = new Enemy(app)
  const board = new Board(app)
  const game = new Game(enemy)
  
  board.render()
  
  game.start()
} else {
  console.error('Element app is null')
}
