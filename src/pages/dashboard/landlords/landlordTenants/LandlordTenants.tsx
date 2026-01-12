import { useState } from 'react';
import styles from './landlordTenants.module.css';
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { Info, Plus, User } from 'lucide-react';
import { capitalizeWords, firstLetterCapitalize } from '../../../../utils/stringUtils';
import TenantPortal from './tenantPortal/TenantPortal';
import PortalHeader from '../../../../components/headers/PortalHeader';
import TenantSummary from './tenantPortal/TenantSummary';
import TenantActivity from './tenantPortal/TenantActivity';
import TenantLogbook from './tenantPortal/TenantLogbook';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';

const LandlordTenants = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const { data, error } = useGetAxios(`/api/landlords/tenants`);

  console.log(error)

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  // Todo: Fix this to skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  const tenants = data.tenants
  const numberOfTenants = tenants.length

  const tenantsCards = tenants.map((tenant: any) => {
    const profilePic = tenant.profilePic ?
      <img className={styles.profilePic} src={`${tenant.profilePic}`} alt='Profile Pic' /> :
      <User
        width={150}
        height={200}
        strokeWidth={1}
      />

    return (
      <div
        key={tenant._id}
        className={styles.tenantCards}
      >
        {profilePic}
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

  const profiles = tenants.map((tenant: any) => {
    return tenant.profilePic ? (
      <img
        src={`${tenant.profilePic}`}
        alt='Profile Pic'
        onClick={() => setSelectedTenant(tenant)}
      />
    ) : (
      <User
        strokeWidth={1}
        className={styles.picContainers}
        onClick={() => setSelectedTenant(tenant)}
      />
    )
  })

  return (
    <>
      {selectedTenant ? (
        <TenantPortal>
          <PortalHeader
            resourcePic={profiles}
            numberOfResources={numberOfTenants}
            resourceName={selectedTenant.fullName}
            resourceId={selectedTenant._id}
            resourceType={firstLetterCapitalize(selectedTenant.accountType)}
            onClose={() => setSelectedTenant(null)}
          />
          <div className={styles.portalBody}>
            <TenantSummary
              tenantName={selectedTenant.fullName}
              username={selectedTenant.username}
            />
            <TenantActivity
              rentPayments={selectedTenant.rentPayment}
              maintenanceRequest={selectedTenant.maintenanceRequest}
            />
            <TenantLogbook />
          </div>
        </TenantPortal>
      ) : numberOfTenants
        ? (
          <div className={styles.container}>
            <div className={styles.headerWrapper}>
              <h2>Tenants</h2>
              <PrimaryButton
                title={'Invite Tenant'}
                onClick={() => setShowInviteModal(prev => !prev)}
                icon={<Plus />}
              />
            </div>
            <div className={styles.tenantCardsContainer}>
              {tenantsCards}
            </div>
            {showInviteModal && (
              <InviteTenantModal
                onClose={() => setShowInviteModal(prev => !prev)}
              />
            )}
          </div>
        ) : (
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
        )
      }
    </>
  )
}

export default LandlordTenants
