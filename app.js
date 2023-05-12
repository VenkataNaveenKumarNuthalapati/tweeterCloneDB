const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "twitterClone.db");
let db;
const bcrypt = require("bcrypt");

const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://Localhost:3000/");
    });
  } catch (error) {
    console.log(`Error Message: ${error.message}`);
  }
};
initializeDbServer();

// API 1
app.post("/register/", async (request, response) => {
  const { username, name, password, gender } = request.body;
  let isUserExist = `select * from user where username = '${username}'`;
  isUserExist = await db.get(isUserExist);
  if (isUserExist === undefined) {
    if (password.length >= 6) {
      try {
        const hashPassword = await bcrypt.hash(password, 10);

        let insertQuery = `INSERT INTO user (username, name, password, gender) 
                            VALUES('${username}', '${name}', '${hashPassword}', '${gender}');`;
        let result = await db.run(insertQuery);
        console.log(result.lastID);
        response.status(200);
        response.send("User created successfully");
      } catch (error) {
        console.log(`Db Error: ${error.message}`);
      }
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

module.exports = app;
