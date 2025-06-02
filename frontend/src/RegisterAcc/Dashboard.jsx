import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('fitbit_access_token');
        if (!accessToken) {
          throw new Error('Access token is missing');
        }

        // Fetch user data from your backend (which calls Fitbit API)
        const response = await fetch('http://localhost:5000/api/fitbit/userdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,  // Pass the access token here
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);  // Set the user data to the state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {userData?.user.displayName}</h2>

      {/* Displaying Fitbit Profile Information */}
      <div>
        <h3>Profile Information</h3>
        <p><strong>Full Name:</strong> {userData?.user.fullName}</p>
        <p><strong>Gender:</strong> {userData?.user.gender}</p>
        <p><strong>Age:</strong> {userData?.user.age}</p>
        <p><strong>Country:</strong> {userData?.user.country}</p>
      </div>

      {/* Displaying Steps Data */}
      <div>
        <h3>Steps:</h3>
        <p>{userData?.userData?.steps || 'Data not available'}</p>
      </div>

      {/* Displaying Heart Rate Data */}
      <div>
        <h3>Heart Rate:</h3>
        <p>{userData?.userData?.heartRate || 'Data not available'}</p>
      </div>

      {/* Displaying Sleep Data */}
      <div>
        <h3>Sleep:</h3>
        <p>{userData?.userData?.sleep || 'Data not available'}</p>
      </div>

      {/* Add more sections for other data you want to display */}
    </div>
  );
};

export default Dashboard;