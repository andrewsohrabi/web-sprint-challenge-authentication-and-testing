const Users = require('../users/users-model');

const checkUsernameAlreadyExists = async (req,res,next) => {
    const {username} = req.body;
    const userExists = await Users.findBy({username:username})
    if (userExists.length > 0) {
        res.status(401).json({message: "username taken"})
    } else {
        next()
    }
}

const validateRequest = (req,res,next) => {
    const {username,password} = req.body;
    if (!username || !password) {
        res.status(401).json({message:"username and password required"})
    } else {
        next()
    }
}

const checkUsernameExists = async (req, res, next) => {
  
   const {username} = req.body;
   const userExists = await Users.findBy({username:username});
   if (!userExists) {
    res.status(401).json({message: "invalid credentials"})
   } else {
     next()
   }
  }

module.exports = {
    checkUsernameAlreadyExists,
    validateRequest,
    checkUsernameExists
}