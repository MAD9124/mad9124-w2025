const multer = require('multer');

const addImages = multer().array('images');

module.exports = addImages;
