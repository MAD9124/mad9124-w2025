const { Router } = require('express');

const studentController = require('../controllers/students');
const validateStudent = require('../middleware/validateStudent');
const validObjectId = require('../middleware/validObjectId');

const router = Router();

router.post('/', validateStudent(true), studentController.create);
router.get('/', studentController.getAll);

router.get('/:id', validObjectId, studentController.getById);
router.put(
  '/:id',
  validObjectId,
  validateStudent(true),
  studentController.replace
);
router.patch(
  '/:id',
  validObjectId,
  validateStudent(false),
  studentController.update
);
router.delete('/:id', validObjectId, studentController.deleteOne);

module.exports = router;
