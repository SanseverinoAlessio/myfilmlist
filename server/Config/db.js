const mongoose = require('mongoose');
let mongodbServer = process.env.mongodb || "mongodb://127.0.0.1:27017/filmApp";
mongoose.connect(mongodbServer,).catch((err)=>{
  handleError(err);
})
module.exports = mongoose;
