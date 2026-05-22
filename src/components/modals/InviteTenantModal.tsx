import { useState, type FormEvent } from 'react';
import styles from './inviteTenantModal.module.css';
import { useAuth } from '../../context/AuthContext';
import FormModal from './FormModal';
import axiosInstance from '../../utils/axiosInstance';
import { useGetAxios } from '../../hooks/useGetAxios';

interface PropertyAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}

interface LandlordPropertyRow {
  properties: {
    _id: string;
    name?: string;
    address: PropertyAddress;
  };
}

interface InviteTenantModalProps {
  onClose?: () => void;
}

const formatPropertyLabel = (address: PropertyAddress) =>
  `${address.street}, ${address.city} ${address.state}, ${address.zip}`;

const InviteTenantModal = ({ onClose }: InviteTenantModalProps) => {
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [tenantAddress, setTenantAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [message, setMessage] = useState('');

  const { accessToken } = useAuth();
  const { data, error } = useGetAxios('/api/landlords/properties');

  const propertyRows: LandlordPropertyRow[] = data?.properties ?? [];
  const hasProperties = propertyRows.length > 0;

  const handlePropertySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setPropertyId(selectedId);

    const row = propertyRows.find((p) => p.properties._id === selectedId);
    if (row) {
      const { street, city, state, zip } = row.properties.address;
      setTenantAddress({ street, city, state, zip });
    } else {
      setTenantAddress({ street: '', city: '', state: '', zip: '' });
    }
  };

  const handleTenantInviteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tenantInfo = {
      tenantName,
      tenantEmail,
      tenantAddress,
    };

    try {
      const res = await axiosInstance.post(
        '/api/users/invite/tenant/',
        tenantInfo,
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        },
      );
      setMessage(res.data.message);
      onClose?.();
    } catch (err: any){
      setMessage('Failed to send invite!');
    }
  };

  return (
    <FormModal title="Invite Tenant" onClose={onClose}>
      <form onSubmit={handleTenantInviteSubmit}>
        <div className={styles.formContainer}>
          <label htmlFor="tenantName" className={styles.labels}>
            Tenant Name
          </label>
          <input
            type="text"
            id="tenantName"
            placeholder="Dinah Augustin"
            onChange={(e) => setTenantName(e.target.value)}
            className={styles.inputFields}
            required
          />

          {error && (
            <p className={styles.message}>Failed to load properties.</p>
          )}

          {!hasProperties && !error && (
            <p className={styles.emptyState}>
              Add a property before inviting tenants.
            </p>
          )}

          <label htmlFor="propertyId" className={styles.labels}>
            Property
          </label>
          <select
            id="propertyId"
            value={propertyId}
            onChange={handlePropertySelect}
            className={styles.inputFields}
            required
            disabled={!hasProperties}
          >
            <option value="" disabled>
              Select a property
            </option>
            {propertyRows.map((row) => (
              <option key={row.properties._id} value={row.properties._id}>
                {formatPropertyLabel(row.properties.address)}
              </option>
            ))}
          </select>

          <label htmlFor="street" className={styles.labels}>
            Street Address
          </label>
          <input
            type="text"
            id="street"
            value={tenantAddress.street}
            className={`${styles.inputFields} ${styles.readOnlyField}`}
            readOnly
            required
          />

          <div className={styles.split}>
            <div className={styles.city}>
              <label htmlFor="city" className={styles.labels}>
                City
              </label>
              <input
                type="text"
                id="city"
                value={tenantAddress.city}
                className={`${styles.inputFields} ${styles.readOnlyField}`}
                readOnly
                required
              />
            </div>
            <div className={styles.state}>
              <label htmlFor="state" className={styles.labels}>
                State
              </label>
              <input
                type="text"
                id="state"
                value={tenantAddress.state}
                className={`${styles.inputFields} ${styles.readOnlyField}`}
                readOnly
                required
              />
            </div>
          </div>

          <label htmlFor="zip" className={styles.labels}>
            Zip Code
          </label>
          <input
            type="text"
            id="zip"
            value={tenantAddress.zip}
            className={`${styles.inputFields} ${styles.readOnlyField}`}
            readOnly
            required
          />

          <label htmlFor="tenantEmail" className={styles.labels}>
            Tenant Email
          </label>
          <input
            type="email"
            id="tenantEmail"
            placeholder="dinahaugustin@placepin.com"
            onChange={(e) => setTenantEmail(e.target.value)}
            className={styles.inputFields}
            required
          />
        </div>
        <button className={styles.button} disabled={!hasProperties}>
          Send Invite
        </button>
        <p className={styles.message}>{message}</p>
      </form>
    </FormModal>
  );
};

export default InviteTenantModal;
