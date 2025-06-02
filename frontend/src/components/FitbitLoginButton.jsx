const FITBIT_AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QCQJ&redirect_uri=http://localhost:3000/callback&scope=heartrate respiratory_rate temperature sleep profile activity&expires_in=604800`;

function FitbitLoginButton() {
  return (
    <button onClick={() => window.location.href = FITBIT_AUTH_URL}>
      Login with Fitbit
    </button>
  );
}

export default FitbitLoginButton;