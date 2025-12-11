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
        <ReviewUpdateReceipt
          onClose={() => setShowReviewUpdateReceipt(prev => !prev)}
          receiptInfo={data.properties}
        />
      ) : (
        <div className={styles.billingContainer}>
          <ReviewUpdateReceiptCard
            openReceipts={() => setShowReviewUpdateReceipt(prev => !prev)}
          />
          <AddReceiptCard properties={data.properties} />
        </div>
      )}
    </>
  )
}

export default LandlordBillingPayments