import styles from './createReceiptModal.module.css';
import FormModal from './FormModal';

interface AddReceiptModalProps {
  onClose: () => void,
}

const AddReceiptModal = ({
  onClose
}: AddReceiptModalProps) => {
  return (
    <FormModal title={'Add Receipt'} onClose={onClose}>
      <form>

      </form>
    </FormModal>
  )
}

export default AddReceiptModal