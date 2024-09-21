import type { Metadata } from "next";

import candybeans from "next/font/local"

import "./globals.css";
import Providers from "@/utils/Providers"

const font = candybeans({ src: "./fonts/candy-beans.otf" })

export const metadata: Metadata = {
  title: "TRYAN NFTs",
  description: "Official $TRYAN NFT collection.",
  openGraph: {
    title: "TRYAN NFTs",
  description: "Official $TRYAN NFT collection.",
    url: 'https://get.richordietryan.club',
    siteName: 'TRYAN NFTs',
    images: [
      {
        url: 'https://tacotribe.s3.ap-south-1.amazonaws.com/misc/Thumbnail.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://tacotribe.s3.ap-south-1.amazonaws.com/misc/Thumbnail.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
      },
    ]
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
        className={`${font.className} antialiased`}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
