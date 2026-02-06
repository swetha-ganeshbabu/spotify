"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Input from "./ui/Input";
import { searchSongs } from "@/lib/api";
import { SearchResult } from "@/lib/types";

export default function SongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    try {
      const data = await searchSongs(q);
      setResults(data.results);
      setIsOpen(data.results.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSong(result: SearchResult) {
    setIsOpen(false);
    setQuery("");
    router.push(`/song/${result.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSong(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <Input
        type="text"
        placeholder="Search for a song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-spotify-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {results.map((result, index) => (
            <button
              key={result.id}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === activeIndex
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
              onClick={() => selectSong(result)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <Image
                src={result.album_art_small}
                alt={result.title}
                width={40}
                height={40}
                className="rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/40x40/282828/B3B3B3?text=?";
                }}
              />
              <div>
                <p className="text-white text-sm font-medium">
                  {result.title}
                </p>
                <p className="text-spotify-light text-xs">{result.artist}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
