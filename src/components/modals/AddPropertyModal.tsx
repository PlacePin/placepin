import { useState, type FormEvent } from "react";
import FormModal from "./FormModal";
import styles from './addPropertyModal.module.css';
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

interface AddPropertyModalProps {
  onClose?: () => void;
}

const AddPropertyModal = ({ onClose }: AddPropertyModalProps) => {

  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [unitAmount, setUnitAmount] = useState('');
  const [message, setMessage] = useState('');

  const { accessToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPropertySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const property = {
      propertyName,
      propertyAddress,
      unitAmount,
    }

    try {
      if (Number(unitAmount) <= 0) {
        throw new Error("Number of units can't be less than or equal to zero!")
      }

      const res = await axiosInstance.post(
        `/api/landlords/properties`,
        property,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      setMessage(res.data.message)

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data.message)
      } else if (err instanceof Error) {
        setMessage(err.message)
      }
    }
  }

  return (
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
            placeholder='The Palace'
            onChange={(e) => setPropertyName(e.target.value)}
            className={styles.inputFields}
            required
          />
          <label
            htmlFor='streetAddress'
            className={styles.labels}
          >
            Street Address
          </label>
          <input
            type="text"
            id='streetAddress'
            name="street"
            placeholder='123 Main Street'
            onChange={handleChange}
            className={styles.inputFields}
            required
          />
          <div className={styles.split}>
            <div className={styles.city}>
              <label
                htmlFor='city'
                className={styles.labels}
              >
                City
              </label>
              <input
                type="text"
                id='city'
                name="city"
                placeholder='Boston'
                onChange={handleChange}
                className={styles.inputFields}
                required
              />
            </div>
            <div className={styles.state}>
              <label
                htmlFor='state'
                className={styles.labels}
              >
                State
              </label>
              <input
                type="text"
                id='state'
                name="state"
                placeholder='Massachusetts'
                onChange={handleChange}
                className={styles.inputFields}
                required
              />
            </div>
          </div>
          <label
            htmlFor='zip'
            className={styles.labels}
          >
            Zip Code
          </label>
          <input
            type="number"
            id='zip'
            name="zip"
            placeholder='02136'
            onChange={handleChange}
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
            type="number"
            id='apartmentUnits'
            placeholder='Number of Units'
            onChange={(e) => setUnitAmount(e.target.value)}
            className={styles.inputFields}
            required
          />
        </div>
        <button className={styles.button}>
          Add Property
        </button>
        <p className={styles.message}>{message}</p>
      </form>
    </FormModal>
  )
}

export default AddPropertyModal