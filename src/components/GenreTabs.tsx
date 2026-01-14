"use client";

import {
  FireIcon,
  BoltIcon,
  HeartIcon,
  FilmIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  MoonIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";

type GenreTabsProps = {
  onGenreSelect: (genre: string) => void;
};

const genres = [
  { name: "Top Rated", icon: FireIcon },
  { name: "Action", icon: BoltIcon },
  { name: "Romance", icon: HeartIcon },
  { name: "Animation", icon: FilmIcon },
  { name: "Horror", icon: ExclamationTriangleIcon },
  { name: "Crime", icon: FingerPrintIcon },
  { name: "Drama", icon: MoonIcon },
];

export default function GenreTabs({ onGenreSelect }: GenreTabsProps) {
  return (
    <div className="px-10 mt-6">
      <div className="flex justify-between gap-3">
        {genres.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onGenreSelect(name)}
            className="
                flex items-center justify-center gap-2 flex-1 py-3 rounded-xl
                bg-slate-900 text-white
                hover:bg-slate-700 transition-colors text-sm
            "
          >
            <Icon className="w-4 h-4 text-slate-100" />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
