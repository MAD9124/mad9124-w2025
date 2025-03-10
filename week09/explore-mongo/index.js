'use strict';

const mongoose = require('mongoose');

const trickSchema = new mongoose.Schema({
  name: String,
  dateLearned: Date,
});

const personSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true,
  }
);

const catSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    lives: Number,
    favouriteFoods: [String],
    tricks: [trickSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
    },
  },
  {
    timestamps: true,
  }
);

const Cat = mongoose.model('Cat', catSchema);
const Person = mongoose.model('Person', personSchema);

const main = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/explore-mongoose');
    // const cat = new Cat({
    //   name: 'test',
    //   age: 1,
    //   live: 9,
    //   owner: '67cf586432be52bc2ad9e5ef',
    //   tricks: [
    //     {
    //       name: 'puke',
    //       dateLearned: new Date(),
    //     },
    //   ],
    // });
    const cat = await Cat.find({ age: 1 }).populate('owner');
    // const cat = Cat.findByIdAndUpdate('668ef2dad1587b603e959455', {
    //   // $set: {
    //   tricks: [
    //     {
    //     },
    //   ],
    //   // },
    // });
    // await cat.save();
    console.log('cat', cat);

    // // Get all cats
    // const allCats = await Cat.find({});
    // console.log('all', allCats.length);

    // // Get all cats with 9 lives
    // const nineCats = await Cat.find({ lives: 9 });
    // console.log('9 live cats', nineCats.length);

    // // Get all cats older than 9 years old
    // const nineYoCats = await Cat.find({ age: { $gt: 9 } });
    // console.log('older than 9 cats', nineYoCats.length);

    // // Get all cats whose name starts with `G`
    // // const gCats = await Cat.find({ name: /^G/ } });
    // const gCats = await Cat.find({ name: { $regex: '^G' } });
    // console.log('Starting with G cats', gCats.length);

    // // Get all cats that like tuna
    // const tunaCats = await Cat.find({ favouriteFoods: 'tuna' });
    // console.log('Tuna loving cats', tunaCats.length);

    // // Get all cats that don't like tuna
    // const noTunaCats = await Cat.find({ favouriteFoods: { $ne: 'tuna' } });
    // console.log('Tuna hating cats', noTunaCats.length);

    // // Get all cats that like potatoes or strawberry
    // // const potStrawCats = await Cat.find({
    // // $or: [
    // //   {   favouriteFoods: 'potatoes'},
    // //   {   favouriteFoods: 'strawberries' },
    // // ]
    // // });
    // const potStrawCats = await Cat.find({
    //   favouriteFoods: { $in: ['potatoes', 'strawberries'] },
    // });
    // console.log('Potato or strawberry cats', potStrawCats.length);

    // // Get all cats that like mice and biscuits
    // const miceBiscuitsCats = await Cat.find({
    //   $and: [{ favouriteFoods: 'biscuits' }, { favouriteFoods: 'sushi' }],
    // });
    // console.log('Mice and buiscuits cats', miceBiscuitsCats.length);

    // // Get the oldest cat
    // const oldestCat = await Cat.findOne({}).sort({ age: -1, _id: 1 });
    // console.log('Oldest cat', oldestCat);

    // // Get the oldest cat that likes fish
    // const oldestFishCat = await Cat.findOne({ favouriteFoods: 'fish' }).sort({
    //   age: -1,
    //   _id: 1,
    // });
    // console.log('Oldest fish cat', oldestFishCat);

    // // Get the cat with the least lives that like milk and biscuits
    // const leastLivesCat = await Cat.findOne({
    //   $and: [{ favouriteFoods: 'milk' }, { favouriteFoods: 'biscuits' }],
    // }).sort({ lives: 1, _id: 1 });
    // console.log('Least lives cat', leastLivesCat);
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.disconnect();
  }
};

main();
