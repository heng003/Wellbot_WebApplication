import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FitbitCallback = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const fetchToken = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get('code');
			console.log('get code:', code);

			if (!code) {
				alert("No authorization code found");
				return;
			}

			// Check if the code has already been used
			const codeUsedFlag = sessionStorage.getItem(`fitbit-code-used-${code}`);
			if (codeUsedFlag === 'true') {
				console.log('This code has already been used.');
				return;
			}

			// Mark it as used *before* making the request to avoid double submission
			sessionStorage.setItem(`fitbit-code-used-${code}`, 'true');

			try {
				console.log('Trying to exchange token...');
				await axios.post('/api/fitbit/exchangetoken', { code });
				alert("Fitbit connected successfully");
				navigate('/dashboard'); // Redirect after success
			} catch (err) {
				console.error(err);
				alert("Failed to connect Fitbit");
				// Optionally: Reset the flag to allow retry
				sessionStorage.removeItem(`fitbit-code-used-${code}`);
			}
		};

		fetchToken();
	}, [navigate]);

	return (
		<div>
			<h2>Fitbit Callback</h2>
			<p>Processing authorization code...</p>
		</div>
	);
};

export default FitbitCallback;