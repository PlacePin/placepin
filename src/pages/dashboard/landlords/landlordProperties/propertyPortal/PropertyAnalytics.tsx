import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Tooltip from '../../../../../components/tooltips/Tooltip';
import styles from './propertyAnalytics.module.css';
import EditFinancialsModal from '../../../../../components/modals/EditFinancialsModal';

interface PropertyAnalyticsProps {
  propertyId: string,
  onPropertyUpdated: () => void,
  outstandingPrincipal: number,
  mortgage: number,
  interestRate: number,
  projectedEquity: number,
}

const PropertyAnalytics = ({
  propertyId,
  onPropertyUpdated,
  outstandingPrincipal,
  mortgage,
  interestRate,
  projectedEquity,
}: PropertyAnalyticsProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h4>Financials</h4>
        <button
          className={styles.editButton}
          onClick={() => setShowEditModal(true)}
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>
      {showEditModal && (
        <EditFinancialsModal
          propertyId={propertyId}
          onClose={() => setShowEditModal(false)}
          onFinancialsUpdated={() => {
            onPropertyUpdated();
            setShowEditModal(false);
          }}
          outstandingPrincipal={outstandingPrincipal}
          mortgage={mortgage}
          interestRate={interestRate}
          projectedEquity={projectedEquity}
        />
      )}
      <div className={styles.analyticsWrapper}>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {outstandingPrincipal ? `$${outstandingPrincipal.toLocaleString('en-US')}` : 'N/A'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'bottom'}
          >
            <p>Outstanding Principal</p>
          </Tooltip>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {mortgage ? `$${mortgage.toLocaleString('en-US')}` : 'N/A'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'bottom'}
          >
            <p>Mortgage</p>
          </Tooltip>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {interestRate ? `${interestRate}%` : 'N/A'}
          </span>
          <p>
            Interest Rate
          </p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {projectedEquity ? `${projectedEquity.toLocaleString('en-US')}` : 'N/A'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'bottom'}
          >
            <p>
              Projected Equity
            </p>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;
