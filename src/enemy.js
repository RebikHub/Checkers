export default class Enemy {
  constructor (app) {
    this.app = app
    this.cpu = false
    this.human = false
    this.btnCpu = document.createElement('button')
    this.btnHuman = document.createElement('button')
    this.btnGroup = document.createElement('div')
    this.render = null
  }

  mount (callback) {
    this.human = false
    this.cpu = false
    this.render = callback
    this.btnCpu.textContent = 'CPU'
    this.btnHuman.textContent = 'HUMAN'

    this.btnGroup.className = 'btn-group'
    this.btnGroup.appendChild(this.btnHuman)
    this.btnGroup.appendChild(this.btnCpu)

    this.app.insertAdjacentElement('beforebegin', this.btnGroup)

    this.btnCpu.addEventListener('click', this.checkCpu.bind(this))
    this.btnHuman.addEventListener('click', this.checkHuman.bind(this))
  }

  checkCpu () {
    this.cpu = true
    this.human = false
    this.render()
    this.unmount()
  }

  checkHuman () {
    this.human = true
    this.cpu = false
    this.render()
    this.unmount()
  }

  unmount () {
    this.btnCpu.removeEventListener('click', this.checkCpu.bind(this))
    this.btnHuman.removeEventListener('click', this.checkHuman.bind(this))
    this.btnGroup.remove()
  }
}
