import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
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

  // Handle year range change
  const handleYearChange = (values: number[]) => {
    setFilter((prev) => ({
      ...prev,
      yearStart: values[0],
      yearEnd: values[1],
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
      
      {/* Year range filter */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Year Range: {filter.yearStart} - {filter.yearEnd}
        </label>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[filter.yearStart || 1900, filter.yearEnd || currentYear]}
          min={1900}
          max={currentYear}
          step={1}
          onValueChange={handleYearChange}
        >
          <Slider.Track className="bg-muted relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-primary rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-background border-2 border-primary shadow-md rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Year start"
          />
          <Slider.Thumb
            className="block w-5 h-5 bg-background border-2 border-primary shadow-md rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Year end"
          />
        </Slider.Root>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>1900</span>
          <span>{currentYear}</span>
        </div>
      </div>
    </div>
  );
}
