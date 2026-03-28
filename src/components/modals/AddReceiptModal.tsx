import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './addReceiptModal.module.css';
import FormModal from './FormModal';
import axios from 'axios';

interface AddReceiptModalProps {
  onClose: () => void,
  onReceiptAdded: () => void,
  properties: Record<string, any>[],
}

const AddReceiptModal = ({
  onClose,
  onReceiptAdded,
  properties = []
}: AddReceiptModalProps) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    taxYear: new Date().getFullYear().toString(),
    propertyId: '',
    category: '',
    amount: '',
    date: '',
    description: '',
    paymentMethod: '',
  });

  const { accessToken } = useAuth();

  const expenseCategories = [
    'Advertising',
    'Auto and Travel',
    'Cleaning and Maintenance',
    'Commissions',
    'Insurance',
    'Legal and Other Professional Fees',
    'Management Fees',
    'Mortgage Interest',
    'Other Interest',
    'Repairs',
    'Supplies',
    'Taxes',
    'Utilities',
    'Depreciation Expense or Depletion',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/landlords/receipts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      onReceiptAdded();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.message)
      } else if (err instanceof Error) {
        setErrorMessage(err.message)
      }
    }
  };

  return (
    <FormModal title={'Add Receipt'} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="taxYear" className={styles.label}>
              Tax Year *
            </label>
            <input
              type="number"
              id="taxYear"
              name="taxYear"
              value={formData.taxYear}
              onChange={handleChange}
              className={styles.input}
              placeholder="2024"
              min="2000"
              max="2100"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="propertyId" className={styles.label}>
              Physical Address *
            </label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.address.street}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Expense Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select a category</option>
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="amount" className={styles.label}>
              Amount *
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={styles.inputWithIcon}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="paymentMethod" className={styles.label}>
            Payment Method *
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="check">Check</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Add any additional notes or details about this expense..."
            rows={4}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Add Receipt
          </button>
        </div>
        <p>{errorMessage}</p>
      </form>
    </FormModal>
  )
}

export default AddReceiptModal