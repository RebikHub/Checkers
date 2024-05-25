export default class Enemy {
  constructor (app) {
    this.app = app
  }

  render () {
    const btnGroup = document.createElement('div')
    const btnHuman = document.createElement('button')
    const btnCpu = document.createElement('button')
    btnCpu.textContent = 'CPU'
    btnHuman.textContent = 'HUMAN'

    btnGroup.appendChild(btnHuman)
    btnGroup.appendChild(btnCpu)

    this.app.appendChild(btnGroup)
  }
}
