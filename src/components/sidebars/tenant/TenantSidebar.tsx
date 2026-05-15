import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from './tenantSidebar.module.css';
import { Home, MessageCircle, Menu, X } from 'lucide-react';
import { TENANT_ROUTES } from "../../../routes/tenantRoutes";

const TenantSidebar = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const tabs = [
    { path: TENANT_ROUTES.DASHBOARD, text: "Home", icon: <Home size={18} /> },
    { path: TENANT_ROUTES.MESSAGING, text: "Messaging", icon: <MessageCircle size={18} /> },
  ];

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <aside className={styles.sideBarContainer}>
      <div className={styles.logoAndTabs}>
        <div className={styles.mobileTopRow}>
          <NavLink className={styles.navLink} to="">
            <h1 className={styles.logoText}>PlacePin</h1>
          </NavLink>
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls="tenant-mobile-nav"
          >
            {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div
          id="tenant-mobile-nav"
          className={`${styles.tabs} ${isMobileNavOpen ? styles.mobileOpen : ''}`}
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={styles.navLink}
            >
              <div
                className={`${styles.sidebarItem} ${
                  (tab.path === TENANT_ROUTES.DASHBOARD
                    ? location.pathname === tab.path
                    : location.pathname.includes(tab.path))
                    ? styles.active : ''
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
