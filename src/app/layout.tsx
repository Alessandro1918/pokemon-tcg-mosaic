import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokemon TCG Mosaic",
  description: "https://github.com/Alessandro1918/pokemon-tcg-mosaic",
  // metadataBase: new URL('https://pokemon-tcg-mosaic.vercel.app'),
  openGraph: {
    title: "Pokemon TCG Mosaic",
    description: "https://github.com/Alessandro1918/pokemon-tcg-mosaic",
    images: [{
      url: "/assets/og-image.jpg",  //relative to "/public"
    }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
