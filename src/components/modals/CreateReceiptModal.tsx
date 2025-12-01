import styles from './createReceiptModal.module.css';
import FormModal from './FormModal';

interface CreateReceiptModalProps {
  onClose: () => void,
}

const CreateReceiptModal = ({
  onClose
}: CreateReceiptModalProps) => {
  return (
    <FormModal title={'Create Receipt'} onClose={onClose}>
      <form>

      </form>
    </FormModal>
  )
}

export default CreateReceiptModal