import AddReceiptCard from '../../../../components/cards/landlord/AddReceiptCard';
import ReviewUpdateReceiptCard from '../../../../components/cards/landlord/ReviewUpdateReceiptCard';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import styles from './landlordBillingPayments.module.css';

const LandlordBillingPayments = () => {

  const { data } = useGetAxios('/api/landlords/receipts');

  console.log(data)

  return (
    <div className={styles.billingContainer}>
      <ReviewUpdateReceiptCard />
      <AddReceiptCard />
    </div>
  )
}

export default LandlordBillingPayments