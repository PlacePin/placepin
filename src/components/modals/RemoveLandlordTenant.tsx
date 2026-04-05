import { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryDangerButton from "../buttons/SecondaryDangerButton";
import FormModal from "./FormModal";
import styles from './removeLandlordTenant.module.css';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

interface RemoveLandlordTenantProps {
  onClose: () => void,
  tenantId: string,
}

const RemoveLandlordTenant = ({
  onClose,
  tenantId
}: RemoveLandlordTenantProps) => {
  const [message, setMessage] = useState('')

  const { accessToken } = useAuth();

  const handleRemoval = async () => {
    try {
      if (!accessToken) {
        throw new Error('Unauthorized User')
      }
      await axiosInstance.delete(`/api/landlords/tenant?id=${tenantId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return setMessage('Tenant removed successfully')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage('Failed to remove tenant.')
      } else if (err instanceof Error) {
        setMessage(err.message)
      } else {
        setMessage('An unexpected error occurred.')
      }
    }
  }

  return (
    <div>
      <FormModal title={"Remove Tenant"} onClose={onClose}>
        <p className={styles.question}>{`Are you sure you want to remove this tenant from your account?`}</p>
        <div className={styles.buttonWrapper}>
          <PrimaryButton
            title={"Cancel"}
            onClick={onClose}
          />
          <SecondaryDangerButton
            title='Remove Tenant'
            onClick={handleRemoval}
          />
        </div>
        <p className={styles.errorMessage}>{message}</p>
      </FormModal>
    </div>
  )
}

export default RemoveLandlordTenant