// 1 1 2 3 5 8
const fib = (n) => {
  if (n <= 1) return 1;
  return fib(n - 2) + fib(n - 1);
};

console.log(fib(1));
console.log(fib(2));
console.log(fib(3));
console.log(fib(4));
console.log(fib(5));
console.log(fib(6));
console.log(fib(7));
