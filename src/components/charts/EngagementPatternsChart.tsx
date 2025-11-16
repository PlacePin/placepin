import styles from './engagementPatternsChart.module.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const engagementData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Food',
      data: [12, 15, 18, 14, 20, 16, 22, 19, 17, 21, 18, 23],
      backgroundColor: '#008fbfff',
      borderRadius: 8,
      barThickness: 20,
    },
    {
      label: 'Housekeeping/Laundry',
      data: [8, 10, 7, 9, 11, 8, 12, 10, 9, 13, 11, 14],
      backgroundColor: '#ff6b6b',
      borderRadius: 8,
      barThickness: 20,
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

const EngagementPatternsChart = () => {
  return (
    <div className={styles.wrapper}>
      <Bar data={engagementData} options={engagementOptions} />
    </div>
  )
}

export default EngagementPatternsChart