'use strict';

const express = require('express');
const students = require('./students.json');

const app = express();

app.use(express.json());

// CREATE
// create a new student
app.post('/api/students', (req, res) => {
  // find new student data
  const newStudent = {
    ...req.body,
    id: Date.now(), // NOTE - this is not ideal, but will do for now
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

// app.patch("/api/cars/:id", (req, res) => {}); // update some properties of a car
// app.put("/api/cars/:id", (req, res) => {}); // replace all properties of a car
// app.delete("/api/cars/:id", (req, res) => {}); // destroy the record for a car

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Something went wrong', err);
    return;
  }
  console.log(`Server running at ${PORT}`);
});
