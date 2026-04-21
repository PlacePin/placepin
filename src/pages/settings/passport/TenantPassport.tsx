import { useGetAxios } from "../../../hooks/useGetAxios";
import IdentityStep from "../../../components/passportSteps/identity/IdentityStep"

const TenantPassport = () => {

  const { data, error } = useGetAxios('/api/users/');

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  // Todo: Fix this to skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  const tenant = data.user;
  const firstName = tenant.fullName.split(' ')[0];
  const lastName = tenant.fullName.split(' ')[1];
  const DoB = String(tenant.dateOfBirth);
  const formattedDoB = `${DoB.slice(0, 4)}-${DoB.slice(4, 6)}-${DoB.slice(6, 8)}`;

  console.log('tenant', tenant)

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
        firstName={firstName}
        lastName={lastName}
        dateOfBirth={formattedDoB}
      />
    </>
  )
}

export default TenantPassport