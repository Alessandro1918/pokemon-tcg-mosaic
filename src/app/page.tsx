"use client"
import { useState, useEffect } from "react"

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
    // setCards([db[1], db[2], db[3], db[4], db[5], db[1], db[2], db[3], db[4]]) // 9 items / 3 collumns = 3 rows

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
  }, [])

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
