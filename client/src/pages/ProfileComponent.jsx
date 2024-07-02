// pages/ProfileComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileComponent = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <label>Name:</label>
        <span>{profile.name}</span>
      </div>
      <div>
        <label>Email:</label>
        <span>{profile.email}</span>
      </div>
      {/* Add more fields as necessary */}
    </div>
  );
};

export default ProfileComponent;
