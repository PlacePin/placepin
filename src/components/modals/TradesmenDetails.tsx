import FormModal from './FormModal';
import styles from './tradesmenDetails.module.css';

interface TradesmenDetailsProp {
  tradesmen: Record<string, string>
}

const TradesmenDetails = ({
  tradesmen
}: TradesmenDetailsProp) => {

  console.log(tradesmen)
  return (
    <FormModal title={tradesmen.fullName}>
      <div>

      </div>
    </FormModal>
  )
}

export default TradesmenDetails