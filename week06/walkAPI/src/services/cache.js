const CACHE = {};

/**
 * @param {string} city
 * @param {string} date
 * @returns
 */
const encodeKey = (city, date) => `${city}|${date}`;

const getWeather = (city, date) => CACHE[encodeKey(city, date)];

const setWeather = (city, date, weatherData) => {
  CACHE[encodeKey(city, date)] = weatherData;
};

module.exports = {
  getWeather,
  setWeather,
};
