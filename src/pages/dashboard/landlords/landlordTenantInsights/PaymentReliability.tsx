import styles from './paymentReliability.module.css';

const PaymentReliability = () => {
  return (
    <div>
       <section className={styles.paymentsection}>
            <h2>Payment Reliability</h2>
            <table className={styles.paymenttable}>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>On-Time %</th>
                  <th>Last Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sarah K.</td>
                  <td>100%</td>
                  <td>Oct 30</td>
                  <td className={`${styles.status} ${styles.good}`}>✅ Good</td>
                </tr>
                <tr>
                  <td>Mark D.</td>
                  <td>75%</td>
                  <td>Oct 25</td>
                  <td className={`${styles.status} ${styles.warn}`}>⚠️ Watch</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className={styles.renewalsection}>
            <h2>Renewal & Risk</h2>
            <div className={styles.renewalgrid}>
              <div className={styles.renewalcard}>
                <h3>High Renewal Likelihood</h3>
                <p>16 tenants likely to renew based on engagement and on-time payments.</p>
              </div>
              <div className={`${styles.renewalcard} ${styles.risk}`}>
                <h3>At-Risk Tenants</h3>
                <p>3 tenants show signs of disengagement or delayed payments.</p>
              </div>
            </div>
          </section>
          <section className={styles.propertycomparison}>
            <h2>Property Comparison</h2>
            <p>Compare performance and engagement across your portfolio.</p>
            <div className={styles.chartplaceholder}>🏘️ Chart: Engagement by Property</div>
          </section>
    </div>
  )
}

export default PaymentReliability