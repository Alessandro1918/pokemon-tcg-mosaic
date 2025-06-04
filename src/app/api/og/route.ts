import { NextResponse } from "next/server"
import { createCanvas, loadImage } from "canvas"
import getAvgColor from "../../functions/getAvgColor"
import getBestColor from "../../functions/getBestColor"
import dataset from "../../cards/eevolutions.json"

export async function GET() {

  const img = await loadImage("https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg")

  //Init grid & canvas
  const gridSize = 20
  const gridWidth = 1.5 * img.width //px
  const gridHeight = 1.5 * img.height //px
  const sectionWidth = Math.floor(gridWidth / gridSize)
  const sectionHeight = Math.floor(gridHeight / gridSize)
  const canvas = createCanvas(gridWidth, gridHeight)
  const ctx = canvas.getContext("2d")

  //Get pixel data from target image
  //V1: npm package "get-pixels"
  // const imgData = await getImage("someURL")
  //V2: from canvas
  ctx.drawImage(img, 0, 0, gridWidth, gridHeight)
  const imgData = ctx.getImageData(0, 0, gridWidth, gridHeight).data
  ctx.clearRect(0, 0, gridWidth, gridHeight)

  for (let j=0; j<gridSize; j++) {
    for (let i=0; i<gridSize; i++) {
      // const img = await loadImage(dataset[i+gridSize*j].url)
      const avgColor = getAvgColor(
        imgData, 
        gridWidth, 
        Math.trunc(i*sectionWidth), 
        Math.trunc(j*sectionHeight), 
        Math.trunc(sectionWidth), 
        Math.trunc(sectionHeight)
      )
      const bestMatch = getBestColor(avgColor, dataset)
      // console.log(
      //   `Section: ${i+gridSize*j} - `,
      //   `x: ${i*sectionWidth}, y: ${j*sectionHeight}`,
      //   `avgColor: ${avgColor} - `,
      //   `bestMatch: ${bestMatch.name} [${bestMatch.avgColor}]`
      // )
      const img = await loadImage(bestMatch.url)
      ctx.drawImage(img, i*sectionWidth, j*sectionHeight, sectionWidth, sectionHeight)
    }
  }

  const buffer = canvas.toBuffer("image/png")

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length.toString(),
    },
  })
}
