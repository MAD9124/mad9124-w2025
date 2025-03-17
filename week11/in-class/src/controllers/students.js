const studentService = require('../services/student');

const create = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const newStudent = await studentService.create(firstName, lastName);
    res.status(201).json({
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const students = await studentService.getAll();
    res.status(200).json({
      data: students,
      isFromChrome: req.isFromChrome,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const student = await studentService.getById(req.params.id);
    res.json({
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

const replace = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const foundStudent = await studentService.replace(req.params.id, {
      firstName,
      lastName,
    });
    res.json({
      data: foundStudent,
    });
  } catch (error) {
    next(error);
  }
};

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
