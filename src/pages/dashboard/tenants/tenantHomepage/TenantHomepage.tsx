import styles from './tenantHompage.module.css';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import ActivityCard from '../../../../components/cards/tenant/ActivityCard';
import { getOrdinalSuffix } from '../../../../utils/getOrdinalSuffix';
import { capitalizeWords } from '../../../../utils/stringUtils';
import UpdateAddressModal from '../../../../components/modals/UpdateAddressModal';
import { useState } from 'react';

const TenantHomepage = () => {

  const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false);

  const { data, error } = useGetAxios(`/api/users`)

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const rentAmountExpected = data.user.rentAmountExpected;
  const address = data.user.address;

  const handleUpdate = () => {
    setShowUpdateAddressModal(prev => !prev)
  }

  const addressCard = (
    <ActivityCard
      title={'Address'}
      ctaText={'Update Address'}
      infoLabel={'Living'}
      infoValue='More than a place to stay'
      handleClick={handleUpdate}
    >
      <div className={styles.addressContainer}>
        <span className={styles.streetAddress}>
          {capitalizeWords(address.street)}
        </span>
        <p>
          <span>
            {capitalizeWords(address.city)}{', '}
          </span>
          <span>
            {address.state.toUpperCase()}{' '}
          </span>
          <span>
            {address.zip}
          </span>
        </p>
      </div>
    </ActivityCard>
  )

  const rentDueCard = (
    <ActivityCard
      title="Rent Due"
      ctaText="Pay rent"
      infoLabel="Due date"
      infoValue={
        rentAmountExpected.dueDate ?
          `${rentAmountExpected.dueDate}${getOrdinalSuffix(rentAmountExpected.dueDate)} of each month` :
          'N/A'
      }
      handleClick={() => { }}
    >
      <div className={styles.rentAmount}>
        <span className={styles.rentCurrencySymbol}>$</span>
        <span className={styles.rentAmountValue}>
          {rentAmountExpected.amount ? rentAmountExpected.amount.toLocaleString() : 'N/A'}
        </span>
        <span className={styles.rentAmountSuffix}>/mo</span>
      </div>
    </ActivityCard>
  )

  return (
    <div className={styles.landlordHomepageContainer}>
      <h2>
        Upcoming / Recent Activity
      </h2>
      <div className={styles.statsCards}>
        {addressCard}
        {
          rentAmountExpected.amount &&
          rentAmountExpected.dueDate &&
          rentDueCard
        }
      </div>
      {showUpdateAddressModal && (
        <UpdateAddressModal
          street={address.street}
          suite={address.unit}
          city={address.city}
          state={address.state}
          zip={address.zip}
          onClose={handleUpdate}
        />
      )}
    </div>
  )
}

export default TenantHomepage