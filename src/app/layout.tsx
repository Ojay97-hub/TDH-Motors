import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
    description:
      "Hand-picked performance and luxury cars in the Chilterns.",
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
    <html lang="en" data-scroll-behavior="smooth" className={nunito.variable}>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
