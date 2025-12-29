import { Info, User } from 'lucide-react';
import styles from './landlordMaintenance.module.css';
import { capitalizeWords } from '../../../../utils/stringUtils';

const LandlordMaintenance = () => {

  const tradesmenCards = <div
        // key={tenant._id}
        className={styles.tenantCards}
      >
        <User
          width={150}
          height={200}
          strokeWidth={1}
        />
        <div
          className={styles.descriptionWrapper}
        >
          <p>
            {/* {capitalizeWords(tenant.fullName)} */}
          </p>
          <button
            className={styles.infoButton}
            // onClick={() => setSelectedTenant(tenant)}
          >
            <Info
              size={18}
              className={styles.infoIcon}
            />
            Info
          </button>
        </div>
      </div>

  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>Hire a Tradesman</h2>
      <div className={styles.noDataButtonContainer}>
        <button className={styles.button}>Find Tradesman</button>
      </div>
    </div>
  )
}

export default LandlordMaintenance