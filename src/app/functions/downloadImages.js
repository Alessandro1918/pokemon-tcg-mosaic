//Reads a json file with a list of image urls, download all the images to the "assets" folder.
//usage: cd src/app/functions && node downloadImages.js ../sets/sv3pt5.json

const fs = require("fs")
const https = require("https")

const inputFilename = process.argv[2]  //"../sets/sv3pt5.json"
const outputDir = `../../../public/assets/${inputFilename.split("/")[2].split(".")[0]}` //"../../../public/assets/sv3pt5"

const fileData = fs.readFileSync(inputFilename, { encoding: "utf8", flag: "r" })

const jsonData = JSON.parse(fileData)

fs.mkdirSync(outputDir, { recursive: true })

jsonData.cards.map(e => {
  console.log(`${e.id}: ${e.name}`)
  const filename = outputDir + "/" + e.id + ".png"
  https.get(e.url, (res) => {
    res.pipe(fs.createWriteStream(filename))
  })
})
