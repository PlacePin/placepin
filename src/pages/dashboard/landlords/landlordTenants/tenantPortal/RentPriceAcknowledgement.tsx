import { CircleDollarSign } from 'lucide-react';
import styles from './rentPriceAcknowledgement.module.css';
import SecondaryButton from '../../../../../components/buttons/SecondaryButton';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import type { AxiosError } from 'axios';
import axios from 'axios';

const RentPriceAcknowledgement = () => {

  interface RentPriceAcknowledgement {
    rentPrice: number,
    acknowledged: boolean
  }

  const { accessToken } = useAuth();

  const [rent, setRent] = useState<RentPriceAcknowledgement>({
    rentPrice: 0,
    acknowledged: false
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<AxiosError | Error | null>(null);

  const handleRentPriceAcknowledgement = async () => {
    setIsPending(true)
    try {
      const { data } = await axiosInstance.post(
        '/api/rent/price-acknowledgement',
        rent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      console.log(data.message)

    } catch (err) {
      if(axios.isAxiosError(err)){
        console.error(err)
        // Add Sentry
        setError(err)
      } else if (err instanceof Error){
        console.error(err)
        // Add Sentry
        setError(err)
      } else {
        console.error(err)
        // Add Sentry
      }
    } finally {
      setIsPending(false);
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
        placeholder='$3000'
        value={rent.rentPrice}
        onChange={e => setRent({
          rentPrice: Number(e.target.value),
          acknowledged: rent.acknowledged
        })}
      />
      <SecondaryButton
        title={isPending ? 'Sending...' : 'Rent Price Acknowledgement'}
        // icon={<ArrowRight size={16} />}
        onClick={handleRentPriceAcknowledgement}
      />
    </div>
  )
}

export default RentPriceAcknowledgement