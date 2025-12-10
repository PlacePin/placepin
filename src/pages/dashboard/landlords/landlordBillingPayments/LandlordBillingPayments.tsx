import { useState } from 'react';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import AddReceiptCard from '../../../../components/cards/landlord/AddReceiptCard';
import ReviewUpdateReceiptCard from '../../../../components/cards/landlord/ReviewUpdateReceiptCard';
import styles from './landlordBillingPayments.module.css';
import ReviewUpdateReceipt from './ReviewUpdateReceipt';

const LandlordBillingPayments = () => {

  const [showReviewUpdateReceipt, setShowReviewUpdateReceipt] = useState(false);
  const { data } = useGetAxios('/api/landlords/receipts');

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  return (
    <>
      {showReviewUpdateReceipt ? (
        <ReviewUpdateReceipt onClose={() => setShowReviewUpdateReceipt(false)} />
      ) : (
        <div className={styles.billingContainer}>
          <ReviewUpdateReceiptCard openReceipts={() => setShowReviewUpdateReceipt(true)} />
          <AddReceiptCard properties={data.properties} />
        </div>
      )}
    </>
  )
}

export default LandlordBillingPayments