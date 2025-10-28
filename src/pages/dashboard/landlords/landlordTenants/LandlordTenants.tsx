import { useState } from 'react';
import styles from './landlordTenants.module.css';
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { Info } from 'lucide-react';
import { capitalizeWords } from '../../../../utils/stringUtils';

const LandlordTenants = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data, error } = useGetAxios(`/api/landlords/tenants`);

  // Todo: Fix this so skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const tenants = data.tenants

  const tenantsCards = tenants.map((tenant: any, i: number) => {
    return (
      <div
        key={i}
        className={styles.tenantCards}
      >
        <div
          className={styles.photoWrapper}
        >
          <img
            src='/emptyProfile.png'
            alt='tenant photo'
            width={150}
            height={200}
          />
        </div>
        <div
          className={styles.descriptionWrapper}
        >
          <p>
            {capitalizeWords(tenant.fullName)}
          </p>
          <button
            className={styles.infoButton}
          >
            <Info
            size={18}
            className={styles.infoIcon}
            />
            Info
          </button>
        </div>
      </div>
    )
  })

  return (
    <>
      {tenants.length
        ?
        <div className={styles.container}>
          <h2>Tenants</h2>
          <div className={styles.tenantCardsContainer}>
            {tenantsCards}
          </div>
        </div>
        :
        <div>
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
      }
    </>
  )
}

export default LandlordTenants