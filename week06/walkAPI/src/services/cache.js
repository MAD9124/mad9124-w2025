const redis = require('redis');

let redisClient;

const init = async () => {
  redisClient = await redis
    .createClient({
      url: process.env.REDIS_URL,
    })
    .on('error', (err) => {
      console.error(err);
    })
    .connect();
};

const encodeKey = (city, date) => `walk:${city}|${date}`;

const getWeather = async (city, date) => redisClient.GET(encodeKey(city, date));

const setWeather = (city, date, weatherData) => {
  redisClient.SET(encodeKey(city, date), JSON.stringify(weatherData));
};

module.exports = {
  init,
  getWeather,
  setWeather,
};
