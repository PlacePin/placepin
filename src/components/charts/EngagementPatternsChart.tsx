import styles from './engagementPatternsChart.module.css';
import { Bar } from 'react-chartjs-2';
import type { PerkPatterns } from '../../interfaces/interfaces';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

interface EngagementPatternsChartProps {
  perkPatterns: PerkPatterns;
  selectedYear?: number;
}

const EngagementPatternsChart = ({
  perkPatterns,
  selectedYear
}: EngagementPatternsChartProps) => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const currentYear = selectedYear || new Date().getFullYear();

  // Helper function to get data for a specific perk type
  const getPerkDataForYear = (perkType: keyof PerkPatterns) => {
    const monthlyData = Array(12).fill(0);

    perkPatterns[perkType]?.forEach((entry) => {
      if (entry.year === currentYear) {
        monthlyData[entry.month] = entry.count;
      }
    });

    return monthlyData;
  };

  const engagementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Food',
        data: getPerkDataForYear('food'),
        backgroundColor: '#008fbfff',
        borderRadius: 8,
        barThickness: 10,
      },
      {
        label: 'Housekeeping',
        data: getPerkDataForYear('housekeeping'),
        backgroundColor: '#ff6b6b',
        borderRadius: 8,
        barThickness: 10,
      },
      {
        label: 'Laundry',
        data: getPerkDataForYear('laundry'),
        backgroundColor: '#00bfa5',
        borderRadius: 8,
        barThickness: 10,
      },
      {
        label: 'Other',
        data: getPerkDataForYear('other'),
        backgroundColor: '#FFCF56',
        borderRadius: 8,
        barThickness: 10,
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y} times`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          stepSize: 5,
        },
        title: {
          display: true,
          text: 'Frequency',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
  };

  return (
    <div className={styles.wrapper}>
      <Bar data={engagementData} options={engagementOptions} />
    </div>
  )
}

export default EngagementPatternsChart;