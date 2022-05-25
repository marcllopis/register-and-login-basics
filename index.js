/* We will have a signup process where the user will give:
  - email (required)
  - password (required)
  - name
  - city
  - age
  Then, the user will log in using their email and password
  If they successfully logged in, they will see their user info
*/
require("dotenv").config();
const express = require("express");
const connection = require("./conf");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error(
      `ERROR!!! :/ Connection to the db did not work. Error: ${err}`
    );
    return;
  }
  console.log("GREAT! DB connection is working!");
});

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// path to register a user -> /register
app.post("/register", (req, res) => {
  // we will receive some user info (from postman)
  let myUser = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    city: req.body.city,
    age: req.body.age,
  };
  // we will connect to the DB and store this info in the users table
  // connection.query(`INSERT INTO users (email, password, name, city, age) VALUES ('${req.body.email}', '${req.body.password}', '${req.body.name}', '${req.body.city}', ${req.body.age})`)
  connection.query("INSERT INTO users SET ?", myUser, (err) => {
    // it it did not work, we will send a status code of failure
    if (err) {
      res
        .status(500)
        .send("We had a server error, could not register the user to the DB");
      // if it worked, we will send a status code of success to the end user
    } else {
      res.status(201).send("Success on registering the user!");
    }
  });
});

// path to log in in the app -> /login

app.post("/login", (req, res) => {
  console.log("login!", req.body.email, req.body.password);
  // query in the BD to check email and pass
  connection.query(
    `SELECT * FROM users WHERE email='${req.body.email}' AND password='${req.body.password}'`,
    (err, results) => {
      if (err) {
        res.status(500).send("Sorry, there was an internal error:/");
      } else if (results.length === 0) {
        res
          .status(500)
          .send("Sorry, we could not find a user email with this password :/");
      } else {
        res.status(200).json({
          userId: results[0].id,
          message: "Successfully logged in!",
          token: "7wet827efgh8e2bv92evb92e",
          loggedIn: true,
        });
      }
    }
  );
  // if I get them, I send some user info back
  // if not, error
});

app.listen(port, (err) => {
  if (err)
    throw new Error(
      "Sorry :/ Looks like something is not working as expected!"
    );
  console.log(`Great success! Your server is running at port: ${port}`);
});
