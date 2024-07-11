import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getAccessToken = async () => {
  try {
    const response = await axios.post('https://oauth.fatsecret.com/connect/token', new URLSearchParams({
      'grant_type': 'client_credentials',
      'scope': process.env.FATSECRET_SCOPE
    }), {
      auth: {
        username: process.env.FATSECRET_CLIENT_ID,
        password: process.env.FATSECRET_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export { getAccessToken };
