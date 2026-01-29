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
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="container-padding mt-12 sm:mt-14 md:mt-16">
      {showTitle && (
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-slate-900">
          Recommended for you
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 justify-items-center">
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