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

  //size ˆ 2 = number of cards in the entire grid
  //(Because the grid section has the same ratio as the base image, grid-col count = grid-row count)
  const gridSize = 50

  //zoom init @ zero, update only if client-side
  const [ zoomLevel, setZoomLevel ] = useState(0)
  const [ minZoom, setMinZoom ] = useState(0)
  const [ maxZoom, setMaxZoom ] = useState(0)
  useEffect(() => {
    const zoomMin = window.innerWidth < 640 ? 2 : 5       //mobile:w-2 (8px), sm:w-5 (20px)
    const zoomMax = window.innerWidth < 640 ? 100 : 250   //?
    setZoomLevel(zoomMin)
    setMinZoom(zoomMin)
    setMaxZoom(zoomMax)
  }, [])

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
    //       return [...prevGrid, cards[prevGrid.length % 5]]
    //     })
    //   }, i * 250)
    // }

    (async () => {
      const baseImage = tcgBack
      // const baseImageData = await getImage("https://corsproxy.io/" + baseImage)
      const baseImageData = await getImage(baseImage)

      //Split the base image in small image sections
      const sectionWidth = baseImageData.shape[0]/gridSize
      const sectionHeight = baseImageData.shape[1]/gridSize

      for (let j = 0; j < gridSize; j++) {
        for (let i = 0; i < gridSize; i++) {
          const avgColor = getAvgColor(
            baseImageData.pixels, 
            baseImageData.shape[0], 
            Math.trunc(i*sectionWidth), 
            Math.trunc(j*sectionHeight), 
            Math.trunc(sectionWidth), 
            Math.trunc(sectionHeight)
          )
          const bestMatch = getBestColorFromDb(avgColor)
          console.log(
            `Section ${(i+1)+(j*gridSize)}:`,
            `x=${Math.trunc(i*sectionWidth)}`,
            `y=${Math.trunc(j*sectionHeight)}`,
            `avgColor: ${avgColor}`,
            `bestMatch: ${bestMatch.avgColor} (${bestMatch.name})`
          )
          setGrid(prevGrid => {
            return [...prevGrid, bestMatch]
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

      {/* Zoom Component: */}
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-xl">Zoom:</h1>
        <button className="text-2xl font-bold cursor-pointer" onClick={() => {if (zoomLevel > minZoom) {setZoomLevel(zoomLevel - 1)}}}>–</button>
        <input 
          type="range" value={zoomLevel} min={minZoom} max={maxZoom} 
          onChange={(e) => {setZoomLevel(+e.target.value)}}
          className="w-3xs sm:w-md cursor-pointer"
        />
        <button className="text-2xl font-bold cursor-pointer" onClick={() => {if (zoomLevel < maxZoom) {setZoomLevel(zoomLevel + 1)}}}>+</button>
      </div>

      {/* Outer div width: 50 cards of N pixels each (mobile:w-2 (8px), sm:w-5 (20px)) */}
      {/* Outer div height: 50 cards of 1:1.4 ratio */}
      <div className="overflow-auto w-[calc(50*8px)] h-[calc(50*8*1.4px)] sm:w-[calc(50*20px)] sm:h-[calc(50*20*1.4px)]">
        <div className={` 
          grid grid-cols-50 min-w-max
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
                  // className="w-5 aspect-auto opacity-100"
                  style={{ width: `${zoomLevel * 4}px` }} //bypass Tailwind’s width utilities and instead uses CSS inline style
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
