import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import styles from './portalHeader.module.css';
import { capitalizeWords } from '../../../../../utils/stringUtils';
import { useState } from 'react';
import InviteTenantModal from '../../../../../components/modals/InviteTenantModal';

interface PortalHeaderProps {
  profilePic: any[],
  numberOfTenants: number,
  tenantName: string,
  onClose: () => void,
}

const PortalHeader = ({
  profilePic,
  numberOfTenants,
  tenantName,
  onClose,
}: PortalHeaderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const imagesToShow = 5;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? profilePic.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === profilePic.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleImages = () => {
    const visible = [];
    const count = Math.min(imagesToShow, profilePic.length);

    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % profilePic.length;
      visible.push(
        <div key={index} className={styles.picContainers}>
          {profilePic[index]}
        </div>
      );
    }
    return visible;
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.tenantInfo}>
        <h3>{capitalizeWords(tenantName)} • Tenant</h3>
        <div className={styles.backSection}>
          <span>{numberOfTenants} Tenants</span>
          <button
            className={styles.backButton}
            onClick={onClose}
          >
            <ChevronLeft
              size={20}
            />
            <span>Back</span>
          </button>
        </div>

      </div>
      <div
        className={styles.picWrapper}
      >
        <ChevronLeft
          size={24}
          className={styles.chevron}
          onClick={handlePrevious}
        />
        {getVisibleImages()}
        <ChevronRight
          size={24}
          className={styles.chevron}
          onClick={handleNext}
        />
      </div>
      <div
        className={styles.inviteButton}
        onClick={() => setShowInviteModal(prev => !prev)}
      >
        <span>
          Delete Tenant
        </span>
        <Trash2 size={24}/>
      </div>
      {showInviteModal && (
        <InviteTenantModal
          onClose={() => setShowInviteModal(prev => !prev)}
        />
      )}
    </section>
  )
}

export default PortalHeader