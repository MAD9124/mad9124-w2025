const { Router } = require('express');

const studentController = require('../controllers/students');

const router = Router();

router.post('/', studentController.create);
router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.put('/:id', studentController.replace);
router.patch('/:id', studentController.update);
router.delete('/:id', studentController.deleteOne);

module.exports = router;
