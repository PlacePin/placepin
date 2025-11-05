import { useState } from 'react';
import styles from './landlordTenantInsights.module.css'
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';

const LandlordTenantInsights = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data, error } = useGetAxios(`/api/landlords/tenants`);

  // Todo: Fix this so skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const isLoading = !data;
  const hasError = !!error;

  const tenants = data.tenants

  console.log(tenants)

  return (
    <>
      {isLoading && <div></div>}
      {hasError && <div></div>}
      {tenants.length
        ?
        <div className={styles.container}>
          <h2>Tenant Insights</h2>
          <div>
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

export default LandlordTenantInsights