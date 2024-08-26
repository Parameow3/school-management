import { Inter } from "next/font/google";
import "../../globals.css"; // Adjusted the path to reflect the correct location
import Dashboard from "../../../components/Dashboard";
const inter = Inter({ subsets: ["latin"] });
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
