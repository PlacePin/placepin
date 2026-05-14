import styles from './tenantSidebar.module.css'
import { NavLink, useLocation } from "react-router-dom";
import { Home, MessageCircle } from 'lucide-react';
import { TENANT_ROUTES } from "../../../routes/tenantRoutes";

const TenantSidebar = () => {
  const location = useLocation();

  const tabs = [
    { path: TENANT_ROUTES.DASHBOARD, text: "Home", icon: <Home size={18} /> },
    { path: TENANT_ROUTES.MESSAGING, text: "Messaging", icon: <MessageCircle size={18} /> },
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
                className={`${styles.sidebarItem} ${location.pathname.includes(tab.path) ? 'active' : ''
                  }`}
              >
                {tab.icon}
                <span className={styles.tabText}>{tab.text}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default TenantSidebar