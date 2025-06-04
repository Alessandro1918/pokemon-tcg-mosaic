import { NextResponse } from "next/server"
import { createCanvas, loadImage } from "canvas"
import getImage from "../../functions/getImage"
import getAvgColor from "../../functions/getAvgColor"
import dataset from "../../cards/eevolutions.json"

export async function GET() {

  const gridSize = 3
  const gridWidth = 512 //px
  const gridHeight = Math.floor(gridWidth * 1.4) //px
  const sectionWidth = Math.floor(gridWidth / gridSize)
  const sectionHeight = Math.floor(gridHeight / gridSize)

  const canvas = createCanvas(gridWidth, gridHeight)
  const ctx = canvas.getContext("2d")

  for (let j=0; j<gridSize; j++) {
    for (let i=0; i<gridSize; i++) {
      const img = await loadImage(dataset[i+gridSize*j].url)
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
