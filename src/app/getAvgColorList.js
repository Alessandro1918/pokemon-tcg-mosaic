//Reads a json file with a list of image urls, writes a json file with the each image respective average color.
//usage: cd src/app && node getAvgColorList.js sets/sv3pt5.json

const fs = require("fs")
const getImage = require("./getImage")
const getAvgColor = require("./getAvgColor")

const inputFilename = process.argv[2]  //"sets/sv3pt5.json"
const outputFilename = `./cards/${inputFilename.split("/")[1].split(".")[0]}.json` //"./cards/sv3pt5.json"

const fileData = fs.readFileSync(inputFilename, { encoding: "utf8", flag: "r" })

const jsonData = JSON.parse(fileData)

const promises = jsonData.cards.map(card => {
  return getImage(card.url).then(imageData => {
    const avgColor = getAvgColor(
      imageData.pixels,
      imageData.shape[0],
      0,
      0,
      imageData.shape[0],
      imageData.shape[1]
    )
    console.log(`${card.name}: ${avgColor}`)
    return {...card, avgColor: avgColor}
  })
})

Promise.all(promises).then(cards => {
  let outputData = JSON.stringify(cards, null, 2)

  fs.writeFileSync(outputFilename, outputData)
})
