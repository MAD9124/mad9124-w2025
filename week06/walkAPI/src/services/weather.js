const axios = require('axios');
const { BadRequestError } = require('../utils/errors');

const { WEATHER_API_KEY } = process.env;
const BASE_URL = 'https://api.weatherapi.com/v1/history.json';

const getWeather = async (city, date) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}?key=${WEATHER_API_KEY}&q=${city}&dt=${date}`
    );
    return {
      temperature: data.forecast.forecastday[0].day.avgtemp_c,
      precipitation: data.forecast.forecastday[0].day.totalprecip_mm,
    };
  } catch (error) {
    console.log(error.response.data);
    if (error.response.status === 400) {
      throw new BadRequestError(error.response.data.error.message);
    }
    throw error;
  }
};

module.exports = {
  getWeather,
};
