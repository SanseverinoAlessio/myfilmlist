const mongoose = require("../Config/db.js");
const schema = mongoose.Schema;
const review = new schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true,"Inserisci l'id dell'utente"],
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "film",
    required: [true, "Inserisci l'id del film"],
  },
  text:{
    type: String,
    required: [true,"Inserisci il testo della tua recensione"],
    maxLenght: [400,"Puoi inserire un massimo di 400 caratteri"],
    minLenght: [50,"Inserisci almeno 50 caratteri"],
  },
  date: {
    type:Date,
    default: Date.now,  },
  });
  const uniqueValidator = (err,doc,next)=>{
    if(err.name == 'MongoError' && err.code == 11000){
      return next({errors:
        {
          review:{
            message: 'Hai già aggiunto una recensione su questo film',
          }
        }
      });
      }
      next(err);
    }
    review.index({
      user: 1,
      film: 1,
    }, {unique:true});
    review.post('save',uniqueValidator);
    review.post('findOneAndUpdate',uniqueValidator);
    module.exports = mongoose.model('review',review,"review");
