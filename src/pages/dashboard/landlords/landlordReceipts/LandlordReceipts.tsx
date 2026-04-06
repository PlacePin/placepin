import { useState } from 'react';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import AddReceiptCard from '../../../../components/cards/landlord/AddReceiptCard';
import ReviewUpdateReceiptCard from '../../../../components/cards/landlord/ReviewUpdateReceiptCard';
import styles from './landlordReceipts.module.css';
import ReviewUpdateReceipt from './ReviewUpdateReceipt';

const LandlordReceipts = () => {

  const [showReviewUpdateReceipt, setShowReviewUpdateReceipt] = useState(false);
  const { data, refetch } = useGetAxios('/api/landlords/receipts');

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  return (
    <>
      {showReviewUpdateReceipt ? (
        <ReviewUpdateReceipt
          onClose={() => setShowReviewUpdateReceipt(prev => !prev)}
          receiptInfo={data.properties}
          onReceiptUpdated={refetch}
        />
      ) : (
        <div className={styles.billingContainer}>
          <ReviewUpdateReceiptCard
            openReceipts={() => setShowReviewUpdateReceipt(prev => !prev)}
          />
          <AddReceiptCard
            properties={data.properties}
            onReceiptAdded={refetch}
          />
        </div>
      )}
    </>
  )
}

export default LandlordReceipts