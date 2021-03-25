const passwordTokenModel = require('../Models/passwordToken.js');
const passwordToken = ()=>{
  return async (req,res,next)=>{
    let requestToken = req.params.token;
    let token = await passwordTokenModel.findOne({token: requestToken});
    if(token == null){
      res.status(404);
      return res.end('');
    }
    next();
  }
}
module.exports = passwordToken;
