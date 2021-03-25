const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const idValidation = ()=>{
  return async (req,res,next)=>{
    let id = req.params.id || req.params.filmid;
    if(!ObjectId.isValid(id)){
      res.status(400).json({
        id: "L'id non è valido",
      });
      return res.end('');
    }
    next();
  }
}
module.exports = idValidation;
