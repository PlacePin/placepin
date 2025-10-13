import styles from './generalSetting.module.css';
import BasicInfo from './basicInfomation/BasicInfo';
import BankSettings from './bankSettings/BankSettings';
import { useState } from 'react';
import Subscriptions from './subscriptionSettings/Subscriptions';

const GeneralSettings = () => {

  const [activeTab, setActiveTab] = useState<'basic' | 'bank' | 'subscriptions'>('basic');

  return (
    <div className={styles.entireContainer}>
      <h2>
        General Settings
      </h2>
      <div className={styles.innerContainer}>
        <div className={styles.settingsNav}>
          <p
            onClick={() => setActiveTab('basic')}
            className={activeTab === 'basic' ? styles.activeTab : ''}
          >
            Basic Information
          </p>
          <p
            onClick={() => setActiveTab('bank')}
            className={activeTab === 'bank' ? styles.activeTab : ''}
          >
            Bank Settings
          </p>
          <p
            onClick={() => setActiveTab('subscriptions')}
            className={activeTab === 'subscriptions' ? styles.activeTab : ''}
          >
            Subscriptions
          </p>
        </div>
        <div className={styles.mainContent}>
          {activeTab === 'basic' && <BasicInfo />}
          {activeTab === 'bank' && <BankSettings />}
          {activeTab === 'subscriptions' && <Subscriptions />}
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings