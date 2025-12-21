import type { Metadata } from "next";
import "./globals.css";
import { MenuIcon } from "lucide-react";
import { Suspense } from "react";
import Link from 'next/link'

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: {
    template: "%s | NextFasterAnalytics",
    default: "NextFasterAnalytics",
  },
  description: "A performant analytics site built with Next.js",
};

export const revalidate = 86400; // One day

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex flex-col overflow-y-auto overflow-x-hidden antialiased`}
      >
        <div>
          <header className="fixed top-0 z-10 flex h-[90px] w-[100vw] flex-grow items-center justify-between border-b-2 border-accent2 bg-background p-2 pb-[4px] pt-2 sm:h-[70px] sm:flex-row sm:gap-4 sm:p-4 sm:pb-[4px] sm:pt-0">
            <div className="flex flex-grow flex-col">
              <div className="absolute right-2 top-2 flex justify-end pt-2 font-sans text-sm hover:underline sm:relative sm:right-0 sm:top-0">
                <Suspense
                  fallback={
                    <button className="flex flex-row items-center gap-1">
                      <div className="h-[20px]" />
                      <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]">
                        <polygon points="0,0 5,6 10,0"></polygon>
                      </svg>
                    </button>
                  }
                >
                </Suspense>
              </div>
              <div className="flex w-full flex-col items-start justify-start sm:w-auto sm:flex-row sm:items-center sm:gap-2">
                <Link
                  prefetch={true}
                  href="/"
                  className="text-4xl font-bold text-accent1 text-blue-700"
                >
                  NextFasterPostgres
                </Link>
              </div>
            </div>
          </header>
          <div className="pt-[85px] sm:pt-[70px]">{children}</div>
        </div>
        <footer className="fixed bottom-0 flex h-12 w-screen flex-col items-center justify-between space-y-2 border-t border-gray-400 bg-background px-4 font-sans text-[11px] sm:h-6 sm:flex-row sm:space-y-0">
          <div className="flex flex-wrap justify-center space-x-2 pt-2 sm:justify-start">
            <span className="hover:bg-accent2 hover:underline">Home</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">FAQ</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">Returns</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">Careers</span>
            <span>|</span>
            <span className="hover:bg-accent2 hover:underline">Contact</span>
          </div>
          <div className="text-center sm:text-right">
            By using this website, you agree to check out the{" "}
            <Link
              href="https://github.com/ethanniser/NextFaster"
              className="font-bold text-accent1 hover:underline"
              target="_blank"
            >
              Source Code
            </Link>
          </div>
        </footer>
        {/* does putting this in suspense do anything? */}
        {/* <Suspense fallback={null}> */}
        {/*   <Toaster closeButton /> */}
        {/*   <WelcomeToast /> */}
        {/* </Suspense> */}
      </body>
    </html>
  );
}
