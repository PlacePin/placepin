import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './portalHeader.module.css';
import { capitalizeWords } from '../../utils/stringUtils';
import { useState } from 'react';
import RemoveLandlordTenant from '../modals/RemoveLandlordTenant';

interface PortalHeaderProps {
  resourcePic: any[],
  numberOfResources: number,
  resourceName: string,
  resourceId: string,
  resourceType: string,
  onClose: () => void,
}

const PortalHeader = ({
  resourcePic,
  numberOfResources,
  resourceName,
  resourceId,
  resourceType,
  onClose,
}: PortalHeaderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const imagesToShow = 5;
  let resourceTypePlural = ''

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? resourcePic.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === resourcePic.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleImages = () => {
    const visible = [];
    const count = Math.min(imagesToShow, resourcePic.length);

    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % resourcePic.length;
      visible.push(
        <div key={index} className={styles.picContainers}>
          {resourcePic[index]}
        </div>
      );
    }
    return visible;
  };

  if (resourceType === 'Property') {
    resourceTypePlural = 'Properties'
  } else if (resourceType === 'Tenant') {
    resourceTypePlural = 'Tenants'
  } else {
    resourceTypePlural = 'N/A'
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.tenantInfo}>
        <h3>{capitalizeWords(resourceName)} • {resourceType}</h3>
        <div className={styles.backSection}>
          <span>{numberOfResources} {resourceTypePlural}</span>
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
        className={styles.removeButton}
        onClick={() => setShowInviteModal(prev => !prev)}
      >
        <span>
          Remove Tenant
        </span>
      </div>
      {showInviteModal && (
        <RemoveLandlordTenant
          onClose={() => setShowInviteModal(prev => !prev)}
          tenantId={resourceId}
        />
      )}
    </section>
  )
}

export default PortalHeader