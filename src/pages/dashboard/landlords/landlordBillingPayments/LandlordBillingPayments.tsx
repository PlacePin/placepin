import AddReceiptCard from '../../../../components/cards/landlord/AddReceiptCard';
import ReviewUpdateReceiptCard from '../../../../components/cards/landlord/ReviewUpdateReceiptCard';
import styles from './landlordBillingPayments.module.css';

const LandlordBillingPayments = () => {
  return (
    <div className={styles.billingContainer}>
      <ReviewUpdateReceiptCard />
      <AddReceiptCard />
    </div>
  )
}

export default LandlordBillingPayments