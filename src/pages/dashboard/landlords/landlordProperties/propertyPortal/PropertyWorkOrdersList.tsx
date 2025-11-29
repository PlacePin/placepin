import styles from './propertyWorkOrdersList.module.css';

interface PropertyWorkOrdersListProps {
  // tradesmen: string[],
}

const PropertyWorkOrdersList = ({
  // tradesmen
}: PropertyWorkOrdersListProps) => {

  // const allTradesmen = tradesmen.map((tradesman, i) => {
  //   return (
  //     <span key={i}>{tradesman}</span>
  //   )
  // })

  const allTradesmen = ['John', 'Shawn', 'Edgar', 'Chris', 'James', 'Tyler', 'Jacob', 'Daquan']

  return (
    <section className={styles.paymentSection}>
      <h3>Work Orders</h3>
      <div className={styles.paymentContainer}>
        <table className={styles.reliabilityTable}>
          <thead>
            <tr>
              <th>Tradesman</th>
              <th>Unit</th>
              <th>Trade</th>
              <th>Start Date</th>
              <th>Retainer</th>
            </tr>
          </thead>
          <tbody>
            {allTradesmen.map((tradesman, i) => (
              <tr key={i}>
                <td>{tradesman}</td>
                <td>{'1'}</td>
                <td>{'Electrician'}</td>
                <td>{'Dec 1'}</td>
                <td>{'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

  )
}

export default PropertyWorkOrdersList