const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w342";


function getPosterSrc(posterPath?: string | null) {
  if (!posterPath) return "/placeholder.jpg";

  // backend already sends full TMDB URL
  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `${TMDB_POSTER_BASE}${posterPath}`;
}

export default function MovieCard({ movie }: { movie: any }) {
  const posterSrc = getPosterSrc(movie.poster_path);
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

       // Preserve Roman numerals
      if (ROMAN_NUMERALS.includes(lower)) {
        return lower.toUpperCase();
      }

      // Always capitalize first word (The, A, An included)
      if (index === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

      // Keep true connectors lowercase
      if (["of", "and", "in", "on", "to"].includes(lower)) {
        return lower;
      }

      // Capitalize everything else
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");



  return (
    <div className="w-[160px]">
      <img
        src={posterUrl}
        alt={movie.title}
        className="h-[220px] w-full rounded-2xl object-cover bg-black/20"
        loading="lazy"
      />

      <h3 className="text-sm font-semibold mt-2 line-clamp-2">
        {toMovieTitleCase(movie.title)}
      </h3>

      <div className="mt-1 flex justify-between text-xs text-slate-800 max-w-[150px]">
        <span>⭐ {movie.vote_average?.toFixed(1) ?? "—"}</span>
        <span>{movie.release_year ?? "—"}</span>
      </div>

    </div>
  );
}
