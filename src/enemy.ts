export default class Enemy {
  app: Element
  cpu: boolean
  human: boolean
  btnCpu: HTMLButtonElement
  btnHuman: HTMLButtonElement
  btnGroup: HTMLDivElement

  constructor (app: Element) {
    this.app = app
    this.cpu = false
    this.human = false
    this.btnCpu = document.createElement('button')
    this.btnHuman = document.createElement('button')
    this.btnGroup = document.createElement('div')
  }

  mount (callback: () => void) {
    this.human = false
    this.cpu = false
    this.btnCpu.textContent = 'CPU'
    this.btnHuman.textContent = 'HUMAN'

    this.btnGroup.className = 'btn-group'
    this.btnGroup.appendChild(this.btnHuman)
    this.btnGroup.appendChild(this.btnCpu)

    this.app.insertAdjacentElement('beforebegin', this.btnGroup)

    this.btnCpu.addEventListener('click', this.checkCpu.bind(this, callback))
    this.btnHuman.addEventListener('click', this.checkHuman.bind(this, callback))
  }

  checkCpu (render: () => void) {
    this.cpu = true
    this.human = false
    render()
    this.unmount(render)
  }

  checkHuman (render: () => void) {
    this.human = true
    this.cpu = false
    render()
    this.unmount(render)
  }

  unmount (render: () => void) {
    this.btnCpu.removeEventListener('click', this.checkCpu.bind(this, render))
    this.btnHuman.removeEventListener('click', this.checkHuman.bind(this, render))
    this.btnGroup.remove()
  }
}
