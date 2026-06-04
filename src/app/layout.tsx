import type { Metadata } from "next";
import { Barlow, Outfit } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TDH Motors — Performance Cars in the Chilterns",
    template: "%s | TDH Motors",
  },
  description:
    "Hand-picked performance and luxury cars in the Chilterns. Porsche, BMW, Mercedes, Audi, Bentley and more — sourced for enthusiasts, by enthusiasts.",
  keywords: [
    "performance cars",
    "luxury cars",
    "car dealer Chilterns",
    "Aylesbury car dealer",
    "Porsche dealer",
    "TDH Motors",
  ],
  openGraph: {
    title: "TDH Motors — Performance Cars in the Chilterns",
    description: "Hand-picked performance and luxury cars in the Chilterns.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" className={`${barlow.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
