import styles from './generalSetting.module.css';
import BasicInfo from './basicInfomation/BasicInfo';
import BankSettings from './bankSettings/BankSettings';
import { useState, useEffect } from 'react';
import Subscriptions from './subscriptionSettings/Subscriptions';
import TenantPassport from './passport/TenantPassport';

const tabs = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'bank', label: 'Bank Settings' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'tenant-passport', label: 'Tenant Passport' },
] as const;

type Tab = typeof tabs[number]['id'];

const GeneralSettings = () => {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('PlacePinSettingsTab');
    return (saved as Tab) || 'basic';
  });

  useEffect(() => {
    localStorage.setItem('PlacePinSettingsTab', activeTab);
  }, [activeTab]);

  return (
    <div className={styles.entireContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>General Settings</h2>
        <p className={styles.pageSubtitle}>Manage your account preferences</p>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.settingsNav}>
          {tabs.map((tab) => (
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
          {activeTab === 'tenant-passport' && <TenantPassport />}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;