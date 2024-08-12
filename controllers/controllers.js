const db = require("../database/db"); // Import database connection
const Joi = require("joi"); // import joi for data validation
const jwt = require ("jsonwebtoken")
const dotenv = require("dotenv"); // for enviroment variables
dotenv.config(); // Load environment variables from .env file

// Define schema for user validation using Joi
const userSchemaCreateUser = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  image: Joi.string().uri().optional(),
});

const userSchemaUpdateUser = Joi.object({
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
      res.status(200).json(userList);
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

      if (!requestedUser) {
        res.status(404).json({ msg: "User not found" });
        return;
      }

      res.status(200).json(requestedUser);
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error retrieving user", error: error.message });
    }
  },
  createUser: async (req, res) => {
    const { name, email, password, image } = req.body;

    //validate user input
    const validation = userSchemaCreateUser.validate({
      name,
      email,
      password,
      image,
    });

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
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await db.none(`DELETE FROM users WHERE id=$1`, Number(id));

      const userList = await db.many(`SELECT * FROM users ORDER BY id`);

      res.status(200).json({ userList, msg: "user deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Error deleting user", error: error.message });
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
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    const validation = userSchemaUpdateUser.validate({ email, password });

    if (validation.error) {
      res.status(400).json(validation.error.details[0].message);
      return;
    }

    try {
      await db.none(`UPDATE users SET email =$2, password =$3 WHERE id=$1;`, [
        Number(id),
        email,
        password,
      ]);

      const userList = await db.many(`SELECT * FROM users ORDER BY id`);
      res.status(200).json({ userList, msg: "Success!" });
    } catch (error) {
      res
        .status(400)
        .json({ msg: "Error updating user", error: error.message });
    }
  },
  error: async (req, res) => {
    throw new Error("Async error");
  },
  logIn: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.oneOrNone(
        `SELECT * FROM users WHERE email = $1`,
        email
      );

      if (user && user.password === password) {
        const playload = {
          id: user.id,
          email,
        };
        const SECRET = process.env.SECRET;
        const token = jwt.sign(playload, SECRET);
        console.log(token);
        await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [
          user.id,
          token,
        ]);
        res.status(200).json({ id: user.id, email, token });
      } else {
        res.status(400).json({ msg: "Username or password incorrect." });
      }
    } catch (error) {
      res.status(400).json({ msg: "Error log in user", error: error.message });
    }
  },
  signUp: async (req, res)=>{
    const {name, email, password}= req.body

    try{
      const user = await db.oneOrNone(`SELECT * FROM users WHERE email=$1`, email)

    if(user){
      res.status(409).json({msg:"Email already in use."})
    }else{
      const {id}= await db.none(`INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id`, [name, email, password])

      res.status(201).json({id, msg:"User create successfully."})
    }
    }catch(error){
      res.status(400).json({msg:"Error sign user up.", error:error.message})
    }

  },
};

module.exports = controllers;
