import React from 'react';
import { Pie } from 'react-chartjs-2';
import { PIE_CHART_CONFIG } from './constants,jsx';

const RatingPieChart = ({ data }) => {
  const ratingCounts = [0, 1, 2, 3, 4, 5].map((rating) =>
    data.filter((loc) => loc.rating === rating).length
  );

  const chartData = {
    labels: PIE_CHART_CONFIG.labels,
    datasets: [{
      data: ratingCounts,
      backgroundColor: PIE_CHART_CONFIG.colors,
      hoverOffset: 4,
    }],
  };

  return (
    <div style={{ height: '500px', margin: '300px 500px', position: 'absolute' }}>
      <Pie data={chartData} options={PIE_CHART_CONFIG.options} />
    </div>
  );
};

export default RatingPieChart;