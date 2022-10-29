const jwt = require('jsonwebtoken' );
const {User} = require('./db');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const auth = async (req , res , next)=>{

  try {

     let user = await User.findOne({name : 'vishal' });
     console.log(user);
     const token = req.cookies.id;

     const user_verify = await jwt.verify(token , 'VISHAL');


     if(user_verify){
       next();
     }

  } catch (e) {
     console.log(e);
     // res.status(200).render("login");
  }

}

module.exports = auth;
