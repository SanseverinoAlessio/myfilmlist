const userModel = require('../Models/userModel.js');
const emailExist = ()=>{
  return async (req,res,next)=>{
    let email = req.body.email;
    let user = await userModel.findOne({email:email});
    if(user == null){
      res.status(404);
    return res.end('');
    }
    req.user = user;
    next();
  }
}
module.exports = emailExist;
