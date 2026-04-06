import { useState } from 'react';
import { capitalizeWords, firstNameLastInitial } from '../../utils/stringUtils';
import PrimaryButton from '../buttons/PrimaryButton';
import ComposeModal from './ComposeModal';
import FormModal from './FormModal';
import styles from './tradesmenDetails.module.css';
import emptyProfile from '../../assets/emptyProfile.webp';

interface TradesmenDetailsProp {
  tradesmen: any;
  onClose: () => void
}

const TradesmenDetails = ({
  tradesmen,
  onClose
}: TradesmenDetailsProp) => {

  const [showCompose, setShowCompose] = useState(false)

  const profilePic = tradesmen.profilePic ?
    <img className={styles.profilePic} src={tradesmen.profilePic} alt='Profile Pic' /> :
    <img className={styles.profilePic} src={emptyProfile} alt='Empty Profile Pic' />

  const fullName = capitalizeWords(tradesmen.fullName);
  const username = tradesmen.username;
  const profession = tradesmen.profession ? tradesmen.profession : 'Not Listed';
  const location = tradesmen.workPreferences.location ? tradesmen.workPreferences.location : 'Not Listed';
  const range = tradesmen.workPreferences.range;
  const onCall = tradesmen.workPreferences.onCall ? 'Yes' : 'No';
  const retainer = tradesmen.workPreferences.retainer ? 'Yes' : 'No';

  const backgroundList = tradesmen.background.length > 0
    ? tradesmen.background.map((backgroundItem: string, item: number) => {
      return <p key={item}>{backgroundItem}</p>
    })
    : <p>Nothing was found for this persons background.</p>

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
          <p>Trade: <span>{profession}</span></p>
          <h2 className={styles.name}>
            {fullName}
          </h2>
          <p>
            {username}
          </p>
        </div>
        {/* Remove hardcoded values when tradesmen first time signup is complete */}
        <div className={styles.backgroundContainer}>
          <h4>
            Background:
          </h4>
          {backgroundList}
        </div>
        <div className={styles.optionsContainer}>
          <h4>
            Work Preferences
          </h4>
          <p>Retainer: <span>{retainer}</span></p>
          <p>Location/Range: <span>{`${location} ~ ${range}mi`}</span></p>
          <p>On-Call: <span>{onCall}</span></p>
        </div>
      </div>
      <div className={styles.button}>
        <PrimaryButton
          title={`Message ${firstNameLastInitial(tradesmen.fullName)}`}
          onClick={() => setShowCompose(prev => !prev)}
        />
        {showCompose && (
          <ComposeModal
            onClose={() => setShowCompose(prev => !prev)}
            username={username}
          />
        )}
      </div>
    </FormModal>
  )
}

export default TradesmenDetails