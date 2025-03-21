import { useCallback, useEffect, useState } from "react";
import { MovieFilter } from "@/types";
import { useMovieStore } from "@/lib/store/movieStore";

export function MovieFilters() {
  const [filter, setFilter] = useState<MovieFilter>({});
  const currentYear = new Date().getFullYear();
  const { setFilter: setFilterParam } = useMovieStore();

  // Movie types for the select dropdown
  const movieTypes = [
    { value: "", label: "All Types" },
    { value: "movie", label: "Movies" },
    { value: "series", label: "Series" },
    { value: "episode", label: "Episodes" },
  ];

  // Generate years from 1970 to current year
  const years = [
    { value: undefined, label: "All Years" },
    ...Array.from({ length: currentYear - 1970 + 1 }, (_, i) => {
      const year = currentYear - i;
      return { value: year, label: year.toString() };
    }),
  ];

  const handleFilterChange = useCallback(
    (newFilter: MovieFilter) => {
      setFilterParam(newFilter);
    },
    [setFilterParam]
  );

  // Update parent component when filter changes
  useEffect(() => {
    handleFilterChange(filter);
  }, [filter, handleFilterChange]);

  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({
      ...prev,
      type: e.target.value || undefined,
    }));
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const yearValue = e.target.value ? parseInt(e.target.value) : undefined;
    setFilter((prev) => ({
      ...prev,
      year: yearValue,
    }));
  };

  return (
    <div className="glass-card p-5 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-5 text-white/90">Filters</h3>

      {/* Type filter */}
      <div className="mb-6">
        <label
          htmlFor="type-filter"
          className="block text-sm font-medium mb-2 text-white/80"
        >
          Type
        </label>
        <select
          id="type-filter"
          value={filter.type || ""}
          onChange={handleTypeChange}
          className="glass-input w-full p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E85D04] transition-all duration-300"
        >
          {movieTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Year filter */}
      <div>
        <label
          htmlFor="year-filter"
          className="block text-sm font-medium mb-2 text-white/80"
        >
          Year
        </label>
        <select
          id="year-filter"
          value={filter.year?.toString() || ""}
          onChange={handleYearChange}
          className="glass-input w-full p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E85D04] transition-all duration-300"
        >
          {years.map((year) => (
            <option key={year.label} value={year.value?.toString() || ""}>
              {year.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
