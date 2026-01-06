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
      <div className={styles.wrapper}>
        <div>aa</div>
        <div>ss</div>
        <div>dd</div>
        <div>ff</div>
      </div>
    </FormModal>
  )
}

export default TradesmenDetails