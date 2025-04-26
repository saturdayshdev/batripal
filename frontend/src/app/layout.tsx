import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Batripal - Post-Bariatric Surgery AI Support",
  description:
    "Voice AI assistant for post-bariatric surgery support and guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col w-full max-w-[430px] h-screen max-h-[850px] bg-white overflow-hidden relative mx-auto shadow-[0_0_20px_rgba(0,0,0,0.1)]`}
      >
        {children}
      </body>
    </html>
  );
}
