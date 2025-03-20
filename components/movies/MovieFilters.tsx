import { useEffect, useState } from "react";
import { MovieFilter } from "@/types";

interface MovieFiltersProps {
  initialFilter: MovieFilter;
  onFilterChange: (filter: MovieFilter) => void;
}

export function MovieFilters({ initialFilter, onFilterChange }: MovieFiltersProps) {
  const [filter, setFilter] = useState<MovieFilter>(initialFilter);
  const currentYear = new Date().getFullYear();
  
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

  // Update parent component when filter changes
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

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
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Filters</h3>
      
      {/* Type filter */}
      <div className="mb-6">
        <label htmlFor="type-filter" className="block text-sm font-medium mb-2">
          Type
        </label>
        <select
          id="type-filter"
          value={filter.type || ""}
          onChange={handleTypeChange}
          className="w-full p-2 border rounded bg-background border-input focus:outline-none focus:ring-2 focus:ring-primary"
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
        <label htmlFor="year-filter" className="block text-sm font-medium mb-2">
          Year
        </label>
        <select
          id="year-filter"
          value={filter.year?.toString() || ""}
          onChange={handleYearChange}
          className="w-full p-2 border rounded bg-background border-input focus:outline-none focus:ring-2 focus:ring-primary"
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
