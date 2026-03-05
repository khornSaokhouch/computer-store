import "./globals.css";

export const metadata = {
  title: "TechStore | Premium Hardware",
  description: "Your Next.js App with Zustand Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow font-sans">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}