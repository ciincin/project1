const db = require("../database/db"); // Import database connection
const Joi = require("joi"); // import joi for data validation
const dotenv = require("dotenv"); // for enviroment variables
dotenv.config(); // Load environment variables from .env file

// Define schema for user validation using Joi
const userSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  image: Joi.string().uri().optional(),
});

const controllers = {
  home: (req, res) => {
    res.send("working"); // Simple home route to check if server is working
  },
  getUsers: async (req, res) => {
    try {
      const userList = await db.many(`SELECT * FROM users ORDER BY id`); // Fetch all users
      res.status(200).json({ userList, msg: "success!" });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error retrieving users", error: error.message });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch user by ID
      const requestedUser = await db.oneOrNone(
        `SELECT *FROM users WHERE id =$1 ORDER BY id`,
        Number(id)
      );

      res.status(200).json({ requestedUser, msg: "success!" });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error retrieving user", error: error.message });
    }
  },
  createUser: async (req, res) => {
    const { name, email, password, image } = req.body;

    //validate user input
    const validation = userSchema.validate({ name, email, password, image });

    if (validation.error) {
      res.status(400).json(validation.error.details[0].message);
      return;
    }

    try {
      await db.none(
        `INSERT INTO users (name, email, password, image) VALUES ($1, $2, $3, $4)`,
        [name, email, password, image]
      );

      const usersList = await db.many(`SELECT * FROM users ORDER BY id`); // Fetch all users after insertion

      res.status(201).json({ usersList, msg: "New user created!" });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error creating user", error: error.message });
    }
  },
  addUserImage: async (req, res) => {
    const { id } = req.params;

    if (!req.file || !req.file.path) {
      res.status(400).json({ msg: "No image file uploaded" });
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

      res.status(200).json({ userList, msg: "success!" });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error updating user image", error: error.message });
    }
  },
  error:async(req, res)=>{
    throw new Error ("Async error")
  },
};

module.exports = controllers;
