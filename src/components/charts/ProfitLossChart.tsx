import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from './profitLossChart.module.css';

const ProfitLossChart = () => {
  return (
    <section className={styles.profitLossSection}>
      <h3>
        Profit & Loss
      </h3>
      <div className={styles.chartContainer}>

      </div>
    </section>

  )
}

export default ProfitLossChart