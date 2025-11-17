import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
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
          <SecondaryButton
            title={"No"}
            onClick={onClose}
          />
          <PrimaryButton
            title='Yes'
          />
        </div>
      </FormModal>
    </div>
  )
}

export default DeleteLandlordTenant