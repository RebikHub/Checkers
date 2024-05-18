export function converterLetter (letter) {
  switch (letter) {
    case 'a':
      return 1
    case 'b':
      return 2
    case 'c':
      return 3
    case 'd':
      return 4
    case 'e':
      return 5
    case 'f':
      return 6
    case 'g':
      return 7
    case 'h':
      return 8
    default:
      return 0
  }
}

export function converterNumber (number) {
  switch (number) {
    case 1:
      return 'a'
    case 2:
      return 'b'
    case 3:
      return 'c'
    case 4:
      return 'd'
    case 5:
      return 'e'
    case 6:
      return 'f'
    case 7:
      return 'g'
    case 8:
      return 'h'
    default:
      return 0
  }
}

export function currentPosition (id) {
  const splitId = id.split('-')
  const x = +converterLetter(splitId[0])
  const y = +splitId[1]
  return {
    x,
    y
  }
}

export function possibleMoves (cells, id) {
  const position = currentPosition(id)
  const moves = [
    {
      x: position.x - 1,
      y: position.y + 1
    }, {
      x: position.x + 1,
      y: position.y + 1
    }
  ].map((move) => `${converterNumber(move.x)}-${move.y}`)
  const result = []
  cells.forEach((cell) => {
    moves.forEach((move) => {
      if (cell === move) {
        result.push(move)
      }
    })
  })
  return result
}
