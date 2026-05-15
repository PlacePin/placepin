import { useState, useEffect, useRef } from "react";
import styles from './tenantHeader.module.css';
import { Settings } from 'lucide-react';
import DropdownModal from '../../modals/DropdownModal';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { TENANT_ROUTES } from "../../../routes/tenantRoutes";
import { capitalizeWords } from "../../../utils/stringUtils";
import axiosInstance from "../../../utils/axiosInstance";

interface TenantHeaderProps {
  username: string,
}

const TenantHeader = ({ username }: TenantHeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tier, setTier] = useState('');
  const [sponsorshipEndsAt, setSponsorshipEndsAt] = useState<string | null>(null);
  const [sponsorshipExpired, setSponsorshipExpired] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  let upperCaseUsername: string;

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

  const handleViewPlans = () => {
    localStorage.setItem('PlacePinSettingsTab', 'subscriptions');
    navigate(TENANT_ROUTES.SETTINGS);
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
    const res = axiosInstance.get(`/api/subscription/tier/`, {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    })

    res.then(data => {
      const subTier = data.data.subscriptionTier
      setTier(capitalizeWords(subTier))
    })
  }, [accessToken])

  useEffect(() => {
    axiosInstance
      .get(`/api/settings/stripe/subscription-status`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(({ data }) => {
        setSponsorshipEndsAt(data.sponsorshipEndsAt ?? null);
        setSponsorshipExpired(!!data.sponsorshipExpired);
      })
      .catch(err => console.error('Failed to fetch sponsorship status', err))
  }, [accessToken])

  !username
    ? upperCaseUsername = 'No Username'
    : upperCaseUsername = capitalizeWords(username)

  return (
    <div className={styles.headerWrapper} ref={wrapperRef}>
      {sponsorshipEndsAt && (
        <div className={styles.sponsorshipBanner}>
          <span className={styles.sponsorshipMessage}>
            {sponsorshipExpired
              ? 'Your landlord sponsorship has ended — choose a plan to keep your benefits.'
              : `Your landlord sponsorship ends on ${new Date(sponsorshipEndsAt).toLocaleDateString()}. After that you'll need to choose a plan.`}
          </span>
          <button
            type="button"
            className={styles.sponsorshipButton}
            onClick={handleViewPlans}
          >
            View plans
          </button>
        </div>
      )}
      <div className={styles.tenantHeaderContainer}>
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
    </div>
  )
}

export default TenantHeader