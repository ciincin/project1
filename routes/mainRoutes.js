const express = require('express');
const router = express.Router();
const multer = require('multer');
const controllers = require('../controllers/controllers');

//Set uo Multer storage configuration
const storage = multer.diskStorage({
  // Specify the destination directory for uploades files
  destination: (req, file, cb) => {
    cb(null, 'assets/'); // Store files in the 'assets/' directory
  },
  // Define the naming convention for uploaded files
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Create a unique suffix using timestamp and a random number
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Set the file name as 'fieldname-uniqueSuffix.jpg'
  },
});

// Initialize Multer with the defined storage configuration
const upload = multer({ storage });

// Route for the home page
router.get('/', controllers.home);


// Routes for handling user-related operations
router.get('/users', controllers.getUsers); // Get a list of all users
router.get('/users/:id', controllers.getUserById); // Get details of a specific user by ID
router.post('/users', controllers.createUser); // Create a new user

router.delete("/users/:id", controllers.deleteUser) // Delete a specific user by ID

// Route for uploading a user's image
router.post(
  '/users/:id/image',
  upload.single('user-image'), // Handle file upload for a single file with the field name 'user-image'
  controllers.addUserImage // Add the uploaded image to the user profile
);

// Route for updating a user's details
router.put("/users/:id", controllers.updateUser) // Update a specific user's details by ID

// Route for triggering an error (for testing purposes)
router.get("/error", controllers.error) // This could be used for error handling tests or debugging

router.post("/users/login", controllers.logIn)
router.post("/users/signup", controllers.signUp)





module.exports = router;
