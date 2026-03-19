import styles from './paymentReliability.module.css';

interface PaymentReliabilityProps {
  tenantPaymentTrackRecord: any,
}

const PaymentReliability = ({
  tenantPaymentTrackRecord
}: PaymentReliabilityProps) => {

  const allTenantPaymentTrackRecords = tenantPaymentTrackRecord.map((tenant: any, i: any) => {
    return (
      {
        fullName: <span key={i}>{tenant.fullName}</span>,
        lastPayment: <span key={i}>
          {new Date(tenant.lastPayment).toLocaleDateString('en-US', {
            timeZone: "UTC",
            month: "short",
            day: "2-digit"
          })}
        </span>
      }

    )
  })
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
            {allTenantPaymentTrackRecords.map((tenant: any, i: any) => (
              <tr key={i}>
                <td>{tenant.fullName}</td>
                <td>100%</td>
                <td>{tenant.lastPayment}</td>
                <td>Dec 1</td>
                <td>Good</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default PaymentReliability