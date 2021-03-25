const userModel = require('../Models/userModel.js');
const passwordToken = require('../Models/passwordToken.js');
const reviewModel = require('../Models/review.js');
const listModel = require('../Models/listFilmModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorFormatter = require('../Config/errorFormatter.js');
const email = require('../Config/email');

const crypto = require('crypto');
const updateOptions = {
  useFindAndModify: false,
  runValidators: true,
}
const register = async (req,res)=>{
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  try{
    let user = new userModel({
      name: username,
      email: email,
      password: password,
      avatar: '',
      admin: false,
    });
    await user.save();
    res.status(200).json({
      completed: true,
    });
    return res.end('');
  }
  catch(e){
    res.status(400);
    let errors = errorFormatter(e);
    res.json(errors);
    return res.end('');
  }
}
const login = async (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  try{
    let user = await userModel.findOne({email:email});
    if(!bcrypt.compareSync(password,user.password)){
      res.status(401);
      return res.end('');
    }
    let key = process.env.key || "default";
    jwt.sign({id:user._id},key,(err,token)=>{
      if(err){
        res.status(500);
        return res.end('');
      }
      res.status(200);
      res.json({
        logged: true,
        token: token
      });
      return res.end('');
    });
  }
  catch(e){
    res.status(404);
    res.end('');
  }
}
const getUserByEmail = async (req,res)=>{
  let email = req.params.email;
  try{
    let user = await userModel.findOne({email:email});
    /*if(user == null){
    res.status(404);
    res.json({found:false});
    return res.end('');
  }*/
  res.json({
    username: user.name,
    email: user.email,
    found:true,
  });
  return res.end('');
}
catch(e){
  res.json({
    error:true
  });
  return res.end('');
}
}
const getUsers = async (req,res)=>{
  let page = parseInt(req.query.page) || 1;
  let perpage = parseInt(req.query.perpage) || 10;
  let skip = (page - 1) * perpage;
  try{
    let users = await userModel.find({},{password:0,avatar:0}).limit(perpage).skip(skip);
    let totalItems = await userModel.countDocuments();
    let totalPages = Math.ceil(totalItems / perpage);
    res.status(200).json({
      result: users,
      meta:{
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: page,
      }
    });
    return res.end('');
  }
  catch(e){
    res.status(500);
    return res.end('');
  }
}
const deleteUser = async(req,res)=>{
  let userId = req.params.id;
  try{
    let  deleted = await userModel.findOneAndDelete({
      _id:userId,},
      {useFindAndModify:false});
      await listModel.deleteMany({user:userId});
      await reviewModel.deleteMany({user:userId});
      if(deleted == null){
        res.status(404);
        return res.end('');
      }
      res.status(200);
      return res.end('');
    }
    catch(e){
      res.status(500);
      return res.end('');
    }
  }
  const updateAdmin = async(req,res)=>{
    let userId = req.params.id;
    let admin = req.body.admin || false;
    console.log(admin);
    console.log(userId);
    try{
      let updated = await userModel.findOneAndUpdate({
        _id: userId},
        {admin:admin},
        updateOptions);
        console.log(updated);
        if(updated == null){
          res.status(404);
          return res.end('');
        }
        res.status(200);
        res.end('');
      }
      catch(e){
        res.status(400).json(errorFormatter(e));
        return res.end('');
      }
    }
    const getUsersByQuery = async (req,res)=>{
      let query = req.params.name;
      try{
        let users = await userModel.find({
          $or: [
            {
              name: {
                $regex: query,
                $options: 'i',
              }
            },
            {
              email: {
                $regex: query,
                $options: 'i',
              }
            }
          ],
        },
        {avatar:0,password:0}
      );
      res.status(200).json(users);
      return res.end('');
    }
    catch(e){
      res.status(500);
      return res.end('');
    }
  }
  const createPasswordToken = (req,res)=>{
    crypto.randomBytes(64,async(err,buffer)=>{
      if(err){
        console.log(e);
        res.status(500);
        return res.end('');
      }
      let generatedToken = buffer.toString('hex');
      try{
        let token = new passwordToken({
          token: generatedToken,
          user: req.user._id,
        });
        await token.save();
        let origin = process.env.origin || "http://localhost:4200";
        let info = await email.sendMail({
          from: process.env.email,
          to: req.user.email,
          subject: 'Reimposta la tua password',
          text: `Ecco il link per reimpostare la tua password: ${origin}/account/resetpassword/${generatedToken}`,
        });
        res.status(200);
        return res.end('');
      }
      catch(e){
        console.log(e);
        res.status(500);
        return res.end('');
      }
    });
  }
  const resetPassword = async (req,res)=>{
    let newPassword = req.body.newPassword;
    let requestToken = req.params.token;
    let token = await passwordToken.findOneAndDelete({token: requestToken});
    try{
      await userModel.findOneAndUpdate({_id:token.user},{password: newPassword},updateOptions);
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
  const passwordTokenExist = (req,res)=>{
    res.status(200);
    return res.end('');
  }
  module.exports = {
    register,
    login,
    getUserByEmail,
    getUsers,
    deleteUser,
    updateAdmin,
    getUsersByQuery,
    createPasswordToken,
    resetPassword,
    passwordTokenExist
  }
