"use client";

import MovieCard from "@/components/MovieCard";

type Recommendation = {
  title: string;
  release_year?: number;
  vote_average?: number;
  popularity?: number;
  poster_path?: string | null;
};

export default function MovieGrid({
  recommendations,
  showTitle = true,
}: {
  recommendations?: Recommendation[];
  showTitle?: boolean;
}) {
  // NO DATA
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="px-10 mt-16">
      {showTitle && (
        <h2 className="text-2xl font-bold mb-8 text-slate-900">
          Recommended for you
        </h2>
      )}

      <div className="grid grid-cols-5 gap-6 justify-items-center">
        {recommendations.slice(0, 10).map((movie, idx) => (
          <MovieCard
            key={`${movie.title}-${idx}`}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );
}
