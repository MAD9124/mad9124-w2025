const os = require('os');

// console.log(os.platform());

// console.log(
//   process.env.NODE_ENV === 'production'
//     ? 'https://mad9124.com'
//     : 'localhost:3000'
// );

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

fs.readFile(
  path.join(__dirname, '../week01/exercise/students.csv'),
  (err, data) => {
    console.log('err', err);
    console.log('data', data.toString());
  }
);

fsPromises
  .readFile(path.join(__dirname, '../week01/exercise/students.csv'))
  .then((data) => {
    console.log('data', data?.toString());
  })
  .catch(console.log);
