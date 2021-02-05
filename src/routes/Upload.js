const { Router } = require('express');
const multer = require('multer');

const multerConfig = require('../middlewares/multer');

const UploadController = require('../controllers/UploadController');

const Upload = new Router();

Upload.post(
	'/uploads',
	multer(multerConfig).single('file'),
	UploadController.store
);
Upload.get('/uploads', UploadController.index);
Upload.delete('/uploads/:id', UploadController.destroy);

module.exports = Upload;
