const { NotFoundError, ForbiddenError } = require('../middleware/errors');
const Student = require('../models/Student');
const imageService = require('./images');

const create = async (body, files) => {
  const urls = await imageService.uploadMany(files);

  const newStudent = new Student({
    ...body,
    images: urls,
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

const replace = async (studentId, userId, body, files) => {
  const foundStudent = await Student.findById(studentId).select('owner');

  if (!foundStudent)
    throw new NotFoundError(`student with id ${studentId} not found`);
  if (foundStudent.owner.toString() !== userId)
    throw new ForbiddenError('Not your student');

  const urls = await imageService.uploadMany(files);
  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    { ...body, images: urls },
    { runValidators: true, new: true }
  );

  return updatedStudent;
};

const update = async (studentId, userId, body, files) => {
  const foundStudent = await Student.findById(studentId).select('owner');

  if (!foundStudent)
    throw new NotFoundError(`student with id ${studentId} not found`);
  if (foundStudent.owner.toString() !== userId)
    throw new ForbiddenError('Not your student');

  if (Array.isArray(files) && files.length) {
    body.images = await imageService.uploadMany(files);
  }

  const updatedStudent = await Student.findByIdAndUpdate(studentId, body, {
    runValidators: true,
    new: true,
  });

  return updatedStudent;
};

const deleteOne = async (studentId, userId) => {
  const deletedStudent = await Student.findById(studentId);

  if (!deletedStudent)
    throw new NotFoundError(`student with id ${studentId} not found`);
  if (deletedStudent.owner.toString() !== userId)
    throw new ForbiddenError('Not your student');

  await Student.deleteOne({ _id: studentId });

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
