import { NextResponse } from "next/server"
import { createCanvas, loadImage } from "canvas"
import { getImageV2 } from "../../functions/getImage"
import getAvgColor from "../../functions/getAvgColor"
import getBestColor from "../../functions/getBestColor"
import dataset from "../../cards/sv3pt5.json"

export async function GET() {

  const url = "https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg"

  const baseImg = await getImageV2(url, 1.5)

  const gridSize = 15               //Number of cards in the entire grid = size ˆ 2
  const gridWidth = baseImg.width   //px
  const gridHeight = baseImg.height //px
  const sectionWidth = Math.floor(gridWidth / gridSize)
  const sectionHeight = Math.floor(gridHeight / gridSize)
  const canvas = createCanvas(gridWidth, gridHeight)
  const ctx = canvas.getContext("2d")

  for (let j=0; j<gridSize; j++) {
    for (let i=0; i<gridSize; i++) {
      // const img = await loadImage(dataset[i+gridSize*j].url)
      const avgColor = getAvgColor(
        baseImg.data, 
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
      const bestImg = await loadImage(bestMatch.url)
      ctx.drawImage(bestImg, i*sectionWidth, j*sectionHeight, sectionWidth, sectionHeight)
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
