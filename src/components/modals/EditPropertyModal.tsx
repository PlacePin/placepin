import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './addReceiptModal.module.css';
import FormModal from './FormModal';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface EditPropertyModalProps {
  onClose: () => void;
  onPropertyUpdated: () => void;
  propertyId: string;
  lotSize?: number;
  trashPickup?: string;
  electricianLastUpdate?: Date | null;
  boilerLastUpdated?: Date | null;
  closestPublicCommutes?: string;
  averageUnitSize?: number;
}

const EditPropertyModal = ({
  onClose,
  onPropertyUpdated,
  propertyId,
  lotSize,
  trashPickup,
  electricianLastUpdate,
  boilerLastUpdated,
  closestPublicCommutes,
  averageUnitSize,
}: EditPropertyModalProps) => {
  const { accessToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const toDateInputValue = (date?: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    lotSize: lotSize ?? '',
    trashPickup: trashPickup ?? '',
    electricianLastUpdate: toDateInputValue(electricianLastUpdate),
    boilerLastUpdated: toDateInputValue(boilerLastUpdated),
    closestPublicCommutes: closestPublicCommutes ?? '',
    averageUnitSize: averageUnitSize ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        '/api/landlords/properties',
        {
          propertyId,
          propertyDetails: {
            lotSize: formData.lotSize !== '' ? Number(formData.lotSize) : undefined,
            trashPickup: formData.trashPickup || undefined,
            electricianLastUpdate: formData.electricianLastUpdate || undefined,
            boilerLastUpdated: formData.boilerLastUpdated || undefined,
            closestPublicCommutes: formData.closestPublicCommutes || undefined,
            averageUnitSize: formData.averageUnitSize !== '' ? Number(formData.averageUnitSize) : undefined,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onPropertyUpdated();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.message ?? 'Something went wrong.');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <FormModal title="Edit Property Details" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="lotSize" className={styles.label}>
              Lot Size (sq ft)
            </label>
            <input
              type="number"
              id="lotSize"
              name="lotSize"
              value={formData.lotSize}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. 2500"
              min="0"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="averageUnitSize" className={styles.label}>
              Average Unit Size (sq ft)
            </label>
            <input
              type="number"
              id="averageUnitSize"
              name="averageUnitSize"
              value={formData.averageUnitSize}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. 800"
              min="0"
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="trashPickup" className={styles.label}>
            Trash Pickup
          </label>
          <select
            id="trashPickup"
            name="trashPickup"
            value={formData.trashPickup}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Select a day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="closestPublicCommutes" className={styles.label}>
            Closest Public Commutes
          </label>
          <input
            type="text"
            id="closestPublicCommutes"
            name="closestPublicCommutes"
            value={formData.closestPublicCommutes}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. Green Line – 0.3 mi"
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="electricianLastUpdate" className={styles.label}>
              Electrician Last Updated
            </label>
            <input
              type="date"
              id="electricianLastUpdate"
              name="electricianLastUpdate"
              value={formData.electricianLastUpdate}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="boilerLastUpdated" className={styles.label}>
              Boiler Last Updated
            </label>
            <input
              type="date"
              id="boilerLastUpdated"
              name="boilerLastUpdated"
              value={formData.boilerLastUpdated}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </FormModal>
  );
};

export default EditPropertyModal;
