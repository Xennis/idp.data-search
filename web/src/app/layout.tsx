import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {HeaderBar} from "@/components/layout/headerBar";
import {Footer} from "@/components/layout/footer";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "idp.data-search",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
        <body suppressHydrationWarning>
        <HeaderBar />
        {children}
        <Footer />
        </body>
        </html>
    );
}
