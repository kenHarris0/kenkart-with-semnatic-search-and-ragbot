import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Context from "@/context/context";


const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ken kart",
  description: "an ecom app",
};

export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  


  return (
    <ClerkProvider>
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable)}
    >
      
      <body className={`h-screen w-[80%] mx-auto `}>
        <Context>
        <Navbar />
        
        {children}
         </Context>
        </body>
       
    </html>
    </ClerkProvider>
  );
}
