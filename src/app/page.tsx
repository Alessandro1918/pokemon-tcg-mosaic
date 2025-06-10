import type { Metadata } from "next"
import Home from "./home"

type Props = {
  // params: Promise<{ id: string }>,                             //dynamic route parameters ("/shop/1" => { slug: '1'})
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> //search params ("/shop?a=1" => { a: '1' })
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { name, set, number } = await searchParams
  return {
    title: "Pokemon TCG Mosaic",
    description: "https://github.com/Alessandro1918/pokemon-tcg-mosaic",
    // metadataBase: new URL('https://pokemon-tcg-mosaic.vercel.app'),
    openGraph: {
      title: "Pokemon TCG Mosaic",
      description: "https://github.com/Alessandro1918/pokemon-tcg-mosaic",
      images: [{
        // url: "/assets/og-image.jpg",  //relative to "/public"
        // url: "/api/og",
        url: `/api/og?name=${name}&set=${set}&number=${number}`
      }],
    }
  }
}

export default function Page({ searchParams }: Props) {
  return <Home />
}