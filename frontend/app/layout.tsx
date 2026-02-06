import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Song Story - ML-Powered Music Analysis Portfolio",
  description:
    "ML-powered music analysis portfolio featuring prompt engineering, cosine similarity, NLP sentiment analysis, and evaluation metrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-5xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
