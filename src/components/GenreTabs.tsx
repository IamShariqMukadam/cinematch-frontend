"use client";

import {
  FireIcon,
  BoltIcon,
  HeartIcon,
  FilmIcon,
  ExclamationTriangleIcon,
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
    <div className="px-4 sm:px-6 md:px-10 mt-6">
      {/* Desktop/Tablet View - Horizontal scroll */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {genres.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onGenreSelect(name)}
            className="
              flex items-center justify-center gap-1.5 sm:gap-2
              flex-shrink-0 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3
              rounded-lg sm:rounded-xl
              bg-slate-900 text-white
              hover:bg-slate-700 transition-colors
              text-xs sm:text-sm whitespace-nowrap
            "
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-100" />
            <span className="hidden sm:inline">{name}</span>
            <span className="sm:hidden">
              {name === "Top Rated" ? "Top" : name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}