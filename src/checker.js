export default class Checker {
  static white () {
    const element = document.createElement('div')
    element.classList.add('checker-white')
    return element
  }

  static black () {
    const element = document.createElement('div')
    element.classList.add('checker-black')
    return element
  }
}
