import styles from './generalSetting.module.css';
import BasicInfo from './basicInfomation/BasicInfo';
import BankSettings from './bankSettings/BankSettings';
import { useState, useEffect } from 'react';
import Subscriptions from './subscriptionSettings/Subscriptions';
import TenantPassport from './passport/TenantPassport';
import { useAuth } from '../../context/AuthContext';
import type { DecodedAccessToken } from '../../interfaces/interfaces';
import { jwtDecode } from 'jwt-decode';

type TabConfig = {
  id: 'basic' | 'bank' | 'subscriptions' | 'tenant-passport';
  label: string;
  role?: 'tenant' | 'landlord';
};

const tabs: TabConfig[] = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'bank', label: 'Bank Settings' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'tenant-passport', label: 'Tenant Passport', role: 'tenant' },
] as const;

type Tab = TabConfig['id'];

const GeneralSettings = () => {

  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('PlacePinSettingsTab');
    return (saved as Tab) || 'basic';
  });

  useEffect(() => {
    localStorage.setItem('PlacePinSettingsTab', activeTab);
  }, [activeTab]);

  if (!accessToken) return null

  const user = jwtDecode<DecodedAccessToken>(accessToken);

  return (
    <div className={styles.entireContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>General Settings</h2>
        <p className={styles.pageSubtitle}>Manage your account preferences</p>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.settingsNav}>
          {tabs
          .filter(tab => !tab.role || tab.role === user.accountType)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                styles.navItem,
                activeTab === tab.id ? styles.activeTab : '',
              ].filter(Boolean).join(' ')}
            >
              <span className={styles.navLabel}>{tab.label}</span>
              {activeTab === tab.id && <span className={styles.navIndicator} />}
            </button>
          ))}
        </div>
        <div className={styles.mainContent}>
          {activeTab === 'basic' && <BasicInfo />}
          {activeTab === 'bank' && <BankSettings />}
          {activeTab === 'subscriptions' && <Subscriptions />}
          {
            user.accountType === 'tenant' &&
            activeTab === 'tenant-passport' &&
            <TenantPassport />
          }
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;