import { MessageCircleMore } from 'lucide-react';
import styles from './tenantSummary.module.css';
import { useState } from 'react';
import { capitalizeWords } from '../../../../../utils/stringUtils';
import ComposeModal from '../../../../../components/modals/ComposeModal';
import { calculateDaysFromDate } from '../../../../../utils/calculateDaysFromDate';

interface TenantSummaryProps {
  tenantName: string,
  username: string,
  profilePic: string,
  moveInDate: string,
}

const TenantSummary = ({
  tenantName,
  username,
  profilePic,
  moveInDate
}: TenantSummaryProps) => {
  const [showContact, setShowContact] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const daysAsTenant = calculateDaysFromDate(moveInDate);

  const ContactTenant = () => {
    return (
      <div className={styles.contact}>
        <span>{capitalizeWords(tenantName)}</span>
        <MessageCircleMore
          className={styles.messageCircle}
          onClick={() => setShowCompose(prev => !prev)}
        />
      </div>
    )
  }

  const profilePicture = (
    profilePic ? (
      <img
        src={profilePic}
        alt='profile pic'
        className={styles.profilePic}
      />
    ) : (
      <img
        src='/emptyProfile.png'
        alt='profile pic'
        className={styles.profilePic}
      />
    )
  )

  return (
    <div
      className={styles.wrapperDisplays}
    >
      <div
        className={styles.photoSection}
        onMouseEnter={() => setShowContact(true)}
        onMouseLeave={() => setShowContact(false)}
      >
        {profilePicture}
        {showContact && <ContactTenant />}
      </div>
      <div
        className={styles.wrapperDisplays}
      >
        <div
          className={styles.tenantDetails}
        >
          <div
            className={`${styles.defaultCardStyles} ${styles.daysAsTenant}`}
          >
            <span className={styles.defaultCardSpanNum}>{daysAsTenant}</span>
            <span className={styles.defaultCardSpanText}>Days as Tenant</span>
          </div>
          <div
            className={`${styles.defaultCardStyles} ${styles.expenses}`}
          >
            <span className={styles.defaultCardSpanNum}>{`$${Math.round(1579.82)}`}</span>
            <span className={styles.defaultCardSpanText}>Expenses</span>
          </div>
        </div>
        <div>
          <div
            className={`${styles.defaultCardStyles} ${styles.rent}`}
          >
            <span className={styles.defaultCardSpanNum}>{`$${3800}`}</span>
            <span className={styles.defaultCardSpanText}>Rent Payment</span>
          </div>
        </div>
      </div>
      <div
        className={`${styles.defaultCardStyles} ${styles.misc}`}
      >
        Promos
      </div>
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(prev => !prev)}
          username={username}
        />
      )}
    </div>
  )
}
export default TenantSummary
