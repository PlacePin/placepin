import { ArrowRight, Gift, MessageCircleMore } from 'lucide-react';
import styles from './tenantSummary.module.css';
import { useState } from 'react';
import { capitalizeWords } from '../../../../../utils/stringUtils';
import ComposeModal from '../../../../../components/modals/ComposeModal';
import SendGiftModal from '../../../../../components/modals/SendGiftModal';
import { calculateDaysFromDate } from '../../../../../utils/calculateDaysFromDate';
import PrimaryButton from '../../../../../components/buttons/PrimaryButton';
import emptyProfile from '../../../../../assets/emptyProfile.webp';

interface TenantSummaryProps {
  tenantId: string;
  tenantName: string,
  username: string,
  profilePic: string,
  moveInDate: string,
  totalExpenses: number,
  rentAmountExpected: number
}

const TenantSummary = ({
  tenantId,
  tenantName,
  username,
  profilePic,
  moveInDate,
  totalExpenses,
  rentAmountExpected
}: TenantSummaryProps) => {
  const [showContact, setShowContact] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

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
        src={emptyProfile}
        alt='profile pic'
        className={styles.profilePic}
      />
    )
  )

  return (
    <div
      className={styles.wrapperDisplaysContainer}
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
            <span className={styles.defaultCardSpanNum}>{`$${Math.round(totalExpenses)}`}</span>
            <span className={styles.defaultCardSpanText}>Expenses</span>
          </div>
        </div>
        <div>
          <div
            className={`${styles.defaultCardStyles} ${styles.rent}`}
          >
            <span className={styles.defaultCardSpanNum}>{`$${rentAmountExpected}`}</span>
            <span className={styles.defaultCardSpanText}>Rent Amount Expected</span>
          </div>
        </div>
      </div>
      <div className={`${styles.defaultCardStyles} ${styles.misc}`}>
        <div className={styles.miscHeader}>
          <Gift className={styles.giftIcon} />
          <span className={`${styles.badge} ${styles.badgePrezzee}`}>Prezzee</span>
        </div>
        <div className={styles.miscContent}>
          <h3 className={styles.miscTitle}>Gift a Perk</h3>
          <p className={styles.miscDescription}>Send a digital gift card; your tenant gets a secure link in Messages.</p>
        </div>
        <PrimaryButton
          title={'Send Gift'}
          icon={<ArrowRight size={16} />}
          onClick={() => setShowGiftModal(true)}
        />
      </div>
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(prev => !prev)}
          username={username}
        />
      )}
      {showGiftModal && (
        <SendGiftModal
          tenantId={tenantId}
          tenantName={capitalizeWords(tenantName)}
          onClose={() => setShowGiftModal(false)}
        />
      )}
    </div>
  )
}
export default TenantSummary
