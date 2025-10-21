import { useState } from 'react';
import styles from './landlordTenants.module.css'
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { useAuth } from '../../../../context/AuthContext';

const LandlordTenants = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);
  const { accessToken } = useAuth();

  const { data, error } = useGetAxios(`/api/user/${accessToken}`, [accessToken]);
  const object = useGetAxios(`/api/landlordtenants/${accessToken}`, [accessToken]);

  // Todo: Fix this so skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  console.log('object', object)

  const properties = data.user.properties
  let tenants = 0

  properties.forEach((property: any) => {
    tenants += property.tenants.length
  })

  

  return (
    <>
      {tenants
        ?
        <div className={styles.container}>
          
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