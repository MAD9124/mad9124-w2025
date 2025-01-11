const students = [
  {
    id: 1,
    name: 'tim',
    grade: 'A+',
  },
  {
    id: 2,
    name: 'adam',
    grade: 'F',
  },
  {
    id: 3,
    name: 'adesh',
    grade: 'B',
  },
  {
    id: 4,
    name: 'Steve',
    grade: 'A++',
  },
];

// filter
const passingStudents = students.filter((student) => student.grade != 'F');
console.log(passingStudents);

// map
const justNames = students.map((students) => students.name);
console.log(justNames);

// reduce
const namesAsString = students.reduce((acc, cv) => {
  console.log('acc', acc);
  console.log('cv', cv);
  return `${acc}, ${cv.name}`;
}, '');

// console.log(namesAsString);

// console.log([1, 2, 3].reduce((acc, cv) => acc + cv));

const studentMap = students.reduce((acc, cv) => {
  acc[cv.id] = cv;
  return acc;
}, {});

console.log(studentMap[4]);

// find
console.log(students.find((student) => student.id === 4));

students.forEach((student) => {
  console.log(student);
});

for (const student of students) {
  console.log(student);
}

for (let i = 0; i < students.length; i++) {
  const student = students[i];
  console.log(student);
}
