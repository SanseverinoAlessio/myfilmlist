const jwt = require('jsonwebtoken');
const verifyToken = ()=>{
  return (req,res,next)=>{
    let token = req.get('Authorization');
    if(token == undefined){
      res.status(401);
      return  res.end('');
    }
    token = token.split(' ');
    let key = 'default' || process.env.key;
    jwt.verify(token[1],key,(err,decoded)=>{
      if(err){
        res.status(401);
        return res.end('');
      }
      req.decodedToken = decoded;
      return  next();
    });
  }
}
module.exports = verifyToken;
