const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { checkUsernameAlreadyExists, validateRequest, checkUsernameExists } = require('./auth-middleware')
const Users = require('../users/users-model')
const { JWT_SECRET } = require('../../config/secrets')

router.post('/register',checkUsernameAlreadyExists,validateRequest, (req, res, next) => {

  const credentials = req.body;
  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcryptjs.hashSync(credentials.password, rounds);
  credentials.password = hash;

  Users.add(credentials)
    .then(user => {
      res.status(201).json(user);
    }).catch(error => {
      res.status(500).json({ message: error.message });
    })

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', validateRequest,checkUsernameExists, async (req, res) => {

  const { username, password } = req.body;
  const [User] = await Users.findBy({username:username})

  if (User && bcryptjs.compareSync(password, User.password)) {
    const token = buildToken(User);
      res.status(200).json({
        message: `welcome, ${User.username}`,
        token: token
    })
  } else {
    res.status(401).json({ message: "invalid credentials" });
  }

  //res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const config = {
    expiresIn: '1d',
  }
  return jwt.sign(
    payload, JWT_SECRET, config
  )
}

module.exports = router;
