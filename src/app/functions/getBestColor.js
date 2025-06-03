//For 2 given colors ([r, g, b], [r, g, b]), get their difference, from 0 (equal) to 1 (black to white).
function getColorDifference(color1, color2) {
  //V1 - Euclidian distance in the RGB 3-axys spaces:
  return (
    Math.abs(color1[0] - color2[0]) / 255 / 3 +
    Math.abs(color1[1] - color2[1]) / 255 / 3 +
    Math.abs(color1[2] - color2[2]) / 255 / 3
  )
}

//For a given RBG color and a list of cards, returns the option with the most similar color.
function getBestColor(color, cards) {
  var bestMatch = cards[0]
  var diffFromBest = 1
  cards.map(card => {
    const colorDiff = getColorDifference(color, card.avgColor)
    // console.log(`Card: ${card.name}`, `Color difference: ${colorDiff}`)
    if (colorDiff < diffFromBest) {
      bestMatch = card
      diffFromBest = colorDiff
    }
  })
  // console.log(`Best match: ${bestMatch.name}`, `Color difference: ${diffFromBest}`)
  return bestMatch
}

module.exports = getBestColor
