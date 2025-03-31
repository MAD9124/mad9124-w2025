const { Router } = require('express');

const studentController = require('../controllers/students');
const sanitizeBody = require('../middleware/sanitizeBody');
const validateStudent = require('../middleware/validateStudent');
const validObjectId = require('../middleware/validObjectId');
const addImages = require('../middleware/addImages');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = Router();

router.post(
  '/',
  isAuthenticated,
  addImages,
  sanitizeBody,
  validateStudent(true),
  studentController.create
);
router.get('/', studentController.getAll);

router.get('/:id', validObjectId, studentController.getById);
router.put(
  '/:id',
  isAuthenticated,
  validObjectId,
  addImages,
  sanitizeBody,
  validateStudent(true),
  studentController.replace
);
router.patch(
  '/:id',
  isAuthenticated,
  validObjectId,
  addImages,
  sanitizeBody,
  validateStudent(false),
  studentController.update
);
router.delete(
  '/:id',
  isAuthenticated,
  validObjectId,
  studentController.deleteOne
);

module.exports = router;
