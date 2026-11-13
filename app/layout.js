import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: { default: "Gogo clone — Мэдээллийн портал", template: "%s | Gogo clone" },
  description: "Өнөөдрийн мэдээ. Олон талын өнцөг. Gogo.mn сайтаас санаа авч бүтээсэн сургалтын зориулалттай мэдээллийн портал.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body id="top" className="relative isolate flex min-h-screen flex-col">
        <CloudBackground />
        <div data-site-content className="relative z-10 flex min-h-screen flex-1 flex-col">
        <TooltipProvider delayDuration={250}>
          <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-3 text-sm text-white focus:translate-y-0">Агуулга руу очих</a>
          <Header />
          <main id="main-content" tabIndex={-1} className="wrap news-surface flex-1 py-6 outline-none sm:py-8">{children}</main>
          <Footer />
          <Toaster theme="light" position="bottom-right" richColors closeButton />
        </TooltipProvider>
        </div>
      </body>
    </html>
  );
}
