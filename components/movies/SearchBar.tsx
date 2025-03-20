import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full p-4 pl-10 text-sm border rounded-l-lg bg-background border-input focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search for movies, series, episodes..."
          required
        />
      </div>
      <Button type="submit" className="px-6 rounded-l-none">
        Search
      </Button>
    </form>
  );
}
