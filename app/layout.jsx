import "./globals.css";
import { Battambang } from "next/font/google";

const battambang = Battambang({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700", "900"] 
});

export const metadata = {
  title: "TechStore | Premium Hardware",
  description: "Your Next.js App with Zustand Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${battambang.className} antialiased bg-white text-slate-900`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}