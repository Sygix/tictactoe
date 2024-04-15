import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multiplayer TicTacToe",
  description: "Game developed by Sygix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'relative bg-neutral-900 text-white min-h-screen flex flex-col')}>
        <header className="flex justify-center items-center p-4">
          <p>TicTacToe</p>
        </header>
        <main className="flex flex-col flex-auto items-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
