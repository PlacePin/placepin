import IdentityStep from "../../../components/passportSteps/identity/IdentityStep"
import { useAuth } from "../../../context/AuthContext";

const TenantPassport = () => {

  const { accessToken } = useAuth();

  return (
    <>
      <div>
        <h2>
          Set up your passport
        </h2>
        <p>
          Complete each section to build your verified rental identity.
        </p>
      </div>
      <IdentityStep
      firstName="John"
      lastName="Doe"
      dateOfBirth="09/07/1994"
      />
    </>
  )
}

export default TenantPassport