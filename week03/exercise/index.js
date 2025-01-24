'use strict';

const express = require('express');
const students = require('./students.json');

const app = express();

app.use(express.json());

// CREATE
// create a new student
app.post('/api/students', (req, res) => {
  const { firstName, lastName } = req.body;

  // find new student data
  const newStudent = {
    id: Date.now(), // NOTE - this is not ideal, but will do for now
    firstName,
    lastName,
  };

  // save new student in our array
  students.push(newStudent);

  // respond with new student (including it's id)
  res.status(201).json({
    data: newStudent,
  });
});

// READ
// return a collection of students
app.get('/api/students', (req, res) => {
  res.status(200).json({
    data: students,
  });
});

// return the student matching the id value
app.get('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  const student = students.find((s) => s.id === parseInt(studentId, 10));

  if (!student) {
    res.status(404).json({
      error: `student with id ${studentId} not found`,
    });
    return;
  }

  res.json({
    data: student,
  });
});

// replace all properties of a student
app.put('/api/students/:id', (req, res) => {
  // 1 find the student
  // const id = req.params.id;
  const { id } = req.params;
  const foundStudent = students.find(
    (student) => student.id === parseInt(id, 10)
  );

  // 1a no student - respond 404
  if (!foundStudent) {
    res.status(404).json({
      error: `student with id ${id} not found`,
    });
    return;
  }

  // 2 get the new data from the request
  // 3 update the data in memory
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({
      error: 'firstName and lastName required',
    });
  }

  foundStudent.firstName = firstName;
  foundStudent.lastName = lastName;

  // 4 respond accordingly
  res.json({
    data: foundStudent,
  });
});

app.put('/api/v2/students/:id', (req, res) => {
  // 1 find the student
  // const id = req.params.id;
  const { id } = req.params;
  const studentIdx = students.findIndex(
    (student) => student.id === parseInt(id, 10)
  );

  // 1a no student - respond 404
  if (studentIdx === -1) {
    res.status(404).json({
      error: `student with id ${id} not found`,
    });
    return;
  }

  // 2 get the new data from the request
  // 3 update the data in memory
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({
      error: 'firstName and lastName required',
    });
  }

  students[studentIdx] = {
    id: parseInt(id, 10),
    firstName,
    lastName,
  };

  // 4 respond accordingly
  res.json({
    data: students[studentIdx],
  });
});

// update some properties of a student
app.patch('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  const foundStudent = students.find((student) => student.id === studentId);

  if (!foundStudent) {
    res.status(404).json({
      error: `student with id ${studentId} not found`,
    });
    return;
  }

  // for (const key of ['firstName', 'lastName']) {
  //   if (req.body[key]) foundStudent[key] = req.body[key];
  // }

  res.json({
    data: foundStudent,
  });
});

app.patch('/api/v2/students/:id', (req, res) => {
  // 1 find the student
  // const id = req.params.id;
  const { id } = req.params;
  const studentIdx = students.findIndex(
    (student) => student.id === parseInt(id, 10)
  );

  // 1a no student - respond 404
  if (studentIdx === -1) {
    res.status(404).json({
      error: `student with id ${id} not found`,
    });
    return;
  }

  // 2 get the new data from the request
  // 3 update the data in memory
  const { firstName, lastName } = req.body;
  students[studentIdx] = {
    ...students[studentIdx],
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
  };

  // 4 respond accordingly
  res.json({
    data: students[studentIdx],
  });
});

// destroy the record for a student
app.delete('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);

  const studentIdx = students.findIndex(({ id }) => id === studentId);

  if (studentIdx < 0) {
    res.status(404).json({
      error: `student with id ${studentId} not found`,
    });
    return;
  }
  // const deletedStudent = students[studentIdx];
  const [deletedStudent] = students.splice(studentIdx, 1);

  res.json({
    data: deletedStudent,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Something went wrong', err);
    return;
  }
  console.log(`Server running at ${PORT}`);
});
