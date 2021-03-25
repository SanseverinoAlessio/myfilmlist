const mongoose = require('../Config/db.js');
const schema  =  mongoose.Schema;
const genreSchema  = new schema({
  name: {
    type: String,
    required: [true,'Inserisci il nome del genere'],
    unique: [true,"Esiste già un genere con lo stesso nome"],
  },
  photo: {
    type: String,
    required: [true,'Carica una foto'],
  }
});
genreSchema.post('save',(err,doc,next)=>{
  if(err.name == 'MongoError' && err.code == 11000){
    return next({errors:
      {
        genreExist:{
          message: "Esiste già un genere con lo stesso nome",
        }
      } });
    }
    next(err);
  });
  module.exports = mongoose.model('genre',genreSchema,'genre');
