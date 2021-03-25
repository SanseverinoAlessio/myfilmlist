const mongoose = require('../Config/db.js');
const bcrypt = require('bcrypt');
const schema  =  mongoose.Schema;
const userSchema  = new schema({
  name:{
    type: String,
    minLenght: [3,"Il nome deve avere almeno 3 caratteri"],
    maxLenght: [15,"Il nome deve avere un massimo di 15 caratteri"],
    required: [true,"Il nome utente, non è stato inserito"],
  },
  email:{
    type: String,
    required: [true,"L'email, non è stata inserita"],
    unique: [true,"L'email è già stata usata"],
    validate: {
      validator: (val)=>{
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(val);
      },
      message: props => "L'email non è corretta"
    },
  },
  password:{
    type:String,
    required: [true,'Inserisci la password'],
    validate: {
      validator: (val)=>{
        return /^(.*)(?=.*[a-z]+)(?=.*[A-Z]{1,})(?=.*\d{2,}).*/.test(val);
      },
      message: props => "La password non è valida",
    }
  },
  avatar: {
    type:String,
  },
  admin:{
    type:Boolean,
  }
});
const uniqueValidator = (err,doc,next)=>{
  if(err.name == 'MongoError' && err.code == 11000){
    return next({errors:
      {
        unique:{
          message: "L'email da te inserita, è già stata utilizzata",
        }
      } }
    );
  }
  next(err);
}
userSchema.post('save',uniqueValidator);
userSchema.post('findOneAndUpdate',uniqueValidator);
userSchema.pre('findOneAndUpdate',async function (next){
  if(this._update.password == undefined){
    next();
    return;
  }
  let salt = await bcrypt.genSalt(10);
  let hashedPassw = await bcrypt.hash(this._update.password,salt);
  this._update.password = hashedPassw;
  next();
});
userSchema.pre('save',async function(next){
  let salt = await bcrypt.genSalt(10);
  let hashedPassw = await bcrypt.hash(this.password,salt);
  this.password = hashedPassw;
  next();
});

module.exports = mongoose.model('user',userSchema);
