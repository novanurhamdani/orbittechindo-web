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
  movie: MovieDetail;
}

export function MovieGenreChart({ movie }: MovieGenreChartProps) {
  const genres = formatGenres(movie.Genre);

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
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [name, ""]}
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
