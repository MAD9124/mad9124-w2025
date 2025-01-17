const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// define an event listener
myEmitter.on('test', () => {
  console.log('hello, world!');
});

// emit an event with an optional data payload
myEmitter.emit('test1');
myEmitter.emit('test1');
myEmitter.emit('test1');
myEmitter.emit('test1');
myEmitter.emit('test1');
myEmitter.emit('test1');
