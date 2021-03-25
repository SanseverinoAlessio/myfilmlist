const userModel = require('../Models/userModel.js');
const upload = require('../Config/uploadImage.js');
const avatarFile = upload.single('avatar');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const updateOptions = {runValidators: true,useFindAndModify:false};
const errorFormatter = require('../Config/errorFormatter.js');
const reviewModel = require('../Models/review.js');
let aws_storage = process.env.aws_storage || "false";
const deleteFile = require('../Config/deleteFile.js');
const s3 = require('../Config/s3Bucket.js');
const removeAccount = async (req,res)=>{
  let id = req.decodedToken.id;
  try{
    await userModel.findOneAndRemove({_id:id}, {
      useFindAndModify: false
    });
    res.status(200).json({
      deleted: true,
    })
    return res.end('');
  }
  catch(e){
    res.status(500);
    return res.end('');
  }
}
const updateInformation = async (req,res)=>{
  let email = req.body.email;
  let username = req.body.username;
  let id = req.decodedToken.id;
  try{
    await userModel.findOneAndUpdate({_id:id},{
      email: email,
      name: username
    }, updateOptions);
    res.status(200).json({
      updated: true,
    });
    return res.end('');
  }
  catch(e){
    res.status(400).json(errorFormatter(e));
    return res.end('');
  }
}
const updatePassword = async (req,res)=>{
  let oldPassword = req.body.oldPassword || '';
  let newPassword = req.body.newPassword;
  let id = req.decodedToken.id;
  try{
    let user = await userModel.findOne({_id:id});
    if(!bcrypt.compareSync(oldPassword, user.password)){
      res.status(400).json({
        errors: {
          oldPassword: 'La vecchia password non coincide',
        },
      });
      return;
    }
    await userModel.findOneAndUpdate({_id:id},{
      password: newPassword,
    },updateOptions);
    res.status(200).json({
      updated:true,
    });
    return res.end('');
  }
  catch(e){
    res.status(400).json(errorFormatter(e));
    return res.end('');
  }
}
const updateAvatar = async(req,res)=>{
  avatarFile(req,res, async (err)=>{
    if(err){
      res.status(400).json({
        error: err.message,
        uploaded: false,
      });
      return res.end('');
    }
    let id = req.decodedToken.id;
    let file = req.file;
    try{
      if(aws_storage == "true"){
        let params = {
          Bucket:process.env.bucket_name,
          Key: file.filename,
          Body: fs.createReadStream(file.path),
        }
        let stored = await s3.upload(params).promise();
        fs.unlink(file.path,(err)=>{
          if(err){
            console.log('errore!');
          }
        });
      }
      let updated = await userModel.findOneAndUpdate({_id: id}, {
        avatar: file.filename,
      }, {
        useFindAndModify: false,
      });
      if(updated.avatar.length > 0){
      await deleteFile(updated.avatar);
      }
      res.json({
        updated: true,
      });
      return res.end('');
    }
    catch(e){
      console.log(e);
      res.status(500);
      return res.end('');
    }
  });
}
const removeAvatar = async (req,res)=>{
  let userId = req.decodedToken.id;
  try{
    let updated = await userModel.findOneAndUpdate({_id: userId}, {
      avatar: ''}, updateOptions);
      var avatarName = updated.avatar;
      if(avatarName.lenght <= 0){
        res.status(400);
        return res.end('');
      }
    }
    catch(e){
      return res.end('');
    }
    let avatarPath = path.join(__dirname,'../public/avatar/' + avatarName);
    fs.unlink(avatarPath,(err)=>{
      if(err){
        res.status(200).json({
          removed: false,
        });
        return res.end('');
      }
      res.status(200).json({
        removed:true,
      });
      return res.end('');
    });
  }
  const getAccountInfo = async(req,res)=>{
    let id = req.decodedToken.id;
    try{
      let user = await userModel.findOne({_id: id});
      if(user == null){
        res.status(404);
        return res.end('');
      }
      res.status(200).json({
        username: user.name,
        email: user.email,
        avatar: user.avatar,
        admin: user.admin,
      });
      return res.end('');
    }
    catch(e){
      res.status(400);
      return res.end('');
    }
  }
  const isAdmin = (req,res)=>{
    res.status(200);
    res.json({
      admin:true,
    });
    return res.end('');
  }
  module.exports = {
    removeAccount,
    updateInformation,
    updatePassword,
    updateAvatar,
    removeAvatar,
    getAccountInfo,
    isAdmin
  }
