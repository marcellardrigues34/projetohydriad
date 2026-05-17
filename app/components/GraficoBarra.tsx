"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";


type Props = {
  dados: number[];
  labels: string[];
};

export default function GraficoBarra({ dados, labels }: Props) {

  const data = labels.map((data, i) => ({
    data,
    valor: dados[i],
  }));

  return (
    <BarChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="data" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="valor" fill="#2d5faf" />
    </BarChart>
  );
}