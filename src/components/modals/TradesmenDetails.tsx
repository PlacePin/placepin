import { capitalizeWords } from '../../utils/stringUtils';
import PrimaryButton from '../buttons/PrimaryButton';
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

  const profilePic = tradesmen.profilePic ?
    <img className={styles.profilePic} src={tradesmen.profilePic} alt='Profile Pic' /> :
    <img className={styles.profilePic} src='/emptyProfile.png' alt='Empty Profile Pic' />

  const fullName = capitalizeWords(tradesmen.fullName)
  const username = tradesmen.username

  console.log(tradesmen)
  return (
    <FormModal
      title={capitalizeWords(tradesmen.fullName)}
      onClose={onClose}
    >
      <div className={styles.wrapper}>
        <div>
          <div className={styles.profilePicContainer}>
            {profilePic}
          </div>
        </div>
        <div className={styles.nameContainer}>
          <h2 className={styles.name}>
            {fullName}
          </h2>
          <p>
            {username}
          </p>
        </div>
        <div className={styles.backgroundContainer}>
          <h4>
            Background:
          </h4>
          <p></p>
        </div>
        <div className={styles.optionsContainer}>
          <h4>
            Options:
          </h4>
          <p>Retainer</p>
          <p>Location/Range</p>
          <p>On-Call</p>
        </div>
      </div>
      <div>
        <PrimaryButton title={'Book Appointment'} />
      </div>
    </FormModal>
  )
}

export default TradesmenDetails