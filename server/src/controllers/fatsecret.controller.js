import { getAccessToken } from '../services/authService.js';
import axios from 'axios';

export const getIngredientsFromFatSecret = async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        'method': 'foods.search',
        'search_expression': 'apple',
        'format': 'json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching ingredients:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
};
