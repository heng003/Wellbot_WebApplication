const FITBIT_AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QCQJ&redirect_uri=http://localhost:3000/callback&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight`;

function FitbitLoginButton() {
  return (
    <button onClick={() => window.location.href = FITBIT_AUTH_URL}>
      Login with Fitbit
    </button>
  );
}

export default FitbitLoginButton;