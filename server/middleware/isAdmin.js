const userModel = require('../Models/userModel.js');
const isAdmin = ()=>{
  return async (req,res,next)=>{
    let id = req.decodedToken.id;
    try{
      let user = await userModel.findOne({_id: id});
      if(user.admin != true){
        res.status(403);
        return res.end('');
      }
    return next();
    }
    catch(e){
      res.status(404);
      return res.end('');
    }
  }
}
module.exports = isAdmin;
