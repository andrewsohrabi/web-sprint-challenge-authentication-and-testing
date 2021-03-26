const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const usersRouter = require("./users/users-router.js");


const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!
server.use("/api/users", usersRouter);

server.get('/', (req,res)=> {
    res.status(200).json({
        message: 'api up'
    })
})

module.exports = server;
