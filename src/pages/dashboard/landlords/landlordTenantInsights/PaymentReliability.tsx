import styles from './paymentReliability.module.css';

interface TenantPaymentRecord {
  fullName: string;
  lastPayment: string;
  rentDueDate: string;
  onTimePercentage: number;
  totalPayments: number;
  isLate: boolean;
  rating: string;
}

interface PaymentReliabilityProps {
  tenantPaymentTrackRecord: TenantPaymentRecord[],
}

const PaymentReliability = ({
  tenantPaymentTrackRecord
}: PaymentReliabilityProps) => {

  const ratingClassMap: Record<string, string> = {
    'Excellent': styles.ratingExcellent,
    'Good': styles.ratingGood,
    'Risky': styles.ratingRisky,
    'Thin File': styles.ratingInsufficient
  };

  return (
    <section className={styles.paymentSection}>
      <h3>Payment Reliability</h3>
      <div className={styles.paymentContainer}>
        <table className={styles.reliabilityTable}>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>On-Time %</th>
              <th>Last Payment</th>
              <th>Rent Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tenantPaymentTrackRecord.map((tenant, i) => (
              <tr key={i}>
                <td>{tenant.fullName}</td>
                <td>{Number.isInteger(tenant.onTimePercentage) ? `${tenant.onTimePercentage}%` : `${tenant.onTimePercentage.toFixed(2)}%`}</td>
                <td>
                  {new Date(tenant.lastPayment).toLocaleDateString('en-US', {
                    timeZone: 'UTC',
                    month: 'short',
                    day: '2-digit'
                  })}
                </td>
                <td>
                  {new Date(tenant.rentDueDate).toLocaleDateString('en-US', {
                    timeZone: 'UTC',
                    month: 'short',
                    day: '2-digit'
                  })}
                </td>
                <td className={ratingClassMap[tenant.rating]}>
                  {tenant.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default PaymentReliability