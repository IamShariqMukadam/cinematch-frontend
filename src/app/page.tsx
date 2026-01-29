"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroCaroussel from "@/components/HeroCaroussel";
import GenreTabs from "@/components/GenreTabs";
import MovieGrid from "@/components/MovieGrid";

export type Recommendation = {
  title: string;
  release_year: number;
  vote_average: number;
  popularity: number;
  poster_path?: string;
};

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [heroMovies, setHeroMovies] = useState<Recommendation[]>([]);
  const [recommendations, setRecommendations] =
    useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const [latest, setLatest] = useState<Recommendation[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 🔹 LOAD HOME DATA ONCE
  useEffect(() => {
    fetch(`${API_BASE}/top-rated`)
      .then((res) => res.json())
      .then((data) => {
        setHeroMovies(data);
      })
      .catch(console.error);

    fetch(`${API_BASE}/latest`)
      .then((res) => res.json())
      .then((data) => {
        setLatest(data);
      })
      .catch(console.error);
  }, []);

  // 🔄 HANDLE URL CHANGES (Back/Forward buttons)
  useEffect(() => {
    const query = searchParams.get("q");
    const type = searchParams.get("type");

    if (isInitialLoad) {
      setIsInitialLoad(false);

      if (query && type) {
        restoreStateFromURL(query, type);
      }
      return;
    }

    if (!query || !type) {
      setRecommendations(null);
      setLastSearch(null);
      return;
    }

    restoreStateFromURL(query, type);
  }, [searchParams]);

  const restoreStateFromURL = async (query: string, type: string) => {
    try {
      setLoading(true);

      if (type === "movie") {
        const res = await fetch(
          `${API_BASE}/recommend?movie=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Recommendation fetch failed");
        const data = await res.json();

        if (data.recommendations) {
          setRecommendations(data.recommendations);
          setHeroMovies(data.recommendations);
          setLastSearch(query);
        }
      } else if (type === "genre") {
        const endpoint =
          query === "Top Rated"
            ? `${API_BASE}/top-rated`
            : `${API_BASE}/genre?genre=${encodeURIComponent(query)}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Genre fetch failed");
        const data = await res.json();

        setRecommendations(data);
        setHeroMovies(data);
        setLastSearch(query);
      }
    } catch (err) {
      console.error("Error restoring state:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (query: string, type: "movie" | "genre") => {
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("type", type);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchGenreMovies = async (genre: string) => {
    try {
      setLoading(true);

      const endpoint =
        genre === "Top Rated"
          ? `${API_BASE}/top-rated`
          : `${API_BASE}/genre?genre=${encodeURIComponent(genre)}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Genre fetch failed");

      const data = await res.json();

      setRecommendations(data);
      setHeroMovies(data);
      setLastSearch(genre);

      updateURL(genre, "genre");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen backdrop-blur-xl bg-white/5">
      {/* NAVBAR */}
      <Navbar
        onRecommend={(movies, query) => {
          setRecommendations(movies);
          setHeroMovies(movies);
          setLastSearch(query);
          updateURL(query, "movie");
        }}
        setLoading={setLoading}
        onReset={() => {
          setRecommendations(null);
          setLastSearch(null);
          router.push("/", { scroll: false });
        }}
      />

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-lg font-bold text-slate-700 animate-pulse">
            Fetching recommendations…
          </span>
        </div>
      )}

      {/* DEFAULT HOME VIEW */}
      {!recommendations && !loading && (
        <>
          {/* HERO */}
          {heroMovies.length >= 2 && (
            <HeroCaroussel movies={heroMovies.slice(0, 2)} />
          )}

          {/* GENRE TABS */}
          <GenreTabs onGenreSelect={fetchGenreMovies} />

          {/* LATEST SECTION */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-slate-900 container-padding">
              Latest (2025)
            </h2>
            <MovieGrid
              recommendations={latest.slice(0, 10)}
              showTitle={false}
            />
          </div>
        </>
      )}

      {/* RECOMMENDATION VIEW */}
      {recommendations && !loading && (
        <div className="animate-fadeIn">
          {/* TEXT ABOVE HERO */}
          {lastSearch && (
            <p className="container-padding mt-6 text-sm text-slate-600 mb-4">
              Top recommendations based on your interest in{" "}
              <span className="text-slate-900 font-bold">{lastSearch}</span>
            </p>
          )}

          {/* HERO */}
          {heroMovies.length === 0 && !loading && (
            <div className="h-[320px] bg-slate-200 animate-pulse rounded-2xl container-padding mt-6" />
          )}
          {heroMovies.length >= 2 && (
            <HeroCaroussel movies={heroMovies.slice(0, 2)} />
          )}

          {/* GRID */}
          <MovieGrid recommendations={recommendations.slice(2, 12)} />
        </div>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen backdrop-blur-xl bg-white/5 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-700 animate-pulse">
          Loading...
        </span>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}