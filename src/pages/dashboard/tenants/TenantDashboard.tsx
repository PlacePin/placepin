import TenantSidebar from "../../../components/sidebars/tenant/TenantSidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TenantHeader from "../../../components/headers/tenant/TenantHeader";
import styles from './tenantDashboard.module.css';
import { jwtDecode } from "jwt-decode";
import type { DecodedAccessToken } from "../../../interfaces/interfaces";

const TenantDashboard = () => {

  const { accessToken } = useAuth()

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // This is authPayload for a user
  const user = jwtDecode<DecodedAccessToken>(accessToken);

  return (
    <div className={styles.tenantDashboardContainer}>
      <TenantSidebar />
      <div className={styles.tenantHeaderBody}>
        <TenantHeader username={user.fullName} />
        <Outlet />
      </div>
    </div>
  )
}

export default TenantDashboard