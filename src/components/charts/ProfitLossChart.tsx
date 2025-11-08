import {
  type ChartOptions,
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from './profitLossChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProfitLossChart = () => {

  const data = {
    labels: ['Profit', 'Tenant Upgrades', 'Expenses'],
    datasets: [
      {
        data: [5000, 50, 500],
        backgroundColor: [
          '#00bfa5',
          '#0F5FC2',
          '#DA001A',
        ],
        hoverOffset: 30,
      },
    ],
  };

  const descriptions = ["Gross Profits", "Miscellaneous Income", "Total Expenses"];

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    layout: {
      padding: 30,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const label = descriptions[index];
            const value = context.formattedValue;
            return `${label}: ${value}`;
          },
        },
      },
      title: {
        display: true,
        text: "P&L Overview",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#333",
      },
    },
  } as const;

  return (
    <section className={styles.profitLossSection}>
      <div className={styles.profitLossHeader}>
        <h3>
          Profit & Loss
        </h3>
        <span>Year-To-Date</span>
      </div>
      <div className={styles.chartContainer}>
        <Doughnut
          options={options}
          data={data}
        />
      </div>
    </section>

  )
}

export default ProfitLossChart