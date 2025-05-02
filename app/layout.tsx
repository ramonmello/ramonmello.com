import type { Metadata } from "next";
import { StarCanvas } from "@/components/star-canvas";
import { Layout } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramon Mello | Full-Stack Developer",
  description:
    "Desenvolvedor Full-Stack especializado em criar experiências web modernas e interativas.",
  metadataBase: new URL("https://ramonmello.com"),
  openGraph: {
    title: "Ramon Mello | Full-Stack Developer",
    description:
      "Desenvolvedor Full-Stack especializado em criar experiências web modernas e interativas.",
    url: "https://ramonmello.com",
    siteName: "Ramon Mello",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ramon Mello - Full-Stack Developer",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramon Mello | Full-Stack Developer",
    description:
      "Desenvolvedor Full-Stack especializado em criar experiências web modernas e interativas.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <StarCanvas />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
