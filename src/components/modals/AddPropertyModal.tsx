import FormModal from "./FormModal";
import styles from './addPropertyModal.module.css';

interface AddPropertyModalProps {
  onClose?: () => void;
}

const AddPropertyModal = ({ onClose }: AddPropertyModalProps) => {
  
  const handleAddPropertySubmit = () => {

  }

  return(
    <FormModal title='Add Property' onClose={onClose}>
      <form onSubmit={handleAddPropertySubmit}>
        <div className={styles.formContainer}>
          <label 
          htmlFor='propertyName'
          className={styles.labels}
          >
            Property Name
          </label>
          <input
            type="text"
            id='propertyName'
            placeholder='Childhood Home'
            // onChange={(e) => setTenantName(e.target.value)}
            className={styles.inputFields}
            required
          />
          <label 
          htmlFor='propertyAddress'
          className={styles.labels}
          >
            Property Address
          </label>
          <input
            type="text"
            id='propertyAddress'
            placeholder='123 Main St. Boston MA, 02136'
            // onChange={(e) => setTenantAddress(e.target.value)}
            className={styles.inputFields}
            required
          />
          <label 
          htmlFor='apartmentUnits'
          className={styles.labels}
          >
            Apartment Units
          </label>
          <input
            type="email"
            id='apartmentUnits'
            placeholder='Number of Units'
            // onChange={(e) => setTenantEmail(e.target.value)}
            className={styles.inputFields}
            required
          />
        </div>
        <button className={styles.button}>
          Add Property!
        </button>
      </form>
    </FormModal>
  )
}

export default AddPropertyModal