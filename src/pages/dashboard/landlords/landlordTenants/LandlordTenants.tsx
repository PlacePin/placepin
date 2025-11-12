import { useState } from 'react';
import styles from './landlordTenants.module.css';
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { Info } from 'lucide-react';
import { capitalizeWords } from '../../../../utils/stringUtils';
import TenantPortal from './tenantPortal/TenantPortal';
import PortalHeader from './tenantPortal/PortalHeader';
import TenantSummary from './tenantPortal/Tenantsummary';

const LandlordTenants = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const { data, error } = useGetAxios(`/api/landlords/tenants`);

  // Todo: Fix this so skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  console.log(data)

  const tenants = data.tenants
  const numberOfTenants = tenants.length

  const tenantsCards = tenants.map((tenant: any) => {
    return (
      <div
        key={tenant._id}
        className={styles.tenantCards}
      >
        <div>
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
            onClick={() => setSelectedTenant(tenant)}
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
      {selectedTenant ? (
        <TenantPortal>
          <PortalHeader
            profilePic={[
              <img src='/emptyProfile.png' />,
              <img src='/charts.png' />,
              <img src='/emptyProfile.png' />,
              <img src='/triplex.png' />,
              <img src='/emptyProfile.png' />,
              <img src='/groupPhoto.png' />,
              <img src='/housing.jpg' />
            ]}
            numberOfTenants={numberOfTenants}
            tenantName={selectedTenant.fullName}
            onClose={() => setSelectedTenant(null)}
          />
          <div className={styles.portalBody}>
            <TenantSummary />
            <div>bbbbb</div>
            <div>ccccc</div>
          </div>
        </TenantPortal>) : numberOfTenants
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