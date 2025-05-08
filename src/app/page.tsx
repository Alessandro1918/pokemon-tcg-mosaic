"use client"
import { useState, useEffect } from "react"
const getPixels = require("get-pixels")

type CardProp = {
  deck: string,
  name: string,
  url: string
}

export default function Home() {

  const [ cards, setCards ] = useState<CardProp[]>([])

  const db = [
    {deck: "SV3PT5", name: "Eevee", url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_133.png"},
    {deck: "SV3PT5", name: "Jolteon", url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_135.png"},
    {deck: "SM12", name: "Flareon", url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM12/SM12_EN_25.png"},
    {deck: "SWSH4", name: "Vaporeon", url: "https://assets.pokemon.com/static-assets/content-assets/cms2-pt-br/img/cards/web/SWSH4/SWSH4_PT-BR_30.png"},
    {deck: "SM8", name: "Umbreon", url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM8/SM8_EN_120.png"},
    {deck: "SV03", name: "Espeon", url: "https://assets.pokemon.com/static-assets/content-assets/cms2-pt-br/img/cards/web/SV03/SV03_PT-BR_86.png"}
  ]

  useEffect(() => {
    //Init grid - V1
    // setCards([db[1], db[2], db[3], db[4], db[5], db[1], db[2], db[3], db[4]]) // 9 items total, grid with 3 collumns, rows = 3 

    //Init grid - V2
    for (let i = 1; i < 26; i++) {
      setTimeout(() => {
        // console.log(cards.length % 5 + 1) //1, 1, 1, 1, 1, 1, 1, ... x N
        // setCards([...cards, db[cards.length % 5 + 1]])
        setCards(prevCards => {
          console.log(prevCards.length % 5 + 1) //1, 2, 3, 4, 5, 1, 2, ...
          return [...prevCards, db[prevCards.length % 5 + 1]];
        })
      }, i * 500)
    }

    (async () => {
      const data = await getImage("https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80MmJlZjI1ODU5ZWY1OTIyODUzYThmMmE3YzdhNGNlZj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.JTCwo1QFSJOROohvVLUAdrY_1A3z0vvpZJUB6gP-qh0")

      const n = 5 //400 images total? SqRt(400) = 20; and width * height = total
      const sectionWidth = data.shape[0]/n
      const sectionHeight = data.shape[0]/n

      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          console.log(`x=${i*sectionWidth}, y=${j*sectionHeight}, avgColor=${getSectionAvgColor(data.pixels, data.shape[0], i*sectionWidth, j*sectionHeight, sectionWidth, sectionHeight)}`)
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

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Hello, world!</h1>
      <div className={`
        grid grid-cols-5
        zgap-[4px] zbg-cover zbg-[url('https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_133.png')]
      `}>
        {
          cards.map((card, i) => {
            return (
              <img 
                key={i}
                src={card.url}
                className="w-24 aspect-auto opacity-100"
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
