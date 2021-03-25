const s3 = require('./s3Bucket.js');
const fs = require('fs');
const path = require('path');
let aws_storage = process.env.aws_storage || "false";
const deleteFile = (filename)=>{
  let awsStorage = process.env.aws_storage || "false";
  if(awsStorage == "false"){
    return new Promise((resolve,reject)=>{
      let oldImagePath = path.join(__dirname, '../public/images/' + filename);
      fs.unlink(oldImagePath,(err)=>{
        if(err){
          return reject(err);
        }
        resolve(true);
      });
    });
  }
  else{
    return new Promise((resolve,reject)=>{
      s3.deleteObject({
        Bucket: process.env.bucket_name,
        Key: filename,
      }, (err)=>{
        if(err){
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}
module.exports = deleteFile;
