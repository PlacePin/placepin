import { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryDangerButton from "../buttons/SecondaryDangerButton";
import FormModal from "./FormModal";
import styles from './removeLandlordProperty.module.css';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

interface RemoveLandlordPropertyProps {
  onClose: () => void,
  propertyId: string,
}

const RemoveLandlordProperty = ({
  onClose,
  propertyId
}: RemoveLandlordPropertyProps) => {
  const [message, setMessage] = useState('')

  const { accessToken } = useAuth();

  const handleRemoval = async () => {
    try {
      if (!accessToken) {
        throw new Error('Unauthorized User')
      }
      await axiosInstance.delete(`/api/landlords/property?id=${propertyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      return setMessage('Property removed successfully')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage('Failed to remove Property.')
      } else if (err instanceof Error) {
        setMessage(err.message)
      } else {
        setMessage('An unexpected error occurred.')
      }
    }
  }

  return (
    <div>
      <FormModal title={"Remove Property"} onClose={onClose}>
        <p className={styles.question}>{`Are you sure you want to remove this property from your account?`}</p>
        <div className={styles.buttonWrapper}>
          <PrimaryButton
            title={"Cancel"}
            onClick={onClose}
          />
          <SecondaryDangerButton
            title='Remove Property'
            onClick={handleRemoval}
          />
        </div>
        <p className={styles.errorMessage}>{message}</p>
      </FormModal>
    </div>
  )
}

export default RemoveLandlordProperty