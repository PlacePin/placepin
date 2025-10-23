import { useState } from 'react';
import styles from './landlordProperties.module.css';
import AddPropertyModal from '../../../../components/modals/AddPropertyModal';

const LandlordProperties = () => {

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>No Data</h2>
      <div className={styles.noDataButtonContainer}>
        <button
          className={styles.button}
          onClick={() => setShowAddPropertyModal(prev => !prev)}
        >
          Add Property
        </button>
      </div>
      {showAddPropertyModal && (
        <AddPropertyModal
          onClose={() => setShowAddPropertyModal(prev => !prev)}
        />
      )}
    </div>
  )
}

export default LandlordProperties