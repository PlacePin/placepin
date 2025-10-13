import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LandlordSidebar from "../../../components/sidebars/landord/LandlordSidebar";
import LandlordHeader from "../../../components/headers/landlord/LandlordHeader";
import styles from './landlordDashboard.module.css';
import { jwtDecode } from "jwt-decode";

export interface DecodedAccessToken {
  email: string;
  userID: string;
  username: string,
  fullName: string,
  iat: number;
  exp: number;
}

const LandlordDashboard = () => {

  const { accessToken } = useAuth()

  if(!accessToken){
    return <Navigate to="/login" replace />;
  }

  // This is authPayload for a user
  const user = jwtDecode<DecodedAccessToken>(accessToken);

  return (
    <div className={styles.landlordDashboardContainer}>
      <LandlordSidebar />
      <div className={styles.landlordHeaderBody}>
        <LandlordHeader username={user.fullName} />
        <Outlet />
      </div>
    </div>
  )
}

export default LandlordDashboard