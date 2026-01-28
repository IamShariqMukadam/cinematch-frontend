"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";


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
    .map(word =>
      ["and", "the", "of", "in", "on"].includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
//   const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key !== "Enter") return;
//     if (!query.trim()) return;

//     try {
//         setLoading(true);
//         setShowDropdown(false);

//         const res = await fetch(
//         `http://localhost:8000/recommend?movie=${encodeURIComponent(query)}`
//         );

//         const data = await res.json();

//         if (data.recommendations) {
//         onRecommend(data.recommendations);
//         }
//     } catch (err) {
//         console.error("Recommendation error", err);
//     } finally {
//         setLoading(false);
//     }
// };


  // useEffect(() => {
  //   if (!query.trim()) {
  //     setResults([]);
  //     setShowDropdown(false);
  //     return;
  //   }

  //   const timer = setTimeout(async () => {
  //     if (!query.trim()) return; // ✅ PREVENT EMPTY REQUEST
  //     try {
  //       const res = await fetch(
  //         `${API_BASE}/search?movie=${encodeURIComponent(query)}`
  //       );

  //       if (!res.ok) return;

  //       const data = await res.json();
  //       setResults(data.results.slice(0, 6));
  //       setShowDropdown(true);
  //       setActiveIndex(-1);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }, 300);

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

          if (!res.ok) return;

          const data = await res.json();

          setResults(data.results.slice(0, 6));
          setShowDropdown(true);
          setActiveIndex(-1);
        } catch (err: any) {
          if (err.name !== "AbortError") {
            console.error("Search error:", err);
          }
        }
      }, 250); // ⬅️ slightly faster debounce

      return () => {
        controller.abort(); // 🔥 cancel previous request
        clearTimeout(timer);
      };
    }, [query]);

    //   return () => clearTimeout(timer);
    // }, [query]);

  return (
    <nav className=" flex items-center justify-between px-10 py-6">
      {/* Logo */}
      <h1
        onClick={() => {
            setQuery("");
            setShowDropdown(false);
            onReset();
        }}
        className="text-3xl font-semibold tracking-tight text-slate-900 cursor-pointer"
      >
        CineMatch
      </h1>


      {/* Search */}
      <div className="relative w-[480px]">
        <div className="flex items-center gap-3 bg-slate-900 backdrop-blur-md px-6 py-3 rounded-full border border-black/10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    triggerRecommend();
                }
              }}

            placeholder="Search a movie to get recommendations..."
            className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder:text-slate-100"
          />
          <span className="text-white/70 cursor-pointer" onClick={triggerRecommend}>⌕</span>
        </div>

        {/* Dropdown
        {showDropdown && results.length > 0 && (
          <ul className="absolute top-full mt-2 w-full bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden z-50">
            {results.map((movie, index) => (
              <li
                key={movie.title}
                className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition
                  ${
                    index === activeIndex
                      ? "bg-white/15"
                      : "hover:bg-white/10"
                  }`}
              >
                <Image
                    src={
                        movie.poster_path
                        ? `${POSTER_BASE_URL}${movie.poster_path}`
                        : "/placeholder.jpg"
                    }

                  alt={movie.title}
                  width={40}
                  height={60}
                  className="rounded-md object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-sm text-white/90">
                    {toTitleCase(movie.title)}
                  </span>
                  <span className="text-xs text-white/60">
                    {movie.release_year ? Math.floor(movie.release_year) : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul> */}
        {/* )} */}
        {showDropdown &&
          results.length > 0 &&
          typeof window !== "undefined" &&
          createPortal(
            <ul
              className="fixed top-[88px] left-1/2 -translate-x-1/2 w-[480px]
                        bg-slate-900/90 backdrop-blur-xl rounded-xl
                        border border-white/10 shadow-xl z-[9999]"
            >
              {results.map((movie, index) => (
                <li
                  key={movie.title}
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer
                            hover:bg-white/10"
                  onClick={() => {
                    setQuery(movie.title);
                    setShowDropdown(false);
                    triggerRecommend();
                  }}
                >
                  <Image
                    src={
                      movie.poster_path
                        ? `${POSTER_BASE_URL}${movie.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={movie.title}
                    width={40}
                    height={60}
                    className="rounded-md object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="text-sm text-white/90">
                      {toTitleCase(movie.title)}
                    </span>
                    <span className="text-xs text-white/60">
                      {movie.release_year ? Math.floor(movie.release_year) : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>,
            document.body
          )}
      </div>
      <div className="w-10" />
    </nav>
  );
}

