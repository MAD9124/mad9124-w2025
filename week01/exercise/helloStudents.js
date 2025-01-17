// 1.
const students = require('./students.json');

// 2.
students.forEach((student) => {
  console.log(`Hello ${student.firstName} ${student.lastName}`);
});
console.log('\n');
for (const student of students) {
  console.log(`Hello ${student.firstName} ${student.lastName}`);
}
console.log('\n');
for (let i = 0; i < students.length; i++) {
  const student = students[i];
  console.log(`Hello ${student.firstName} ${student.lastName}`);
}

// 3.
const studentsWithD = students.filter(
  (student) => student.lastName[0].toUpperCase() === 'D'
  //   student.firstName.startsWith('D')
);
const count = students.reduce(
  (total, cv) => total + (cv.lastName[0].toUpperCase() === 'D' ? 1 : 0),
  0
);
let c = 0;
for (let i = 0; i < students.length; i++) {
  if (students[i].lastName.startsWith('D')) c++;
}
console.log(`Count of last names starting with D: ${studentsWithD.length}`);
console.log(`Count of last names starting with D: ${count}`);
console.log(`Count of last names starting with D: ${c}`);

// 4.
const emails = students.map(
  ({ firstName }) => `${firstName.toLowerCase()}@algonquincollege.com`
);

// 5.
console.log(emails);
