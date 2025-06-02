const axios = require('axios');
const User = require('../models/userModel');
const qs = require('qs');

const CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';

// Exchange the authorization code for an access token
const exchangeToken = async (req, res) => {
	console.log('backend exchangetoken begin');
	console.log('req.body', req.body);

	const { code } = req.body;
	if (!code) {
		return res.status(400).json({ error: 'Authorization code is required' });
	}

	try {
		const response = await axios.post(
			'https://api.fitbit.com/oauth2/token',
			qs.stringify({
				grant_type: 'authorization_code',
				code,
				redirect_uri: REDIRECT_URI,
			}),
			{
				headers: {
					Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		const {
			access_token,
			refresh_token,
			expires_in,
			user_id: fitbitUserId,
		} = response.data;

		const expiresAt = new Date(Date.now() + expires_in * 1000);

		// Update dummy user — here we assume email is unique and fixed for testing
		const dummyEmail = 'dummy@example.com';

		const updatedUser = await User.findOneAndUpdate(
			{ email: dummyEmail },
			{
				fitbitAccessToken: access_token,
				fitbitRefreshToken: refresh_token,
				fitbitExpiresAt: expiresAt,
			},
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ error: 'Dummy user not found' });
		}

		console.log('Fitbit token details:', {
			access_token,
			refresh_token,
			expiresAt,
			fitbitUserId,
		});

		res.status(200).json({ message: 'Fitbit token updated successfully' });
	} catch (err) {
		if (err.response) {
			console.error('Fitbit API response error:', err.response.status, err.response.data);
		} else if (err.request) {
			console.error('No response from Fitbit API:', err.request);
		} else {
			console.error('Error setting up Fitbit request:', err.message);
		}

		res.status(500).json({ error: 'Failed to exchange Fitbit token' });
	}
};

// Retrieve user profile data from Fitbit
// const getFitbitProfile = async (req, res) => {
//   const { access_token } = req.headers;  // Assuming access_token is sent in the headers

//   if (!access_token) {
//     return res.status(400).json({ error: 'Access token is required' });
//   }

//   try {
//     // Send a request to Fitbit's API to retrieve the user profile data
//     const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
//       headers: {
//         'Authorization': `Bearer ${access_token}`,
//       },
//     });

//     // Successfully received user profile data
//     res.json(response.data);
//     console.log(response.data)
//   } catch (error) {
//     console.error('Error retrieving user profile data:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Error retrieving user profile data' });
//   }
// };

// Helper to refresh token
// const refreshAccessToken = async (tokenDoc) => {
//   try {
//     const response = await axios.post('https://api.fitbit.com/oauth2/token', null, {
//       headers: {
//         Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params: {
//         grant_type: 'refresh_token',
//         refresh_token: tokenDoc.refreshToken,
//       },
//     });

//     const { access_token, refresh_token, expires_in } = response.data;

//     // Update token in DB
//     tokenDoc.accessToken = access_token;
//     tokenDoc.refreshToken = refresh_token;
//     tokenDoc.expiresAt = new Date(Date.now() + expires_in * 1000);
//     await tokenDoc.save();

//     return access_token;
//   } catch (err) {
//     console.error('Error refreshing Fitbit token:', err.response?.data || err.message);
//     throw err;
//   }
// };

// // Main controller
// const getFitbitData = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const tokenDoc = await FitbitToken.findOne({ userId });

//     if (!tokenDoc) {
//       return res.status(200).json({
//         success: false,
//         needsFitbitAuth: true,
//         message: 'Fitbit account not connected. Please authorize via Fitbit login.',
//       });
//     }

//     let accessToken = tokenDoc.accessToken;

//     if (new Date() >= tokenDoc.expiresAt) {
//       // Token expired, refresh it
//       accessToken = await refreshAccessToken(tokenDoc);
//     }

//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//     };

//     // Fetch all required Fitbit data
//     const [
//       heartRateRes,
//       respiratoryRes,
//       temperatureRes,
//       hrvRes,
//       profileRes
//     ] = await Promise.all([
//       axios.get('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json', { headers }),
//       axios.get('https://api.fitbit.com/1/user/-/br/date/today.json', { headers }),
//       axios.get('https://api.fitbit.com/1/user/-/temp/core/date/today.json', { headers }),
//       axios.get('https://api.fitbit.com/1/user/-/hrv/date/today.json', { headers }),
//       axios.get('https://api.fitbit.com/1/user/-/profile.json', { headers }),
//     ]);

//     res.status(200).json({
//       heartRate: heartRateRes.data,
//       respiratory: respiratoryRes.data,
//       temperature: temperatureRes.data,
//       hrv: hrvRes.data,
//       restingHeartRate: profileRes.data?.user?.restingHeartRate || null,
//     });
//   } catch (err) {
//     console.error('Error fetching Fitbit data:', err);
//     res.status(500).json({ error: 'Failed to fetch Fitbit data' });
//   }
// };

// Export the functions
module.exports = {
	exchangeToken,
	// refreshAccessToken,
	// getFitbitData, // Export the new function to retrieve user profile data
};