import { CircleDollarSign } from 'lucide-react';
import styles from './rentPriceAcknowledgement.module.css';
import SecondaryButton from '../../../../../components/buttons/SecondaryButton';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import axios from 'axios';

interface RentPriceAcknowledgementProps {
  tenantId: string
}

const RentPriceAcknowledgement = ({
  tenantId
}: RentPriceAcknowledgementProps) => {

  interface RentPriceAgreement {
    tenantId: string,
    rentPrice: number,
    acknowledged: boolean,
    dueDate: 1 | 15
  }

  const { accessToken } = useAuth();

  const [rent, setRent] = useState<RentPriceAgreement>({
    tenantId,
    rentPrice: 1,
    acknowledged: false,
    dueDate: 1,
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRentPriceAcknowledgement = async () => {
    setIsPending(true)
    try {
      await axiosInstance.post(
        '/api/rent/price-acknowledgement',
        rent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message)
        console.error('Axios Type', err)
        // send to Sentry/DataDog here
      } else if (err instanceof Error) {
        setError(err.message)
        console.error('JS Error Type', err)
        // send to Sentry/DataDog here
      } else {
        setError('Oops something went wrong.')
        console.error('Unknown Error', err)
        // send to Sentry/DataDog here
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
        onChange={e => setRent(prev => ({
          ...prev,
          rentPrice: Number(e.target.value) || 1
        }))}
      />
      <div className={styles.dueDateSelector}>
        <p>Payment due date</p>
        <div className={styles.dueDateOptions}>
          <button
            className={`${styles.dueDateOption} ${rent.dueDate === 1 ? styles.selected : ''}`}
            onClick={() => setRent(prev => ({ ...prev, dueDate: 1 }))}
          >
            1st
          </button>
          <button
            className={`${styles.dueDateOption} ${rent.dueDate === 15 ? styles.selected : ''}`}
            onClick={() => setRent(prev => ({ ...prev, dueDate: 15 }))}
          >
            15th
          </button>
        </div>
      </div>
      <SecondaryButton
        title={isPending ? 'Sending...' : 'Rent Price Acknowledgement'}
        // icon={<ArrowRight size={16} />}
        onClick={handleRentPriceAcknowledgement}
      />
    </div>
  )
}

export default RentPriceAcknowledgement