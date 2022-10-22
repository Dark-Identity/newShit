const jwt = require('jsonwebtoken' );
// const user = require('../register');

const auth = async (req , res , next)=>{
  try {

     const token = req.cookies.jwt;
     const user_verify = jwt.verify(token , 'hey');
     next();

  } catch (e) {
     // res.send(e)
     res.status(200).render("login");
  }

}

module.exports = auth;
