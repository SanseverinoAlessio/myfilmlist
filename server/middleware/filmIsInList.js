let listFilmModel = require('../Models/listFilmModel.js');
const filmIsInList = ()=>{
  return async (req,res,next)=>{
    try{
      let filmId = req.params.filmid;
      let userId = req.decodedToken.id;
      let film = await listFilmModel.findOne({user:userId,film:filmId});
      if(film == undefined || film == null){
        res.status(400).json({
          error: 'Prima di aggiungere una recensione, devi avere il film nella tua lista',
        });
        return res.end('');
      }
      req.vote = film.vote;
      next();
    }
    catch(e){
      res.status(500);
      res.end('');
    }
  }
}
module.exports = filmIsInList;
