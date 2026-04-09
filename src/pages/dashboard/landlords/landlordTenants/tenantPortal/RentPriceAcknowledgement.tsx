import { CircleDollarSign } from 'lucide-react';
import styles from './rentPriceAcknowledgement.module.css';
import SecondaryButton from '../../../../../components/buttons/SecondaryButton';
import axiosInstance from '../../../../../utils/axiosInstance';

const RentPriceAcknowledgement = () => {

  const handleRentPriceAcknowledgement = async () => {
    try {
      const { data } = await axiosInstance.post(
        '/api/rent/price-acknowledgement',
        
      )
    } catch (error) {

    } finally {

    }
  }

  return (
    <div className={`${styles.defaultCardStyles} ${styles.misc}`}>
      <div className={styles.miscHeader}>
        <CircleDollarSign className={styles.dollarSignIcon} />
        <span className={`${styles.badge}`}>Acknowledgement</span>
      </div>
      <div className={styles.miscContent}>
        <h3 className={styles.miscTitle}>Rent Price</h3>
        <p className={styles.miscDescription}>Tell us how much this tenant should be paying in rent each month and we will handle the rest.</p>
        <p className={styles.disclaimer}>*This is not legally binding. Verify on the lease first before submitting a number.</p>
      </div>
      <input
        className={styles.inputField}
        id='rentPrice'
        name="rentPrice"
        placeholder='$3000'
      />
      <SecondaryButton
        title={'Rent Price Acknowledgement'}
        // icon={<ArrowRight size={16} />}
        onClick={handleRentPriceAcknowledgement}
      />
    </div>
  )
}

export default RentPriceAcknowledgement