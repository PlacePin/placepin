import { MessageCircleMore } from 'lucide-react';
import styles from './tenantSummary.module.css';
import { useState } from 'react';
import { capitalizeWords } from '../../../../../utils/stringUtils';

interface TenantSummaryProps {
  tenantName: string,
}

const TenantSummary = ({
  tenantName
}: TenantSummaryProps) => {
  const [showContact, setShowContact] = useState(false);

  const ContactTenant = () => {
    return (
      <div className={styles.contact}>
        <span>{capitalizeWords(tenantName)}</span>
        <MessageCircleMore
          className={styles.messageCircle}
        />
      </div>
    )
  }

  return (
    <div
      className={`${styles.wrapperDisplays} ${styles.summaryWrapper}`}
    >
      <div
        className={styles.photoSection}
        onMouseEnter={() => setShowContact(true)}
        onMouseLeave={() => setShowContact(false)}
      >
        <img
          src='/housing.jpg'
          alt='profile pic'
          className={styles.profilePic}
        />
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
            <span className={styles.defaultCardSpanNum}>{300}</span>
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
    </div>
  )
}
export default TenantSummary
