import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#1b0c2d",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "PhotoReborn AI — Оживите ваши воспоминания с помощью ИИ",
  description: "Восстанавливайте и оживляйте старые семейные фотографии за секунды с помощью нашего Telegram-бота на базе искусственного интеллекта.",
  keywords: [
    "восстановление фотографий",
    "ИИ",
    "искусственный интеллект",
    "реставрация фото",
    "улучшение качества фото",
    "колоризация",
    "анимация фото",
    "telegram бот",
  ],
  authors: [{ name: "PhotoReborn AI Team" }],
  openGraph: {
    title: "PhotoReborn AI — Оживите ваши воспоминания с помощью ИИ",
    description: "Превратите выцветшие и повреждённые снимки в яркие чёткие цветные фотографии с помощью ИИ",
    type: "website",
    locale: "ru_RU",
    siteName: "PhotoReborn AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoReborn AI — Оживите ваши воспоминания с помощью ИИ",
    description: "Восстанавливайте старые фотографии с помощью искусственного интеллекта",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <Preloader />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
