import { useState } from 'react';
import styles from './landlordTenantInsights.module.css'
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';

const LandlordTenantInsights = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>No Data</h2>
      <div className={styles.noDataButtonContainer}>
        <button
          className={styles.button}
          onClick={() => setShowInviteModal(prev => !prev)}
        >
          Invite Tenants
        </button>
      </div>
      {showInviteModal && (
        <InviteTenantModal
          onClose={() => setShowInviteModal(prev => !prev)}
        />
      )}
    </div>
  )
}

export default LandlordTenantInsights