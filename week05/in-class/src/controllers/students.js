const { NotFoundError, BadRequestError } = require('../middleware/errors');
const students = require('../models/students.json');
const studentService = require('../services/student');

// CREATE
// create a new student
const create = (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    const newStudent = studentService.create(firstName, lastName);

    // respond with new student (including it's id)
    res.status(201).json({
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

// READ
// return a collection of students
const getAll = (req, res, next) => {
  try {
    const students = studentService.getAll();
    res.status(200).json({
      data: students,
      isFromChrome: req.isFromChrome,
    });
  } catch (error) {
    next(error);
  }
};

// return the student matching the id value
const getById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const student = studentService.getById(id);

    res.json({
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// replace all properties of a student
const replace = (req, res, next) => {
  try {
    // 1 find the student
    // const id = req.params.id;
    const id = parseInt(req.params.id, 10);
    const { firstName, lastName } = req.body;

    const foundStudent = studentService.replace(id, { firstName, lastName });

    // 4 respond accordingly
    res.json({
      data: foundStudent,
    });
  } catch (error) {
    next(error);
  }
};

// update some properties of a student
const update = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const foundStudent = studentService.update(id, req.body);

    res.json({
      data: foundStudent,
    });
  } catch (error) {
    next(error);
  }
};

// destroy the record for a student
const deleteOne = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const deletedStudent = studentService.deleteOne(id);

    res.json({
      data: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  replace,
  update,
  deleteOne,
};
