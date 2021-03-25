const mongoose = require('../Config/db.js');
const schema  =  mongoose.Schema;
const filmSchema  = new schema({
  name:{
    type: String,
    required: [true,"Inserisci il nome del film"]
  },
  description:
  {
    type: String,
    required: [true,"Inserisci la descrizione del film"],
  },
  image:{
    type: String,
    required: [true, "Inserisci l'immagine del film"],
  },
  genre:
  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genre",
      required:[true, "É richiesto il genere"],
    }
  ],
  creationTime:
  {
    type: Number,
    default: Date.now(),
  },
  releaseDate:{
    type:Date,
    required: [true,"Aggiungi la data di rilascio del film"],
  }
});
module.exports = mongoose.model('film',filmSchema,"film");
