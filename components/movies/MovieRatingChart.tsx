import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MovieDetail } from "@/types";
import { extractRatingData } from "@/lib/utils/format";

interface MovieRatingChartProps {
  movie: MovieDetail;
}

export function MovieRatingChart({ movie }: MovieRatingChartProps) {
  const data = extractRatingData(movie);

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">No rating data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <XAxis 
          type="number" 
          domain={[0, 10]} 
          tickCount={6} 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          width={120}
        />
        <Tooltip
          formatter={(value) => [`${value}/10`, "Rating"]}
          contentStyle={{ 
            backgroundColor: "var(--background)", 
            border: "1px solid var(--border)" 
          }}
        />
        <Bar 
          dataKey="value" 
          fill="var(--primary)" 
          radius={[0, 4, 4, 0]} 
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
