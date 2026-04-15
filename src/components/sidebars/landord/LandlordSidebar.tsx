import { NavLink, useLocation } from "react-router-dom";
import styles from './landlordSidebar.module.css';
import { Home, Users, MessageCircle, BarChart, Briefcase, Receipt, Fence } from 'lucide-react';
import { LANDLORD_ROUTES } from "../../../routes/landlordRoutes";

const LandlordSidebar = () => {
  const location = useLocation();

  const tabs = [
    { path: LANDLORD_ROUTES.DASHBOARD, text: "Home", icon: <Home size={18} /> },
    { path: LANDLORD_ROUTES.PROPERTIES, text: "Properties", icon: <Fence size={18} /> },
    { path: LANDLORD_ROUTES.TENANTS, text: "Tenants", icon: <Users size={18} /> },
    { path: LANDLORD_ROUTES.MESSAGING, text: "Messaging", icon: <MessageCircle size={18} /> },
    { path: LANDLORD_ROUTES.INSIGHTS, text: "Tenant Insights", icon: <BarChart size={18} /> },
    { path: LANDLORD_ROUTES.MAINTENANCE, text: "Maintenance", icon: <Briefcase size={18} /> },
    { path: LANDLORD_ROUTES.RECEIPT, text: "Receipts", icon: <Receipt size={18} /> },
  ];

  return (
    <aside className={styles.sideBarContainer}>
      <div className={styles.logoAndTabs}>
        <NavLink className={styles.navLink} to="">
          <h1 className={styles.logoText}>PlacePin</h1>
        </NavLink>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={styles.navLink}
            >
              <div
                className={`${styles.sidebarItem} ${
                  (tab.path === LANDLORD_ROUTES.DASHBOARD
                    ? location.pathname === tab.path
                    : location.pathname.includes(tab.path))
                    ? styles.active : ''
                  }`}
              >
                {tab.icon}
                <span>{tab.text}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LandlordSidebar;
