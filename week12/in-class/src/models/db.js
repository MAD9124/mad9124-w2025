const mongoose = require('mongoose');
const logger = require('../util/logger');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info('connected to mongoose');
  } catch (err) {
    logger.error('Error connecting to mongoose: ', err);
  }
};

module.exports = {
  connect,
};
