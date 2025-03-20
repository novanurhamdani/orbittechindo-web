import { useState, FormEvent, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
          <Search className="h-5 w-5 text-[#E85D04]" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="glass-input block w-full h-14 p-4 pl-12 text-base text-white border-0 rounded-l-lg rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#E85D04] transition-all duration-300"
          placeholder="Search for movies, series, episodes..."
          required
        />
      </div>
      <Button
        type="submit"
        variant="orange"
        className="h-14 px-6 rounded-l-none cursor-pointer"
      >
        Search
      </Button>
    </form>
  );
}
