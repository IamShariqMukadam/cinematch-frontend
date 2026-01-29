const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w342";

function getPosterSrc(posterPath?: string | null) {
  if (!posterPath) return "/placeholder.jpg";

  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `${TMDB_POSTER_BASE}${posterPath}`;
}

export default function MovieCard({ movie }: { movie: any }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/poster-placeholder.png";

  const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  const toMovieTitleCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        const lower = word.toLowerCase();

        if (ROMAN_NUMERALS.includes(lower)) {
          return lower.toUpperCase();
        }

        if (index === 0) {
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        }

        if (["of", "and", "in", "on", "to"].includes(lower)) {
          return lower;
        }

        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(" ");

  // Create TMDB search URL
  const tmdbSearchUrl = `https://www.themoviedb.org/search?query=${encodeURIComponent(movie.title)}`;

  const handleClick = () => {
    window.open(tmdbSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="w-full max-w-[160px] mx-auto cursor-pointer transition-transform hover:scale-105"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <img
        src={posterUrl}
        alt={movie.title}
        className="h-[180px] sm:h-[200px] md:h-[220px] w-full rounded-xl sm:rounded-2xl object-cover bg-black/20"
        loading="lazy"
      />

      <h3 className="text-xs sm:text-sm font-semibold mt-2 line-clamp-2">
        {toMovieTitleCase(movie.title)}
      </h3>

      <div className="mt-1 flex justify-between text-[10px] sm:text-xs text-slate-800">
        <span>⭐ {movie.vote_average?.toFixed(1) ?? "–"}</span>
        <span>{movie.release_year ?? "–"}</span>
      </div>
    </div>
  );
}