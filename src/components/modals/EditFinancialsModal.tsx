import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './addReceiptModal.module.css';
import FormModal from './FormModal';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface EditFinancialsModalProps {
  onClose: () => void;
  onFinancialsUpdated: () => void;
  propertyId: string;
  outstandingPrincipal?: number;
  mortgage?: number;
  interestRate?: number;
  projectedEquity?: number;
}

const EditFinancialsModal = ({
  onClose,
  onFinancialsUpdated,
  propertyId,
  outstandingPrincipal,
  mortgage,
  interestRate,
  projectedEquity,
}: EditFinancialsModalProps) => {
  const { accessToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    outstandingPrincipal: outstandingPrincipal ?? '',
    mortgage: mortgage ?? '',
    interestRate: interestRate ?? '',
    projectedEquity: projectedEquity ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            financials: {
              outstandingPrincipal: formData.outstandingPrincipal !== '' ? Number(formData.outstandingPrincipal) : undefined,
              mortgage: formData.mortgage !== '' ? Number(formData.mortgage) : undefined,
              interestRate: formData.interestRate !== '' ? Number(formData.interestRate) : undefined,
              projectedEquity: formData.projectedEquity !== '' ? Number(formData.projectedEquity) : undefined,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onFinancialsUpdated();
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
    <FormModal title="Edit Financials" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="outstandingPrincipal" className={styles.label}>
              Outstanding Principal ($)
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="number"
                id="outstandingPrincipal"
                name="outstandingPrincipal"
                value={formData.outstandingPrincipal}
                onChange={handleChange}
                className={styles.inputWithIcon}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="mortgage" className={styles.label}>
              Mortgage ($)
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="number"
                id="mortgage"
                name="mortgage"
                value={formData.mortgage}
                onChange={handleChange}
                className={styles.inputWithIcon}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="interestRate" className={styles.label}>
              Interest Rate (%)
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className={styles.input}
              placeholder="0.00"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectedEquity" className={styles.label}>
              Projected Equity ($)
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="number"
                id="projectedEquity"
                name="projectedEquity"
                value={formData.projectedEquity}
                onChange={handleChange}
                className={styles.inputWithIcon}
                placeholder="0"
                min="0"
              />
            </div>
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

export default EditFinancialsModal;
