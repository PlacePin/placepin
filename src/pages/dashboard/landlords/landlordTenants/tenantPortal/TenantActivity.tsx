import styles from './tenantActivity.module.css';
import EngagementPatternsChart from '../../../../../components/charts/EngagementPatternsChart';
import MaintenanceRequestChart from '../../../../../components/charts/MaintenanceRequestChart';
import type { PerkPatterns } from '../../../../../interfaces/interfaces';
import { useState } from 'react';

interface TenantActivityProps {
  rentPayments: Record<string, any>[];
  maintenanceRequest: Record<string, any>;
  perkPatterns: PerkPatterns;
}

const TenantActivity = ({
  rentPayments,
  maintenanceRequest,
  perkPatterns,
}: TenantActivityProps) => {

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  const rentPaymentsMapped = rentPayments.map((rentPayment, i) => {
    return (
      <div key={i} className={styles.rentPayment}>
        <p>
          <span className={styles.rentAmount}>
            {`$${rentPayment.rentAmount.toLocaleString('en-US')}`}
          </span>
          {' a month Paid On: '}
          <span className={styles.date}>
            {new Date(rentPayment.monthPaid).toLocaleDateString('en-US', {
              timeZone: "UTC",
            })}
          </span>
        </p>
      </div>
    )
  })

  const noPaymentHistory = (
    <div className={styles.noPaymentHistoryWrapper}>
      <h2 className={styles.noPaymentHistoryText}>
        No Payment History Yet
      </h2>
    </div>
  )

  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div className={`${styles.defaultCardStyles} ${styles.payment}`}>
          <p className={styles.title}>Payment History</p>
          {rentPayments.length ?
            rentPaymentsMapped :
            noPaymentHistory
          }
        </div>
        <div className={`${styles.defaultCardStyles} ${styles.maintenance}`}>
          <p className={styles.title}>Maintenance Request</p>
          <div className={styles.chartSection}>
            <MaintenanceRequestChart
              maintenanceRequest={maintenanceRequest}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.defaultCardStyles} ${styles.engagement}`}>
        <div className={styles.titleWithFilter}>
          <p className={styles.title}>Engagement Patterns</p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.yearSelect}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <EngagementPatternsChart
          perkPatterns={perkPatterns}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  )
}

export default TenantActivity