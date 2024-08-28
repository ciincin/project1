const db = require("../database/db.js"); // Import database connection
const Joi = require("joi"); // import joi for data validation
const jwt = require("jsonwebtoken"); // for generating tokens
const dotenv = require("dotenv"); // for enviroment variables
dotenv.config(); // Load environment variables from .env file
const bcrypt = require("bcrypt"); // to hash the password before save it in db
const saltRounds = 10; //the legth of the hash password

// Define schema for user validation using Joi for user creation
const userSchemaCreateUser = Joi.object({
  firstname: Joi.string().alphanum().required(), // Name must be an alphanumeric string and is required
  lastname: Joi.string().alphanum().required(),
  username: Joi.string().alphanum().required(),
  email: Joi.string().email().required(), // Email must be a valid email format and is required
  password: Joi.string().min(6).required(), // Password must be at least 6 characters long and is required
  image: Joi.string().uri().optional(), // Image is optional and must be a valid URI if provided
});

// Define schema for user validation using Joi for user updates
const userSchemaUpdateUser = Joi.object({
  email: Joi.string().email().required(), // Email must be valid and is required
  password: Joi.string().min(6).required(), // Password must be at least 6 characters and is required
  image: Joi.string().uri().optional(), // Image is optional and must be a valid URI if provided
});

// Define the controllers object with various methods to handle different routes
const controllers = {
  // Home route to check if the server is working
  home: (req, res) => {
    res.send("working"); // Send a simple response to indicate server is working
  },
  // Fetch all users from the database
  getUsers: async (req, res) => {
    try {
      const userList = await db.many(`SELECT * FROM users ORDER BY id`); // Get all users ordered by ID
      res.status(200).json(userList); // Send the user list in response
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error retrieving users", error: error.message }); // Handle errors with a 500 status
    }
  },
  // Fetch a specific user by ID from the database
  getUserById: async (req, res) => {
    const { id } = req.params; // Get the user ID from the request parameters

    try {
      // Fetch user by ID
      const requestedUser = await db.oneOrNone(
        `SELECT * FROM users WHERE id =$1 ORDER BY id`,
        Number(id)
      ); // Fetch the user with the given ID

      if (!requestedUser) {
        res.status(404).json({ msg: "User not found" }); // If user not found, respond with 404
        return;
      }

      res.status(200).json(requestedUser); // Send the requested user in response
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error retrieving user", error: error.message }); // Handle errors with a 500 status
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    const { firstname, lastname, username, email, password, image } = req.body; // Get user data from request body

    // Validate user input using Joi
    const validation = userSchemaCreateUser.validate({
      firstname,
      lastname,
      username,
      email,
      password,
      image,
    });

    if (validation.error) {
      res.status(400).json(validation.error.details[0].message); // If validation fails, send a 400 error
      return;
    }

    try {
      // Insert the new user into the database
      await db.none(
        `INSERT INTO users (firstname, lastname, username, email, password, image) VALUES ($1, $2, $3, $4, $5, $6)`,
        [firstname, lastname, username, email, password, image]
      );

      const usersList = await db.many(`SELECT * FROM users ORDER BY id`); // Fetch all users after insertion

      res.status(201).json({ usersList, msg: "New user created!" }); // Respond with the updated user list and a success message
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error creating user", error: error.message }); // Handle errors with a 500 status
    }
  },

  // Delete a specific user by ID
  deleteUser: async (req, res) => {
    const { id } = req.params; // Get the user ID from request parameters
    try {
      await db.none(`DELETE FROM users WHERE id=$1`, Number(id)); // Delete the user with the given ID

      const userList = await db.many(`SELECT * FROM users ORDER BY id`); // Fetch the updated list of users

      res.status(200).json({ userList, msg: "user deleted successfully" }); // Respond with the updated user list and a success message
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error deleting user", error: error.message }); // Handle errors with a 500 status
    }
  },

  // Add an image to a user's profile
  addUserImage: async (req, res) => {
    const { id } = req.params; // Get the user ID from request parameters

    if (!req.file || !req.file.path) {
      res.status(400).json({ msg: "No image file uploaded" }); // If no image was uploaded, respond with a 400 error
      return;
    }

    try {
      //Update user image
      await db.none(`UPDATE users SET image=$2 WHERE id=$1`, [
        Number(id),
        req.file.path,
      ]);

      //Fetch all users after update
      const userList = await db.many(`SELECT * FROM users ORDER BY id`);

      res.status(200).json({ userList, msg: "success!" }); // Respond with the updated user list and a success message
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error updating user image", error: error.message }); // Handle errors with a 500 status
    }
  },

  // Update a user's details
  updateUser: async (req, res) => {
    const { id } = req.params; // Get the user ID from request parameters
    const { email, password } = req.body; // Get updated user data from request body

    // Validate user input using Joi
    const validation = userSchemaUpdateUser.validate({ email, password });

    if (validation.error) {
      res.status(400).json(validation.error.details[0].message); // If validation fails, send a 400 error
      return;
    }

    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update the user's email and password in the database
      await db.none(`UPDATE users SET email =$2, password =$3 WHERE id=$1;`, [
        Number(id),
        email,
        hashedPassword,
      ]);

      const userList = await db.many(`SELECT * FROM users ORDER BY id`); // Fetch all users after update
      res.status(200).json({ userList, msg: "Success!" }); // Respond with the updated user list and a success message
    } catch (error) {
      res
        .status(400)
        .json({ msg: "Error updating user", error: error.message }); // Handle errors with a 400 status
    }
  },

  // Example route to trigger an error (for testing purposes)
  error: async (req, res) => {
    throw new Error("Async error"); // Throw an error to test error handling
  },

  // Handle user login
  logIn: async (req, res) => {
    const { email, password } = req.body; // Get email and password from request body

    try {
      console.log("Starting login process...");
      const user = await db.oneOrNone(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      ); // Fetch the user by email

      console.log("User fetched from DB:", user);
      if (user) {
        //Compare the password provided with the hashed password stored in db
        const match = await bcrypt.compare(password, user.password);

        console.log("Password match result:", match);
        if (match) {
          // If user is found and password matches
          const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
          }; // Create a payload for the JWT

          console.log("UNO")
          const SECRET = process.env.SECRET; // Get the secret key from environment variables
          console.log("DOS")
          const token = jwt.sign(payload, SECRET); // Sign the JWT with the payload and secret
          console.log("TRES")
          console.log(token); // Log the token (for debugging)
          console.log("CUATRO")

          const query = "UPDATE users SET token="+token+" WHERE id="+user.id;
          console.log(query)

          await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [
            user.id,
            token,
          ]); // Update the user's token in the database
          console.log("CINCO");

          res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            token,
          }); // Respond with the user ID, email, and token
          console.log("SEIS");

        } else {
          res.status(400).json({ msg: "Username or password incorrect." }); // If authentication fails, respond with a 400 error
        }
      } else {
        res.status(400).json({ msg: "Username or password incorrect." }); // If authentication fails, respond with a 400 error
      }
    } catch (error) {
      res.status(400).json({ msg: "Error log in user oooooooooo", error: error.message }); // Handle errors with a 400 status
    }
  },

  // Handle user signup
  signUp: async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body; // Get name, email, and password from request body

    try {
      const user = await db.oneOrNone(
        `SELECT * FROM users WHERE email=$1`,
        email
      ); // Check if the user already exists

      if (user) {
        res.status(409).json({ msg: "Email already in use." }); // If user exists, respond with a 409 conflict error
      } else {
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user and return the new user's ID
        const { id } = await db.one(
          `INSERT INTO users (firstname, lastname, username, email, password) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
          [firstname, lastname, username, email, hashedPassword]
        );
        res.status(201).json({ id, msg: "User create successfully." }); // Respond with the new user's ID and a success message
      }
    } catch (error) {
      res.status(400).json({ msg: "Error sign user up.", error: error }); // Handle errors with a 400 status
    }
  },

  // Handle user logout
  logOut: async (req, res) => {
    const user = req.body; // Get user data from request body

    try {
      await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, null]); // Clear the user's token in the database
      res.status(200).json({ msg: "log out success" }); // Respond with a success message
    } catch (error) {
      res
        .status(400)
        .json({ msg: "Error loging out user", error: error.message }); // Handle errors with a 400 status
    }
  },
};

module.exports = controllers;
