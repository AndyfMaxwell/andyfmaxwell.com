import type { Metadata } from "next";
import { Fugaz_One, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import SubscribeButton from "./components/subscribe";

export const metadata: Metadata = {
  title: "AndyfMaxwell.com",
  description: "Blog & Personal Website of Andrew Maxwell",
};

const fugazOne = Fugaz_One({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="nav-item"></div>
          <div className="nav-item">
            <Link href={"/"} className={`${fugazOne.className} homelink`}>AndyfMaxwell.com</Link>
          </div>
          <div className="nav-item">
            <SubscribeButton />
          </div>
        </nav>
        {children}
        <footer>
          <p className={inter.className}>© 2026 Andrew Maxwell. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
