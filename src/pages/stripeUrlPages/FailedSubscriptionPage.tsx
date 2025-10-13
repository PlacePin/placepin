import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import styles from './failedSubscriptionPage.module.css'
import type { DecodedAccessToken } from '../../interfaces/interfaces';
import { LANDLORD_ROUTES } from '../../routes/landlordRoutes';
import { TENANT_ROUTES } from '../../routes/tenantRoutes';

const FailedSubscription = () => {

  const { accessToken } = useAuth();

  if (!accessToken) return

  const decoded = jwtDecode<DecodedAccessToken>(accessToken);

  const handleClick = () => {
    if (decoded.accountType === 'landlord') {
      window.location.href = LANDLORD_ROUTES.SETTINGS
    } else if (decoded.accountType === 'tenant') {
      window.location.href = TENANT_ROUTES.SETTINGS
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <div className={styles.container}>
      <h1>Payment Canceled</h1>
      <p>No charges were made.</p>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        Try Again
      </button>
    </div>
  )
}

export default FailedSubscription