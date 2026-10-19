import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = { title: "Gogo clone – Мэдээллийн портал", description: "gogo.mn-ээс санаа авсан Next.js демо төсөл" };

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>
        <Header />
        <main className="wrap">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
