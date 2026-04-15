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
    rentPrice: string,
    acknowledged: boolean,
    dueDate: 1 | 15
  }

  const { accessToken } = useAuth();

  const [rent, setRent] = useState<RentPriceAgreement>({
    tenantId,
    rentPrice: '',
    acknowledged: false,
    dueDate: 1,
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');

    if (parts.length <= 1) return cleaned;

    return parts[0] + '.' + parts.slice(1).join('');
  };

  const handleRentPriceAcknowledgement = async () => {
    setError(null);

    // Rounding to two decimal places
    const parsedRent = Math.round(
      Number(sanitizeNumber(rent.rentPrice)) * 100
    ) / 100;

    if (parsedRent <= 0) {
      setError(`Can't set rent to zero.`)
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsPending(true)

    try {
      await axiosInstance.post(
        '/api/rent/price-acknowledgement',
        {
          ...rent,
          rentPrice: parsedRent,
        },
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
        <p className={styles.disclaimer}>
          *Ensure this amount reflects what is stated in the tenant's lease before submitting.
        </p>
      </div>
      <input
        inputMode="decimal"
        className={styles.inputField}
        id='rentPrice'
        placeholder='$3000'
        value={rent.rentPrice}
        onChange={e => setRent(prev => ({
          ...prev,
          rentPrice: e.target.value
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
      <p className={styles.error}>{error}</p>
      <SecondaryButton
        title={isPending ? 'Sending...' : 'Rent Price Acknowledgement'}
        // icon={<ArrowRight size={16} />}
        onClick={handleRentPriceAcknowledgement}
      />
    </div>
  )
}

export default RentPriceAcknowledgement