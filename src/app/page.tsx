"use client"
import { useState, useEffect } from "react"
const getPixels = require("get-pixels")

type CardProp = {
  deck: string,
  name: string,
  avgColor: number[],
  url: string
}

export default function Home() {

  const [ cards, setCards ] = useState<CardProp[]>([])

  const n = 11*11 //number of cards in the entire grid

  // const smImg = "https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80MmJlZjI1ODU5ZWY1OTIyODUzYThmMmE3YzdhNGNlZj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.JTCwo1QFSJOROohvVLUAdrY_1A3z0vvpZJUB6gP-qh0"
  // const eevee = "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_133.png"
  // const tcgBack = "https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg"
  
  const db = [
    {deck: "SV3PT5", name: "Jolteon",  avgColor: [217,202,124], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_135.png"},
    {deck: "SM12",   name: "Flareon",  avgColor: [240,112,58],  url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM12/SM12_EN_25.png"},
    {deck: "SWSH4",  name: "Vaporeon", avgColor: [108,188,211], url: "https://assets.pokemon.com/static-assets/content-assets/cms2-pt-br/img/cards/web/SWSH4/SWSH4_PT-BR_30.png"},
    {deck: "SM8",    name: "Umbreon",  avgColor: [53,75,90],    url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM8/SM8_EN_120.png"},
    {deck: "SV03",   name: "Espeon",   avgColor: [198,161,190], url: "https://assets.pokemon.com/static-assets/content-assets/cms2-pt-br/img/cards/web/SV03/SV03_PT-BR_86.png"}
  ]

  useEffect(() => {
    //Init grid - V1
    // setCards([db[1], db[2], db[3], db[4], db[5], db[1], db[2], db[3], db[4]]) // 9 items total, grid with 3 collumns, rows = 3 

    //Init grid - V2
    // for (let i = 0; i < n; i++) {
    //   setTimeout(() => {
    //     // console.log(cards.length % 5) //0, 0, 0, 0, 0, 0, 0, ... x infinite
    //     // setCards([...cards, db[cards.length % 5]])
    //     setCards(prevCards => {
    //       // console.log(prevCards.length % 5) //0, 1, 2, 3, 4, 0, 1, 2, ...
    //       return [...prevCards, db[prevCards.length % 5]];
    //     })
    //   }, i * 250)
    // }

    (async () => {
      const baseImageData = await getImage("https://corsproxy.io/" + "https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg")

      //Split the base image in small image sections
      const sqrt = Math.sqrt(n) //400 images total? SqRt(400) = 20; and width * height = total
      const sectionWidth = baseImageData.shape[0]/sqrt
      const sectionHeight = baseImageData.shape[1]/sqrt

      for (let j = 0; j < sqrt; j++) {
        for (let i = 0; i < sqrt; i++) {
          const avgColor = getSectionAvgColor(
            baseImageData.pixels, baseImageData.shape[0], 
            Math.trunc(i*sectionWidth), Math.trunc(j*sectionHeight), 
            Math.trunc(sectionWidth), Math.trunc(sectionHeight))
          const bestMatch = getBestColorFromDb(avgColor)
          console.log(
            `Section ${(i+1)+(j*sqrt)}:`,
            `x=${Math.trunc(i*sectionWidth)}`,
            `y=${Math.trunc(j*sectionHeight)}`,
            `avgColor: ${avgColor}`,
            `bestMatch: ${bestMatch.avgColor} (${bestMatch.name})`)
            setCards(prevCards => {
              return [...prevCards, bestMatch];
            })
        }
      }
    })()
  }, [])

  //For a 16x16 image (for ex.), returns a 40.000 1D-array of pixels data (16 * 16 * 4 channels) in raster order.
  //Shape:
  //[16, 16, 4]: width, height, channels
  //Pixels:
  //[1, 124, 48, 255, 1, 124, 48, 255, ...]
  // R,  G,  B,  a,   R,  G,  B,  a, ...
  //|<-  Pixel #1  ->|<- Pixel #2 ->|
  function getImage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      getPixels(url, function(err: any, pixels: any) {
        if (err) {
          console.log("Bad image path")
          reject(err)
        } else {
          console.log("Got pixels:", pixels.shape.slice(), pixels.data)
          resolve({shape: pixels.shape.slice(), pixels: pixels.data})
        }
      })
    })
  }

  function sort(arr: number[]) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < (arr.length - i - 1); j++) {
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
  }

  //For a split section of an entire image, get the avarage color of that section.
  //  ----> "x" axys
  //  |
  //  V     "y" axys
  function getSectionAvgColor(pixels: number[], imageWidth: number, x: number, y: number, width: number, height: number) {
    const avg = [0, 0, 0] //R, G, B
    //V1 - Medium value: [..., 27, 28, 29, ...]: array of values of a single channel in asc order. Get the middle element (in the ex., "28")
    for (let channel = 0; channel < 3; channel++) {
      const section:number[] = []
      for (let j = y; j < y+height; j++) {
        for (let i = x; i < x+width; i++) {
          // console.log("i:", i, "j:", j, "index:", ((i*4) + j*imageWidth*4) + channel, "value:", pixels[((i*4) + j*imageWidth) + channel])
          section.push(pixels[((i*4) + j*imageWidth*4) + channel])
        }
      }
      sort(section)
      // console.log(section)
      avg[channel] = section[section.length / 2]
    }
    // console.log(avg)
    return avg
  }

  //For 2 given colors ([r, g, b], [...]), get their difference, from 0 (equal) to 1 (black to white).
  function getColorDifference(color1: number[], color2: number[]) {
    //V1 - Euclidian distance in the RGB 3-axys spaces:
    return (
      Math.abs(color1[0] - color2[0]) / 255 / 3 +
      Math.abs(color1[1] - color2[1]) / 255 / 3 +
      Math.abs(color1[2] - color2[2]) / 255 / 3
    )
  }

  //For a given RBG color, returns the option with the most similar color from the list of cards.
  function getBestColorFromDb(color: number[]) {
    var bestMatch = db[0]
    var diffFromBest = 1
    db.map(card => {
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

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Hello, world!</h1>
      <div className={`
        grid grid-cols-11
        zgap-[4px] bg-cover bg-[url('https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg')]
      `}>
        {
          cards.map((card, i) => {
            return (
              <img 
                key={i}
                src={card.url}
                className="w-10 aspect-auto opacity-70"
                alt={`${card.deck} - ${card.name}`}
                title={`${card.deck} - ${card.name}`}
              />
            )
          })
        }
      </div>
    </div>
  )
}
