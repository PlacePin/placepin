import DangerButton from "../buttons/DangerButton";
import PrimaryButton from "../buttons/PrimaryButton";
import FormModal from "./FormModal";
import styles from './deleteLandlordTenant.module.css';

interface DeleteLandlordTenantProps {
  onClose: () => void,
}

const DeleteLandlordTenant = ({
  onClose
}: DeleteLandlordTenantProps) => {
  return (
    <div>
      <FormModal title={"Remove Tenant"} onClose={onClose}>
        <p>{`Are you sure you want to remove this tenant from your account?`}</p>
        <div className={styles.buttonWrapper}>
          <PrimaryButton
            title={"No"}
            onClick={onClose}
          />
          <DangerButton
            title='Yes'
          />
        </div>
      </FormModal>
    </div>
  )
}

export default DeleteLandlordTenant