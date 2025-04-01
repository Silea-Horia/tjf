import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PIE_CHART_CONFIG = {
  labels: ['0 Stars', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
  colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  options: {
    plugins: { legend: { position: 'right' } },
    maintainAspectRatio: false,
  },
};