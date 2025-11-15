import styles from './tenantActivity.module.css';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const data = {
  labels: ["Electrician", "Plumbing", "Carpentry", "Misc."],
  datasets: [
    {
      label: "Tradesmen",
      data: [11, 16, 7, 3],
      backgroundColor: [
        "#00bfa5",
        "#0F5FC2",
        "#FFCF56",
        "#DA001A",
      ],
    },
  ],
};

const TenantActivity = () => {

  const rentPayments = [
    { rent: 3000, paid: '11/1/25' },
    { rent: 3000, paid: '10/1/25' },
    { rent: 3000, paid: '9/1/25' },
    { rent: 3000, paid: '8/1/25' },
    { rent: 3000, paid: '7/1/25' },
    { rent: 3000, paid: '6/1/25' },
    { rent: 3000, paid: '5/1/25' },
  ]

  const rentPaymentsMapped = rentPayments.map((rentPayment, i) => {
    return (
      <div key={i} className={styles.rentPayment}>
        <p>
          <span className={styles.rentAmount}>{rentPayment.rent}</span> a month Paid On: <span className={styles.date}>{rentPayment.paid}</span>
        </p>
      </div>
    )
  })

  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div className={`${styles.defaultCardStyles} ${styles.payment}`}>
          <p className={styles.title}>Payment History</p>
          {rentPaymentsMapped}
        </div>
        <div className={`${styles.defaultCardStyles} ${styles.maintenance}`}>
          <p className={styles.title}>Maintenance Request</p>
          <div className={styles.chartSection}>
            <PolarArea
              data={data}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.defaultCardStyles} ${styles.engagement}`}>
        Engagement Patterns
      </div>
    </div>
  )
}

export default TenantActivity