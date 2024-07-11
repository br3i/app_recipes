import axios from "axios";

let accessToken = '';

const getAccessToken = async () => {
  try {
    const response = await axios.post('https://oauth.fatsecret.com/connect/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: process.env.FATSECRET_CLIENT_ID,
        client_secret: process.env.FATSECRET_CLIENT_SECRET,
        scope: 'basic'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error);
  }
};

export const fetchIngredientsFromAPI = async () => {
  if (!accessToken) {
    await getAccessToken();
  }
  try {
    const response = await axios.post('https://platform.fatsecret.com/rest/server.api', null, {
      params: {
        method: 'foods.search',
        search_expression: 'toast',
        format: 'json'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients from FatSecret API:', error);
    throw new Error('Error fetching ingredients from FatSecret API');
  }
};
