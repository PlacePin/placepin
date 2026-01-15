import styles from './tenantLogbook.module.css';

interface TenantLogbookProps {
  career: string,
  income: number,
  age: string,
  governmentAssistance: string,
}

const TenantLogbook = ({
  career,
  income,
  age,
  governmentAssistance,
}: TenantLogbookProps) => {
  return (
    <div className={styles.logbookWrapper}>
      <p className={styles.title}>Logbook</p>
      <div className={styles.infoContainer}>
        {income !== 0 &&
          <p>Income: <span>{`$${income}`}</span></p>
        }
        {career &&
          <p>Career: <span>{career}</span></p>
        }
        {age &&
          <p>Age: <span>{age}</span></p>
        }
        <p>Government Assistants: <span>{governmentAssistance}</span></p>
      </div>
    </div>
  )
}

export default TenantLogbook