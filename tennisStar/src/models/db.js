const { default: mongoose } = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongo!");
  } catch (err) {
    console.error("Error connecting to mongoose", err);
  }
};

module.exports = { connect };
