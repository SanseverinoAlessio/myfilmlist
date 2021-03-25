const mongoose = require("../Config/db.js");
const schema = mongoose.Schema;
const passwordToken = new schema({
  token:{
    type: String,
  },
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  createdAt:{
    type:Date,
    default: Date.now,
    expires: 1800,
  }
  });
  module.exports = mongoose.model('passwordToken',passwordToken,"passwordToken");
