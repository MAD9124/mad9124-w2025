const axios = require('axios');
const { BadRequestError } = require('../utils/errors');
const cacheService = require('./cache');

const { WEATHER_API_KEY } = process.env;
const BASE_URL = 'https://api.weatherapi.com/v1/history.json';

const getWeather = async (city, date) => {
  // 1. check the cache
  const cachedWeather = await cacheService.getWeather(city, date);

  // 2. if found, return right away
  if (cachedWeather) {
    console.log('weather found in cache!');
    return cachedWeather;
  }

  try {
    // 3. if not found, hit the API
    console.log('weather not found in cache :(, looking up in weather API');
    const { data } = await axios.get(
      `${BASE_URL}?key=${WEATHER_API_KEY}&q=${city}&dt=${date}`
    );
    const weatherData = {
      temperature: data.forecast.forecastday[0].day.avgtemp_c,
      precipitation: data.forecast.forecastday[0].day.totalprecip_mm,
    };

    cacheService.setWeather(city, date, weatherData);

    return weatherData;
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
