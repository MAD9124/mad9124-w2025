const { NotFoundError } = require('../middleware/errors');
const Student = require('../models/Student');
const students = require('../models/students.json');

const create = async (firstName, lastName) => {
  const newStudent = new Student({
    firstName,
    lastName,
  });
  await newStudent.save();
  return newStudent;
};

const getAll = async () => {
  const allStudents = await Student.find({});
  return allStudents;
};

const getById = async (id) => {
  const student = await Student.findById(id);

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
