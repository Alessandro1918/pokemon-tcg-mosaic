import { NextResponse } from "next/server"
import { createCanvas, Image, loadImage } from "canvas"
import { getImageV2 } from "../../functions/getImage"
import getAvgColor from "../../functions/getAvgColor"
import getBestColor from "../../functions/getBestColor"
import dataset from "../../cards/eevolutions.json"

export async function GET() {

  const startTime = Date.now()

  const url = "https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg"

  const baseImg = await getImageV2(url, 1.5)

  const gridSize = 15               //Number of cards in the entire grid = size ˆ 2
  const gridWidth = baseImg.width   //px
  const gridHeight = baseImg.height //px
  const sectionWidth = Math.floor(gridWidth / gridSize)
  const sectionHeight = Math.floor(gridHeight / gridSize)
  const canvas = createCanvas(gridWidth, gridHeight)
  const ctx = canvas.getContext("2d")
  const imageLoadTasks: Promise<{
    img: Image,
    i: number,
    j: number,
    avgColor: number[],
    bestMatch: typeof dataset[number],
    loadTime: number,
  }>[] = []

  for (let j=0; j<gridSize; j++) {
    for (let i=0; i<gridSize; i++) {
      //V0:
      // const img = await loadImage(dataset[i+gridSize*j].url)
      // ctx.drawImage(img, i*sectionWidth, j*sectionHeight, sectionWidth, sectionHeight)

      //Base for V1, V2:
      const avgColor = getAvgColor(
        baseImg.data, 
        gridWidth, 
        Math.trunc(i*sectionWidth), 
        Math.trunc(j*sectionHeight), 
        Math.trunc(sectionWidth), 
        Math.trunc(sectionHeight)
      )
      const bestMatch = getBestColor(avgColor, dataset)

      //V1 - Serial
      // const startTime = Date.now()
      // const bestImg = await loadImage(bestMatch.url)
      // const endTime = Date.now()
      // ctx.drawImage(bestImg, i*sectionWidth, j*sectionHeight, sectionWidth, sectionHeight)
      // console.log(
      //   `Section: ${i+gridSize*j} - `,
      //   `x: ${i*sectionWidth}, y: ${j*sectionHeight}`.padEnd(15),
      //   `avgColor: ${avgColor}`.padEnd(22),
      //   `bestMatch: ${bestMatch.name} [${bestMatch.avgColor}]`.padEnd(35),
      //   `Loading time: ${endTime - startTime} ms`
      // )

      //V2: Parallel
      const loadTask = (async () => {
        const startTime = Date.now()
        const img = await loadImage(bestMatch.url)
        const endTime = Date.now()
        return { 
          img, i, j, avgColor, bestMatch, loadTime: endTime - startTime,
        }
      })()
      imageLoadTasks.push(loadTask) 
    }
  }

  //V2 - part 2
  const tasks = await Promise.all(imageLoadTasks)
  for (const { img, i, j, avgColor, bestMatch, loadTime } of tasks) {
    ctx.drawImage(img, i*sectionWidth, j*sectionHeight, sectionWidth, sectionHeight)
    // console.log(
    //   `Section: ${i + gridSize * j} - `,
    //   `x: ${i * sectionWidth}, y: ${j * sectionHeight}`.padEnd(15),
    //   `avgColor: ${avgColor}`.padEnd(22),
    //   `bestMatch: ${bestMatch.name} [${bestMatch.avgColor}]`.padEnd(35),
    //   `Loading time: ${loadTime} ms`
    // )
  }

  const buffer = canvas.toBuffer("image/png")

  const endTime = Date.now()
  console.log(`Loading time: ${(endTime - startTime) / 1000} s`)

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length.toString(),
      "loading-time": `${(endTime - startTime) / 1000} s`
    },
  })
}
