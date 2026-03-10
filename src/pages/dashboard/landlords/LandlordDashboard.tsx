import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LandlordSidebar from "../../../components/sidebars/landord/LandlordSidebar";
import LandlordHeader from "../../../components/headers/landlord/LandlordHeader";
import UnauthorizedError from "../errors/UnauthorizedError";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import styles from './landlordDashboard.module.css';
import { jwtDecode } from "jwt-decode";
import type { DecodedAccessToken } from "../../../interfaces/interfaces";

const LandlordDashboard = () => {

  const { accessToken } = useAuth()

  if(!accessToken){
    return <Navigate to="/login" replace />
  }

  // This is authPayload for a user
  const user = jwtDecode<DecodedAccessToken>(accessToken);
  
  if(user.accountType != 'landlord'){
    return(
      <div className={styles.landlordErrorContainer}>
        <UnauthorizedError/>
        <NavLink to= {`/${user.accountType}dashboard`}>
           <PrimaryButton title='Return to Dashboard'/>
        </NavLink>
      </div>
    )
  }
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