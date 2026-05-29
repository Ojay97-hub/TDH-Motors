import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en" data-scroll-behavior="smooth" className={barlow.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        {children}
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </body>
    </html>
  );
}
