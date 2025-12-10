import AddReceiptCard from '../../../../components/cards/landlord/AddReceiptCard';
import ReviewUpdateReceiptCard from '../../../../components/cards/landlord/ReviewUpdateReceiptCard';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import styles from './landlordBillingPayments.module.css';

const LandlordBillingPayments = () => {

  const { data } = useGetAxios('/api/landlords/receipts');

  if(!data){
    return <div>{'Loading Data'}</div>
  }

  return (
    <div className={styles.billingContainer}>
      <ReviewUpdateReceiptCard />
      <AddReceiptCard properties={data.properties}/>
    </div>
  )
}

export default LandlordBillingPayments