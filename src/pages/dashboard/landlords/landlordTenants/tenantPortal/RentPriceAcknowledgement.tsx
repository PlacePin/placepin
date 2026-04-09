import { CircleDollarSign } from 'lucide-react';
import styles from './rentPriceAcknowledgement.module.css';
import SecondaryButton from '../../../../../components/buttons/SecondaryButton';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
<<<<<<< HEAD
import axios from 'axios';

interface RentPriceAcknowledgementProps {
  tenantId: string
}

const RentPriceAcknowledgement = ({
  tenantId
}: RentPriceAcknowledgementProps) => {

  interface RentPriceAgreement {
    tenantId: string,
=======
import type { AxiosError } from 'axios';
import axios from 'axios';

const RentPriceAcknowledgement = () => {

  interface RentPriceAcknowledgement {
>>>>>>> 5d11b355e87146c8397721faaeadf23ba7b0b41f
    rentPrice: number,
    acknowledged: boolean
  }

  const { accessToken } = useAuth();

<<<<<<< HEAD
  const [rent, setRent] = useState<RentPriceAgreement>({
    tenantId,
=======
  const [rent, setRent] = useState<RentPriceAcknowledgement>({
>>>>>>> 5d11b355e87146c8397721faaeadf23ba7b0b41f
    rentPrice: 0,
    acknowledged: false
  });
  const [isPending, setIsPending] = useState(false);
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);

  const handleRentPriceAcknowledgement = async () => {
    setIsPending(true);
=======
  const [error, setError] = useState<AxiosError | Error | null>(null);

  const handleRentPriceAcknowledgement = async () => {
    setIsPending(true)
>>>>>>> 5d11b355e87146c8397721faaeadf23ba7b0b41f
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
<<<<<<< HEAD
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
=======

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
>>>>>>> 5d11b355e87146c8397721faaeadf23ba7b0b41f
      }
    } finally {
      setIsPending(false);
    }
  }

<<<<<<< HEAD
  console.log('error state', error)

=======
>>>>>>> 5d11b355e87146c8397721faaeadf23ba7b0b41f
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
<<<<<<< HEAD
          tenantId,
=======
>>>>>>> 5d11b355e87146c8397721faaeadf23ba7b0b41f
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