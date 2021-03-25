const mongoose = require("../Config/db.js");
const schema = mongoose.Schema;
const listFilm = new schema({
  film:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "film",
    required:[true,"Inserisci l'id del film"],
  },
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true,"Inserisci l'id dell'utente"],
  },
  vote: {
    type:Number,
    min: [1,"Il voto deve essere superiore a 0"],
    max: [10, "Il voto non può essere superiore a 10"],
  },
  state: {
    type: String,
    required: [true,'Devi aggiungere uno stato'],
    validate: {
      validator: (val)=>{
        return /^(Visto|Da vedere|Incompleto)$/i.test(val);
      },
      message: props=> "Lo stato non è valido",
    }
  }
});
const uniqueValidator = (err,doc,next)=>{
  if(err.name == 'MongoError' && err.code == 11000){
    return next({errors:
      {
        listFilm:{
          message: 'Hai già aggiunto il film alla tua lista',
        }
      } });
    }
    next(err);
  }
  listFilm.index({
    user: 1,
    film: 1,
  }, {unique:true});
  listFilm.post('save',uniqueValidator);
  listFilm.pre('save',function(next){
    if(this.state == 'Da vedere'){
      this.vote = null;
    }
    next();
  });
  listFilm.pre('findOneAndUpdate',function(next){
  
    if(this._update.state == 'Da vedere'){
      this._update.vote = null;
    }
    next();
  });
  module.exports = mongoose.model('listFilm',listFilm,"listFilm");
