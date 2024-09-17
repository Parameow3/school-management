
import { Inter } from "next/font/google";
import "../../globals.css"; // Adjusted the path to reflect the correct location
import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });
export const metadata :Metadata ={
  title:"AAA Dashboard",
  description:"AAA is Internaion school where providing a skill with robotic, codind",
  icons:"/AAA logo.png"
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Dashboard>{children}</Dashboard>
      </body>
    </html>
  );
}