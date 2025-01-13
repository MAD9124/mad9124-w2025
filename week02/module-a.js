const { sayHello, someOtherVar } = require('./module-b');

const someVar = 'A';

sayHello('James');

console.log(someVar);
console.log(someOtherVar);

console.log('filename', __filename);
console.log('dirname', __dirname);
