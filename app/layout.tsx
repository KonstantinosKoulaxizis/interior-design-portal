import type { Metadata } from "next";
import { Manrope, Noto_Serif_Display } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import "./globals.css";

// Both families ship a native Greek design, so Greek text never falls back to a system font.
const display = Noto_Serif_Display({
  variable: "--font-display",
  subsets: ["greek", "latin"],
  weight: ["200", "300", "400", "500"],
  style: ["normal", "italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["greek", "latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Maria Michalakakou | Σχεδιασμός Εσωτερικών Χώρων",
  description:
    "Ολοκληρωμένος σχεδιασμός εσωτερικών χώρων υψηλής αισθητικής. Ζήστε τους χώρους μας σε 3D και εικονική περιήγηση 360°.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="grain min-h-screen bg-ink text-ivory">
        <SmoothScroll>
          <Preloader />
          <Cursor />
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
