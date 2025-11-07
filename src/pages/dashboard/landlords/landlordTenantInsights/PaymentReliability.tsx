import styles from './paymentReliability.module.css';

interface PaymentReliabilityProps {
  tenants: string[],
}

const PaymentReliability = ({
  tenants
}: PaymentReliabilityProps) => {

  const allTenants = tenants.map((tenant, i) => {
    return (
      <span key={i}>{tenant}</span>
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
            {allTenants.map((tenant, i) => (
              <tr key={i}>
                <td>{tenant}</td>
                <td>100%</td>
                <td>Nov 1</td>
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