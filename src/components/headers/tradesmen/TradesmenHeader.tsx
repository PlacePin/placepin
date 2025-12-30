import { useState, useEffect, useRef } from "react";
import styles from './tradesmenHeader.module.css';
import { Settings } from 'lucide-react';
import DropdownModal from '../../modals/DropdownModal';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { capitalizeWords } from "../../../utils/stringUtils";
import ThemeToggle from "../../../themes/ThemeToggle";
import { TRADESMEN_ROUTES } from "../../../routes/tradesmenRoutes";

interface TradesmenHeaderProps {
  username: string,
}

const TradesmenHeader = ({
  username
}: TradesmenHeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside the modal and header to close: bug fix
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
    navigate(TRADESMEN_ROUTES.SETTINGS)
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
  const { logout } = useAuth()

  const upperCaseUsername = capitalizeWords(username)

  return (
    <div className={styles.tradesmenHeaderContainer} ref={wrapperRef}>
      <h2 className={styles.headerTitle}>
        Welcome, {upperCaseUsername}
      </h2>
      <div className={styles.theme}>
        <ThemeToggle />
        <Settings
          size={30}
          className={styles.settingsIcon}
          onClick={handleToggle}
        />
      </div>
      {showDropdown && (
        <DropdownModal
          selections={['Settings', 'Sign out']}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}

export default TradesmenHeader
