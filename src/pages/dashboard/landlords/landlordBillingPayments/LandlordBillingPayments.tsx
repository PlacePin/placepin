import AddReceiptCard from '../../../../components/cards/landlord/AddReceiptCard';
import styles from './landlordBillingPayments.module.css';

const LandlordBillingPayments = () => {
  return (
    <div className={styles.billingContainer}>
      <div>Review & Update</div>
      <AddReceiptCard />
    </div>
  )
}

export default LandlordBillingPayments