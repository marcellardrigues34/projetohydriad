"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { dia: string; valor: number }[];
};

export default function GraficoLinha({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="dia" stroke="#9499b8" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="valor"
          stroke="#090b86"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}