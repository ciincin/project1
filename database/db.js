const pgPromise = require("pg-promise"); //import pg-promise library
const db = pgPromise()("postgres://postgres:postgres@localhost:5432/postgres"); //Connect to the postgreSQL database using the connection string

async function setupDB() {
    //Drop the 'users' table if it exixt and create a new 'users' table
  await db.none(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users
      (id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(10) NOT NULL,
      image VARCHAR(255),
      token VARCHAR(255)
      );
        `);


// Insert a new user into the 'users' table
  await db.none(
    `INSERT INTO users (name, email, password, image) VALUES ('cinthya', 'cinthya@gmail.com', 'dummy', '../assets/foto-cv-CinthyaRS.jpg')`
  );

  //Select all users from the 'users' table
  const users = await db.many(`SELECT * FROM users`);

  //log the retrieved users to the console
  console.log(users);
}

//Execute the setupDB function to set up the database
setupDB();

module.exports = db;
