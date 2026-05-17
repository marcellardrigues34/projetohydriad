
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface BarChartProps {
  labels: string[];
  data: number[];
  label?: string;
}

export function BarChart({ labels, data, label = "Dados" }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destrói o gráfico anterior antes de criar um novo
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: "#378ADD",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.06)" },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [labels, data, label]);

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-medium text-gray-700">{label}</h2>
      <div className="relative h-72 w-full">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Gráfico de barras: ${label}`}
        />
      </div>
    </div>
  );
}