import styles from './successfulSubscriptionPage.module.css';
import { LANDLORD_ROUTES } from '../../routes/landlordRoutes';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import type { DecodedAccessToken } from '../../interfaces/interfaces';
import { TENANT_ROUTES } from '../../routes/tenantRoutes';

const SuccessfulSubscriptionPage = () => {

  const { accessToken } = useAuth();

  if(!accessToken) return

  const decoded = jwtDecode<DecodedAccessToken>(accessToken);

  const handleClick = () => {
    if(decoded.accountType === 'landlord'){
      window.location.href = LANDLORD_ROUTES.DASHBOARD
    } else if (decoded.accountType === 'tenant'){
      window.location.href = TENANT_ROUTES.DASHBOARD
    } else {
      window.location.href = '/login'
    }
  }
  

  return (
    <div className={styles.container}>
      <h1>✅ Payment Successful</h1>
      <p>Your subscription is now active.</p>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default SuccessfulSubscriptionPage