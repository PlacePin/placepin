import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryDangerButton from "../buttons/SecondaryDangerButton";
import FormModal from "./FormModal";
import styles from './removeLandlordTenant.module.css';

interface RemoveLandlordTenantProps {
  onClose: () => void,
}

const RemoveLandlordTenant = ({
  onClose
}: RemoveLandlordTenantProps) => {
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
          />
        </div>
      </FormModal>
    </div>
  )
}

export default RemoveLandlordTenant