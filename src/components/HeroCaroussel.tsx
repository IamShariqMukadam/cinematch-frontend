interface HeroCarouselProps {
  movies?: any[];
}

const toMovieTitleCase = (text: string) =>
  text
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      const lower = word.toLowerCase();

      if (index === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

      if (["of", "and", "in", "on", "to"].includes(lower)) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 container-padding mt-4 sm:mt-6">
      {movies.slice(0, 2).map((movie, idx) => {
        const bgImage = movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : undefined;

        return (
          <div
            key={idx}
            className="rounded-2xl sm:rounded-3xl shadow-xl h-[200px] sm:h-[240px] md:h-[260px] flex flex-col justify-end"
            style={{
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-gradient-to-t from-black/80 via-black/40 to-black/10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-end">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100">
                {toMovieTitleCase(movie.title)}
              </h2>
              <span className="mt-2 sm:mt-4 inline-block text-xs sm:text-sm text-slate-300">
                ★ Recommended the most based on your interest
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}