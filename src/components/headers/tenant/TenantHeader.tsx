import { useState, useEffect, useRef } from "react";
import styles from './tenantHeader.module.css';
import { Settings } from 'lucide-react';
import DropdownModal from '../../modals/DropdownModal';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { TENANT_ROUTES } from "../../../routes/tenantRoutes";
import { capitalizeWords } from "../../../utils/stringUtils";
import axios from "axios";

interface TenantHeaderProps {
  username: string,
}

const TenantHeader = ({ username }: TenantHeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tier, setTier] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside the modal and header to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignout = () => {
    logout()
    navigate('/')
  }

  const handleSettings = () => {
    navigate(TENANT_ROUTES.SETTINGS)
  }

  const handleSelect = (selection: string) => {
    if (selection === "Sign out") {
      handleSignout()
    } else if (selection === "Settings") {
      handleSettings()
    }
    setShowDropdown(false);
  };

  const handleToggle = () => setShowDropdown(prev => !prev);

  const navigate = useNavigate()
  const { logout, accessToken } = useAuth()

  useEffect(() => {
    const res = axios.get(`/api/subscription/tier/${accessToken}`)
    res.then(data => {
      const subTier = data.data.subscriptionTier
      setTier(capitalizeWords(subTier))
    })
  }, [accessToken])

  const upperCaseUsername = capitalizeWords(username)

  return (
    <div className={styles.tenantHeaderContainer} ref={wrapperRef}>
      <h2 className={styles.headerTitle}>
        Welcome, {upperCaseUsername}
      </h2>
      <div className={styles.settingsWrapper}>
        <p className={styles.tiers}>Tier: <span className={styles.span}>{tier}</span></p>
        <Settings
          size={30}
          color={'black'}
          className={styles.settingsIcon}
          onClick={handleToggle}
        />
        {showDropdown && (
          <DropdownModal
            selections={['Settings', 'Sign out']}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  )
}

export default TenantHeader