import type { Metadata } from "next";
import { Space_Grotesk, Righteous } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "EurekaHacks — The Descent",
  description:
    "Apply to EurekaHacks: a hackathon application that sinks with you, from the sunlit surface down to the trench.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${righteous.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-hadal-950 text-white">
        {children}
      </body>
    </html>
  );
}
