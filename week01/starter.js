// variables
const name = 'Tim';
let age = 33;
age = age + 1;

// string
const str = '123';
// truthy = has characters
// falsey = ''
// numbers
const num = 123;
// truthy !== 0
// falsey 0
// boolean
const bool = true;
// object
const obj = {
  key: 'value',
};
// array
const arr = [1, 2, 3];

// functions
function sum(a, b) {
  return a + b;
}

console.log(sum(1, 1));
console.log(sum(1, 2));
console.log(sum(1, 3));

const difference = (a, b) => {
  return a - b;
};

console.log(difference(3, 1));
console.log(difference(3, 2));
console.log(difference(3, 3));

const myClass = {
  id: 1,
  test: function () {
    console.log(this.id);
  },
  test1: () => {
    console.log(this.id);
  },
};

this.id = 2;

myClass.test();
myClass.test1();

const signMyName = (name, generateMessage) => {
  return generateMessage(name);
};

signMyName('tim', (name) => console.log('Hello from ' + name));
signMyName('adam', (name) => console.log(`Goodbye from ${name}`));

console.log((() => '123')());
console.log(
  (() => {
    return '123';
  })()
);

Object.keys({ a: 1, b: 2 }); // [ 'a', 'b']
Object.values({ a: 1, b: 2 }); // [ 1, 2]
Object.entries({ a: 1, b: 2 }); // [ ['a', 1], ['b', 2]]

console.log('{asdf}', Boolean({ a: 'a' }));
console.log('{}', !!{});

console.log('[asdf]', Boolean([1, 2]));
console.log('[]', Boolean([]));
