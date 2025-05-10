"use client"
import { useState, useEffect } from "react"
// const fs = require("fs")
import getImage from "./getImage"
import getAvgColor from "./getAvgColor"
import dataset from "./cards/sv3pt5.json"

type CardProp = {
  id: string,
  name: string,
  avgColor: number[],
  url: string
}

export default function Home() {

  const [ grid, setGrid ] = useState<CardProp[]>([])

  const n = 50*50 //number of cards in the entire grid

  const tcgBack = "https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg"
  
  // const cards = [
  //   {id: "134", name: "Vaporeon", avgColor: [108,188,211], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH4/SWSH4_EN_30.png"},
  //   {id: "135", name: "Jolteon",  avgColor: [217,202,124], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_135.png"},
  //   {id: "136", name: "Flareon",  avgColor: [240,112,58],  url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM12/SM12_EN_25.png"},
  //   {id: "196", name: "Espeon",   avgColor: [198,161,190], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV03/SV03_EN_86.png"},
  //   {id: "197", name: "Umbreon",  avgColor: [53,75,90],    url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM8/SM8_EN_120.png"},
  // ]
  const cards = dataset

  useEffect(() => {
    //Init grid - V1
    // setGrid([cards[1], cards[2], cards[3], cards[4], cards[5], cards[1], cards[2], cards[3], cards[4]]) // 9 items total, grid with 3 collumns, rows = 3 

    //Init grid - V2
    // for (let i = 0; i < n; i++) {
    //   setTimeout(() => {
    //     // console.log(grid.length % 5) //0, 0, 0, 0, 0, 0, 0, ... x infinite
    //     // setGrid([...grid, cards[grid.length % 5]])
    //     setGrid(prevGrid => {
    //       // console.log(prevGrid.length % 5) //0, 1, 2, 3, 4, 0, 1, 2, ...
    //       return [...prevGrid, cards[prevGrid.length % 5]];
    //     })
    //   }, i * 250)
    // }

    (async () => {
      // const baseImageData = await getImage("https://corsproxy.io/" + tcgBack)
      const baseImageData = await getImage(tcgBack)

      //Split the base image in small image sections
      const sqrt = Math.sqrt(n) //400 images total? SqRt(400) = 20; and width * height = total
      const sectionWidth = baseImageData.shape[0]/sqrt
      const sectionHeight = baseImageData.shape[1]/sqrt

      for (let j = 0; j < sqrt; j++) {
        for (let i = 0; i < sqrt; i++) {
          const avgColor = getAvgColor(
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
            setGrid(prevGrid => {
              return [...prevGrid, bestMatch];
            })
        }
      }
    })()
  }, [])

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

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <h1>Hello, world!</h1> */}
      {/* Mobile zoom/scroll works with any width, desktops need this sm:w-max.
      Issue: at 200% zoom on desktop, the breakpoint changes to mobile, and I lose the zoom/scroll feat. */}
      <div className={`
        sm:w-max
        grid grid-cols-50 
        zbg-cover zbg-[url('https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg')]
      `}>
        {
          grid.map((e, i) => {
            return (
              <img 
                key={i}
                src={e.url}
                alt={e.name}
                title={e.name}
                className="w-5 aspect-auto opacity-100"
              />
            )
          })
        }
      </div>
    </div>
  )
}
