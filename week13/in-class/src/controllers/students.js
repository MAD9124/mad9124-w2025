const studentService = require('../services/student');

const create = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.sanitizedBody;
    const newStudent = await studentService.create(
      { firstName, lastName, owner: req.user.id },
      req.files
    );
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
    const { firstName, lastName } = req.sanitizedBody;
    const foundStudent = await studentService.replace(
      req.params.id,
      req.user.id,
      {
        firstName,
        lastName,
      },
      req.files
    );
    res.json({
      data: foundStudent,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const foundStudent = await studentService.update(
      req.params.id,
      req.user.id,
      req.sanitizedBody,
      req.files
    );
    res.json({
      data: foundStudent,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const deletedStudent = await studentService.deleteOne(
      req.params.id,
      req.user.id
    );
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
