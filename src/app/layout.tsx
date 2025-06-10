// import type { Metadata } from "next"
import "./globals.css"

//Icons: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png

//Using "generateMetadata" (from a server component) instead of "metadata" (from a static file)  
// export const metadata: Metadata = {
//   //...
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
