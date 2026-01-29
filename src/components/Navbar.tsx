"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w92";

type SearchResult = {
  title: string;
  poster_path: string;
  release_year: number;
};

type Recommendation = {
  title: string;
  release_year: number;
  vote_average: number;
  popularity: number;
};

type NavbarProps = {
  onRecommend: (movies: Recommendation[], query: string) => void;
  setLoading: (val: boolean) => void;
  onReset: () => void;
};

export default function Navbar({
  onRecommend,
  setLoading,
  onReset,
}: NavbarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const triggerRecommend = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setShowDropdown(false);

      const res = await fetch(
        `${API_BASE}/recommend?movie=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        throw new Error("Recommendation fetch failed");
      }
      const data = await res.json();

      if (data.recommendations) {
        onRecommend(data.recommendations, query);
      }
    } finally {
      setLoading(false);
    }
  };

  const toTitleCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((word) =>
        ["and", "the", "of", "in", "on"].includes(word)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/search?query=${encodeURIComponent(query.trim())}`,
          { signal }
        );

        if (!res.ok) {
          setResults([]);
          setShowDropdown(false);
          return;
        }

        const data = await res.json();
        const resultsArray = Array.isArray(data) ? data : (data.results || []);

        if (!Array.isArray(resultsArray) || resultsArray.length === 0) {
          setResults([]);
          setShowDropdown(false);
          return;
        }

        const topResults = resultsArray.slice(0, 6);
        setResults(topResults);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Search error:", err);
        }
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <nav className="relative z-50 flex flex-col sm:flex-row items-center justify-between container-padding py-4 sm:py-6 gap-4 sm:gap-0">
      {/* Logo */}
      <h1
        onClick={() => {
          setQuery("");
          setShowDropdown(false);
          onReset();
        }}
        className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 cursor-pointer"
      >
        CineMatch
      </h1>

      {/* Search */}
      <div className="relative w-full sm:w-[400px] md:w-[480px]" ref={dropdownRef}>
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-black/10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                triggerRecommend();
              }
            }}
            onFocus={() => {
              if (results.length > 0) {
                setShowDropdown(true);
              }
            }}
            placeholder="Search a movie..."
            className="bg-transparent outline-none w-full text-xs sm:text-sm text-slate-200 placeholder:text-slate-100"
          />
          <span
            className="text-white/70 cursor-pointer hover:text-white transition-colors text-lg"
            onClick={triggerRecommend}
          >
            ⌕
          </span>
        </div>

        {/* Dropdown */}
        {showDropdown && results.length > 0 && (
          <ul className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden z-[9999] max-h-[60vh] overflow-y-auto">
            {results.map((movie, index) => (
              <li
                key={`${movie.title}-${index}`}
                className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-colors
                  ${index === activeIndex ? "bg-white/15" : "hover:bg-white/10"}`}
                onClick={() => {
                  setQuery(movie.title);
                  setShowDropdown(false);
                  setTimeout(() => triggerRecommend(), 100);
                }}
              >
                <Image
                  src={
                    movie.poster_path
                      ? `${POSTER_BASE_URL}${movie.poster_path}`
                      : "/placeholder.jpg"
                  }
                  alt={movie.title}
                  width={32}
                  height={48}
                  className="rounded-md object-cover bg-slate-800 w-8 h-12 sm:w-10 sm:h-14"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />

                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs sm:text-sm text-white/90 truncate">
                    {toTitleCase(movie.title)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/60">
                    {movie.release_year ? Math.floor(movie.release_year) : "N/A"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}