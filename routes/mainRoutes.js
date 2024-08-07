const express = require('express');
const router = express.Router();
const multer = require('multer');
const controllers = require('../controllers/controllers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  },
});

const upload = multer({ storage });

router.get('/', controllers.home);

router.get('/users', controllers.getUsers);
router.get('/users/:id', controllers.getUserById);
router.post('/users', controllers.createUser);

router.delete("/users/:id", controllers.deleteUser)
router.post(
  '/users/:id/image',
  upload.single('user-image'),
  controllers.addUserImage
);

router.put("/users/:id", controllers.updateUser)

router.get("/error", controllers.error)

module.exports = router;
