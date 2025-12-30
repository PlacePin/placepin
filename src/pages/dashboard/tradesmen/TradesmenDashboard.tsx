import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { DecodedAccessToken } from "../../../interfaces/interfaces";
import styles from './tradesmenDashboard.module.css';
import TradesmenSidebar from "../../../components/sidebars/tradesmen/TradesmenSidebar";
import TradesmenHeader from "../../../components/headers/tradesmen/TradesmenHeader";

const TradesmenDashboard = () => {
   const { accessToken } = useAuth()

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // This is authPayload for a user
  const user = jwtDecode<DecodedAccessToken>(accessToken);

  return (
    <div className={styles.tradesmenDashboardContainer}>
      <TradesmenSidebar />
      <div className={styles.tradesmenHeaderBody}>
        <TradesmenHeader username={user.fullName} />
        <Outlet />
      </div>
    </div>
  )
}

export default TradesmenDashboard