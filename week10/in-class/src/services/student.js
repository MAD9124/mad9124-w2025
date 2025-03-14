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

const replace = async (id, body) => {
  const foundStudent = Student.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!foundStudent) throw new NotFoundError(`student with id ${id} not found`);

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
