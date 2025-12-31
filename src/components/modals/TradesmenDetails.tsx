import { capitalizeWords } from '../../utils/stringUtils';
import FormModal from './FormModal';
import styles from './tradesmenDetails.module.css';

interface TradesmenDetailsProp {
  tradesmen: any;
  onClose: () => void
}

const TradesmenDetails = ({
  tradesmen,
  onClose
}: TradesmenDetailsProp) => {

  console.log(tradesmen)
  return (
    <FormModal
      title={capitalizeWords(tradesmen.fullName)}
      onClose={onClose}
    >
      <div>

      </div>
    </FormModal>
  )
}

export default TradesmenDetails