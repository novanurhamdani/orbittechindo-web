import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { MovieDetail } from "@/types";
import { formatGenres } from "@/lib/utils/format";

interface MovieGenreChartProps {
  movie?: MovieDetail;
  genres?: string[];
}

export function MovieGenreChart({
  movie,
  genres: genresProp,
}: MovieGenreChartProps) {
  // Use provided genres or extract from movie
  const genres = genresProp || (movie ? formatGenres(movie.Genre) : []);

  // Create data for the pie chart
  const data = genres.map((genre) => ({
    name: genre,
    value: 1, // Each genre has equal weight
  }));

  // Colors for the pie chart segments
  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff8042",
    "#ff6361",
    "#bc5090",
    "#58508d",
    "#003f5c",
  ];

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">No genre data available</div>;
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Genre Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name }) => name}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${name}`]}
              contentStyle={{ backgroundColor: "hsl(var(--card))" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
