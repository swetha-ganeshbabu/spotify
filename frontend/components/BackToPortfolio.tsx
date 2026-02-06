"use client";

import Link from "next/link";

export default function BackToPortfolio() {
  return (
    <Link
      href="/"
      className="text-spotify-light hover:text-white text-sm transition-colors"
    >
      &larr; Back to portfolio
    </Link>
  );
}
