"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { CardProps } from "./types/card"
import { ApiCardProps } from "./types/api"
import { gridConstants } from "./constants/grid"
import { Loading } from "./components/loading"
import getImage from "./functions/getImage"
import getAvgColor from "./functions/getAvgColor"
import getBestColor from "./functions/getBestColor"
import dataset from "./cards/sv3pt5.json"

export default function Home() {

  //Number of cards in the entire grid = size ˆ 2
  //(Because the grid section has the same ratio as the base image, grid-col count = grid-row count)
  // const gridSize = 50
  const [ gridSize, setGridSize ] = useState<25 | 50 | 75 | 100>(50)  //or: <keyof typeof gridConstants>
  const [ grid, setGrid ] = useState<CardProps[]>([])
  const [ isGridLoading, setIsGridLoading ] = useState(false)

  const tcgBack = "https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg"
  const [ baseImage, setBaseImage ] = useState(tcgBack)
  const [ baseImageList, setBaseImageList ] = useState<ApiCardProps[]>([])
  const [ baseImageIndex, setBaseImageIndex ] = useState(-1)
  const [ isBaseImageLoading, setIsBaseImageLoading ] = useState(false)

  //init @ zero, update only if client-side
  const [ zoomLevel, setZoomLevel ] = useState(0)   //will multiply section width by 4 to get size in px
  const [ minZoom, setMinZoom ] = useState(0)
  const [ maxZoom, setMaxZoom ] = useState(0)
  useEffect(() => {
    // window.innerWidth = 640: tailwind's breakpoint for mobile screens
    const zoomMin = window.innerWidth < 640 ? gridConstants[gridSize].screen["mobile"].zoomMin : gridConstants[gridSize].screen["sm"].zoomMin
    const zoomMax = window.innerWidth < 640 ? gridConstants[gridSize].screen["mobile"].zoomMax : gridConstants[gridSize].screen["sm"].zoomMax
    setZoomLevel(zoomMin)
    setMinZoom(zoomMin)
    setMaxZoom(zoomMax)

    makeMosaic()
  }, [gridSize])

  // const cards = [
  //   {id: "134", name: "Vaporeon", avgColor: [108,188,211], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SWSH4/SWSH4_EN_30.png"},
  //   {id: "135", name: "Jolteon",  avgColor: [217,202,124], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV3PT5/SV3PT5_EN_135.png"},
  //   {id: "136", name: "Flareon",  avgColor: [240,112,58],  url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM12/SM12_EN_25.png"},
  //   {id: "196", name: "Espeon",   avgColor: [198,161,190], url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SV03/SV03_EN_86.png"},
  //   {id: "197", name: "Umbreon",  avgColor: [53,75,90],    url: "https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/SM8/SM8_EN_120.png"},
  // ]
  const cards = dataset

  function getBaseImageList(query: string) {
    setIsBaseImageLoading(true)
    if (query == "TCG-back") {
      setBaseImageList([{id: "tcg-back", name: "-", set: { name: "-", series: "-" }, number: "-", image: tcgBack}])
      setBaseImageIndex(-1)
      setIsBaseImageLoading(false)
      return
    }
    axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${query}`).then(response => {
      // console.log(response.data)
      const cards:ApiCardProps[] = []
      response.data.data.map((e: any) => {
        cards.push({
          id: e.id,
          name: e.name,
          set: {
            name: e.set.name,
            series: e.set.series,
          },
          number: e.number,
          image: e.images.small
        })
      })
      setBaseImageList(cards)
      setBaseImageIndex(0)
      setIsBaseImageLoading(false)
    })
  }

  function getBaseImageName() {
    return baseImageIndex == -1 
    ? "TCG - Verso" 
    : `${baseImageList[baseImageIndex].name} (${baseImageList[baseImageIndex].set.series} - ${baseImageList[baseImageIndex].set.name}: #${baseImageList[baseImageIndex].number})`
  }

  async function makeMosaic() {
    setIsGridLoading(true)
    setGrid([]) //reset grid

    const baseImageData = await getImage("https://corsproxy.io/" + baseImage)   //Dev
    // const baseImageData = await getImage(baseImage)    //Prod

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
        const bestMatch = getBestColor(avgColor, cards)
        // console.log(
        //   `Section ${(i+1)+(j*gridSize)}:`,
        //   `x=${Math.trunc(i*sectionWidth)}`,
        //   `y=${Math.trunc(j*sectionHeight)}`,
        //   `avgColor: ${avgColor}`,
        //   `bestMatch: ${bestMatch.avgColor} (${bestMatch.name})`
        // )
        setGrid(prevGrid => {
          return [...prevGrid, bestMatch]
        })
      }
    }
    setIsGridLoading(false)
  }

  //Updates baseImage preview everytime user changes the dropdown selection or picks a new option from the provided list
  useEffect(() => {
    setBaseImage(baseImageIndex == -1 ? tcgBack : baseImageList[baseImageIndex].image)
  }, [baseImageList, baseImageIndex])

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

    //Mosaic grid with images from the db - V3
    // (Will trigger this @ another useEffect, on every gridSize change)
    // (async () => {
      // makeMosaic()
    // })()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <h1>Hello, world!</h1> */}

      {/* Select base image: */}
      <label className="mt-2">
        Selecione uma carta:
        <select 
          className="mx-1"
          onChange={(e) => getBaseImageList(e.target.value)}
        >
          <option value="TCG-back">TCG - Verso</option>
          {
            dataset.map(e => {
              return (
                <option key={e.id} value={e.name}>#{e.id} - {e.name}</option>
              )
            })
          }
        </select>
      </label>

      {/* Slider: */}
      <div className="mt-2 flex flex-row items-center gap-4">
        <button className="text-4xl font-bold disabled:text-gray-400 cursor-pointer disabled:cursor-default" disabled={!(baseImageIndex > 0 && baseImageIndex < baseImageList.length)} onClick={() => {if (baseImageIndex > 0 && baseImageIndex < baseImageList.length) {setBaseImageIndex(baseImageIndex - 1)}}}>{"<"}</button>
        {
          isBaseImageLoading
          ?
            <div className="min-w-40 min-h-56 flex items-center justify-center">
              <Loading />
            </div>
          :
            <img 
              src={baseImage}
              alt={getBaseImageName()}
              title={getBaseImageName()}
              className="w-40 aspect-auto"
            /> 
        }  
        <button className="text-4xl font-bold disabled:text-gray-400 cursor-pointer disabled:cursor-default" disabled={!(baseImageIndex >= 0 && baseImageIndex < baseImageList.length -1)} onClick={() => {if (baseImageIndex >= 0 && baseImageIndex < baseImageList.length -1) {setBaseImageIndex(baseImageIndex + 1)}}}>{">"}</button>
      </div>
      <h1 className="mt-1 mb-2 text-xs italic">{isBaseImageLoading ? "-" : getBaseImageName()}</h1>
      
      <button 
        onClick={() => makeMosaic()}
        // disabled={true}
        //OBS: Visual transformation to simulate a 3D key press:
        //1. Button will have a "margin-top" and a "border-bottom";
        //2. When clicked, shrink "border-bottom" height by half, and lower the button by adding to the "margin-top" this same amount of pixels.
        className={
          `font-bold px-2 py-1 rounded 
          bg-blue-600 hover:bg-blue-700 text-white border-blue-800 cursor-pointer 
          disabled:bg-gray-400 disabled:text-gray-600 disabled:border-gray-500 disabled:cursor-default
           mt-[0px] border-b-[6px]
           disabled:active:mt-[0px] disabled:active:border-b-[6px] 
           active:mt-[3px] active:border-b-[3px]`
        }
      >
        Converter!
      </button>

      {/* Zoom: */}
      <div className="mt-2 flex flex-row items-center gap-4">
        <h1 className="w-12 text-xl">Zoom:</h1>
        <button className="text-2xl font-bold cursor-pointer" onClick={() => {if (zoomLevel > minZoom) {setZoomLevel(zoomLevel - 1)}}}>–</button>
        <input 
          type="range" value={zoomLevel} min={minZoom} max={maxZoom} 
          onChange={(e) => {setZoomLevel(+e.target.value)}}
          className="w-3xs sm:w-md cursor-pointer"
        />
        <button className="text-2xl font-bold cursor-pointer" onClick={() => {if (zoomLevel < maxZoom) {setZoomLevel(zoomLevel + 1)}}}>+</button>
      </div>

      {/* Grid size: */}
      <div className="mt-2 flex flex-row items-center gap-4">
        <h1 className="w-12 text-xl">Grid:</h1>
        <button className="text-2xl font-bold cursor-pointer" onClick={() => {if (gridSize >= 50) {setGridSize(gridSize - 25 as 25 | 50 | 75 | 100)}}}>–</button>
        <input 
          type="range" value={gridSize} min={25} max={100} step={25} 
          onChange={(e) => {setGridSize(+e.target.value as 25 | 50 | 75 | 100)}}
          className="w-3xs sm:w-md cursor-pointer"
        />
        <button className="text-2xl font-bold cursor-pointer" onClick={() => {if (gridSize < 100) {setGridSize(gridSize + 25 as 25 | 50 | 75 | 100)}}}>+</button>
      </div>

      <style>
        {`
          .grid {
            margin-top: 8px;
            overflow: auto;
            /* Desktop: */
            width: calc(${gridSize} * ${gridConstants[gridSize].screen["sm"].cardWidth}px);
            height: calc(${gridSize} * ${gridConstants[gridSize].screen["sm"].cardWidth} * 1.4px);
            /* Mobile: */
            @media only screen and (max-width: 640px) {
              width: calc(${gridSize} * ${gridConstants[gridSize].screen["mobile"].cardWidth}px);
              height: calc(${gridSize} * ${gridConstants[gridSize].screen["mobile"].cardWidth} * 1.4px);
            }
          }
        `}
      </style>

      {/* Grid: */}
      {/* Outer div width: 50 cards of N pixels each (mobile:w-2 (8px)) */}
      {/* Outer div height: 50 cards of 1:1.4 ratio */}
      {/* <div className="mt-2 overflow-auto w-[calc(50*8px)] h-[calc(50*8*1.4px)] sm:w-[calc(50*10px)] sm:h-[calc(50*10*1.4px)]"> */}
      <div 
        // V1: Tailwind:
        // Problem: not responsive
        // className={
        //   `mt-2 overflow-auto 
        //   w-[calc(${gridSize}*${gridConstants[gridSize].screen["mobile"].cardWidth}px)] 
        //   h-[calc(${gridSize}*${gridConstants[gridSize].screen["mobile"].cardWidth}*1.4px)] 
        //   sm:w-[calc(${gridSize}*${gridConstants[gridSize].screen["sm"].cardWidth}px)] 
        //   sm:h-[calc(${gridSize}*${gridConstants[gridSize].screen["sm"].cardWidth}*1.4px)]`
        // }
        // V2: Inline CSS equivalent for the tailwind class above:
        // (could work without the "calc" function (like the grid section style), but both ways strech the grid for a split second before reload because of the async nature of the state)
        // Problem: no inline media queries for diferent screen sizes
        // style={{ 
        //   marginTop: "8px", overflow: "auto",
        //   width: `calc(${gridSize}*${gridConstants[gridSize].screen["sm"].cardWidth}px)`,
        //   height: `calc(${gridSize}*${gridConstants[gridSize].screen["sm"].cardWidth}*1.4px)`
        // }}
        // V3: <style> tag with { template string } inside JSX:
        className="grid"
      >
        {
          isGridLoading
          ?
            <Loading />
          :
            <div 
              // className={
              //   `grid grid-cols-50 min-w-max
              //   zbg-cover zbg-[url('https://i.ebayimg.com/images/g/evMAAOSwlRZflJ-g/s-l400.jpg')]`
              // }
              style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, minWidth: "max-content" }}  //CSS equivalent for the tailwind class above
            >
              {
                grid.map((e, i) => {
                  return (
                    <img 
                      key={i}
                      src={e.url}
                      alt={e.name}
                      title={e.name}
                      // className="w-5 aspect-auto opacity-100"
                      style={{ width: `${zoomLevel * 4}px` }} //CSS equivalent for the tailwind class above
                    />
                  )
                })
              }
            </div>
        }
      </div>
    </div>
  )
}
