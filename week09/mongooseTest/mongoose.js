const mongoose = require('mongoose');

const main = async () => {
  try {
    await mongoose
      .connect('mongodb://localhost:27017/mad9124')
      .then(() => console.log('Connected to mongodb'))
      .catch((e) => console.error(`Error connecting to mongodb: ${e.message}`));

    const catSchema = mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      age: Number,
    });
    const Cat = mongoose.model('Cat', catSchema);

    // const newCat = new Cat({ name: 'Hello Kitty', age: 4 });
    // await newCat.save();

    const cats = await Cat.find({ name: 'Garfield' });
    console.log(cats);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

main();
