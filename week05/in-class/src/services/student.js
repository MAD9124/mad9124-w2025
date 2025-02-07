const { NotFoundError } = require('../middleware/errors');
const students = require('../models/students.json');

const create = (firstName, lastName) => {
  // find new student data
  const newStudent = {
    id: Date.now(), // NOTE - this is not ideal, but will do for now
    firstName,
    lastName,
  };

  // save new student in our array
  students.push(newStudent);

  return newStudent;
};

const getAll = () => students;

const getById = (id) => {
  const student = students.find((s) => s.id === id);

  if (!student) throw new NotFoundError(`student with id ${id} not found`);

  return student;
};

const replace = (id, body) => {
  const foundStudent = students.find((student) => student.id === id);

  // 1a no student - respond 404
  if (!foundStudent) throw new NotFoundError(`student with id ${id} not found`);

  // 2 get the new data from the request
  // 3 update the data in memory
  const { firstName, lastName } = body;

  if (!firstName || !lastName)
    throw new BadRequestError('firstName and lastName required');

  foundStudent.firstName = firstName;
  foundStudent.lastName = lastName;

  return foundStudent;
};

const update = (id, body) => {
  const foundStudent = students.find((student) => student.id === id);

  if (!foundStudent) throw new NotFoundError(`student with id ${id} not found`);

  for (const key of ['firstName', 'lastName']) {
    if (body[key]) foundStudent[key] = body[key];
  }

  return foundStudent;
};

const deleteOne = (id) => {
  const studentIdx = students.findIndex((s) => s.id === id);

  if (studentIdx < 0)
    throw new NotFoundError(`student with id ${id} not found`);

  const [deletedStudent] = students.splice(studentIdx, 1);

  return deletedStudent;
};

module.exports = {
  create,
  getAll,
  getById,
  replace,
  update,
  deleteOne,
};
