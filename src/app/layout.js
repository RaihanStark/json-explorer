import { Inter } from "next/font/google";
import Provider from "./provider";
import "./globals.css";
import "react-datetime/css/react-datetime.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "JSON Explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
