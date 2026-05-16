import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import FormModal from "./FormModal";
import styles from './updateAddressModal.module.css';
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

interface UpdateAddressModalProps {
  street: string,
  unit?: string,
  city: string,
  state: string
  zip: string,
  onClose: () => void;
  onAddressUpdate: () => void;
}

const UpdateAddressModal = ({
  street,
  unit,
  city,
  state,
  zip,
  onClose,
  onAddressUpdate
}: UpdateAddressModalProps) => {

  const [message, setMessage] = useState('');
  const [propertyAddress, setPropertyAddress] = useState({
    street,
    unit,
    city,
    state,
    zip
  });

  const { accessToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePropertySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post(
        `/api/tenants/address`,
        propertyAddress,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      onAddressUpdate();

      setMessage(data.message)
      onClose()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data.message)
      } else if (err instanceof Error) {
        setMessage(err.message)
      }
    }
  }

  return (
    <FormModal title='Update Address' onClose={onClose}>
      <form onSubmit={handleUpdatePropertySubmit}>
        <div className={styles.formContainer}>
          <div className={styles.split}>
            <div className={styles.address}>
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
                value={propertyAddress.street}
                onChange={handleChange}
                className={styles.inputFields}
                required
              />
            </div>
            <div className={styles.unit}>
              <label
                htmlFor='unit'
                className={styles.labels}
              >
                Apartment, suite, etc.
              </label>
              <input
                type="text"
                id='unit'
                name="unit"
                placeholder='4A'
                value={propertyAddress.unit || ''}
                onChange={handleChange}
                className={styles.inputFields}
              />
            </div>
          </div>
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
                value={propertyAddress.city}
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
                value={propertyAddress.state}
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
            value={propertyAddress.zip}
            onChange={handleChange}
            className={styles.inputFields}
            required
          />
        </div>
        <button className={styles.button}>
          Update Address
        </button>
        <p className={styles.message}>{message}</p>
      </form>
    </FormModal>
  )
}

export default UpdateAddressModal