import styles from './tradesmenSidebar.module.css'
import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle } from 'lucide-react';
import { TRADESMEN_ROUTES } from '../../../routes/tradesmenRoutes';

const TradesmenSidebar = () => {
  const location = useLocation();

  const tabs = [
    { path: TRADESMEN_ROUTES.MESSAGING, text: "Messaging", icon: <MessageCircle size={18} /> },
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
                <span style={{ marginLeft: "0.75rem" }}>{tab.text}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default TradesmenSidebar
