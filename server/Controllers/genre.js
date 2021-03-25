let genreModel = require('../Models/genreModel.js');
let filmModel = require('../Models/filmModel.js');
const path = require('path');
const fs = require('fs');
const errorFormatter = require('../Config/errorFormatter.js');
const upload = require('../Config/uploadImage.js');
const genrePhoto = upload.single('photo');
let aws_storage = process.env.aws_storage || "false";
const s3 = require("../Config/s3Bucket.js");
const deleteFile = require('../Config/deleteFile.js');
const updateOptions = {
  useFindAndModify: false,
  runValidators: true,
}
const getGenres = async (req,res)=>{
  let all = req.query.all || false;
  let page = parseInt(req.query.page) || 1;
  let perpage = parseInt(req.query.perpage) || 10;
  let skip =  (page - 1) * perpage;
  try{
    if(all == 'true'){
      let genres = await genreModel.find();
      res.status(200).json(genres);
      return res.end('');
    }
    let genres = await genreModel.find().skip(skip).limit(perpage);
    let totalItems = await genreModel.countDocuments();
    let totalPages = Math.ceil(totalItems / perpage);
    res.status(200).json({
      result: genres,
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
const create = async (req,res)=>{
  genrePhoto(req,res, async (err)=>{
    if(err){
      res.status(400).json({
        error: err.message,
      });
      return res.end('');
    }
    let image = req.file;
    let name = req.body.name;
    try{
      if(aws_storage == "true"){
        let params = {
          Bucket:process.env.bucket_name,
          Key: image.filename,
          Body: fs.createReadStream(image.path),
        }
        let stored = await s3.upload(params).promise();
        fs.unlink(image.path,(err)=>{
          if(err){
            console.log('errore!');
          }
        });
      }
      let genre = new genreModel({
        name: name,
        photo: image.filename,
      });
      await genre.save();
      res.status(200).json({
        added: true,
      });
      return res.end('');
    }
    catch(e){
      res.status(400).json(errorFormatter(e));
      return res.end('');
    }
  });
}
const deleteOne = async (req,res)=>{
  let id = req.params.id;
  console.log(id);
  try{
    let deleted =  await genreModel.findOneAndRemove({_id:id}, {
      useFindAndModify:false
    });
    let prova = await filmModel.update({},{$pullAll:{genre:[id]}});
    console.log(prova);
   await deleteFile(deleted.photo);
    res.status(200).json({
      deleted: true,
    });
    return res.end('');
  }
  catch(e){
    console.log(e);
    res.status(500);
    return res.end('');
  }
}
const update = async (req,res)=>{
  genrePhoto(req,res, async (err)=>{
    let image = req.file;
    let id = req.params.id;
    let name = req.body.name;
    try{
      if(image == undefined){
        await genreModel.findOneAndUpdate({_id:id},{
          name: name,
        },updateOptions);
        res.status(200).json({
          updated: true,
        });
        return res.end('');
      }
      let updated = await genreModel.findOneAndUpdate({_id:id},
        {name: name, photo: image.filename,
        },updateOptions);
        if(aws_storage == "true"){
          let params = {
            Bucket:process.env.bucket_name,
            Key: image.filename,
            Body: fs.createReadStream(image.path),
          }
          let stored = await s3.upload(params).promise();
          fs.unlink(image.path,(err)=>{
            if(err){
              console.log('errore!');
            }
          });
        }
        await deleteFile(updated.photo);
        res.status(200).json({
          updated: true
        });
        return res.end('');
      }
      catch(e){
        console.log(e);
        res.status(400).json(errorFormatter(e));
        return res.end('');
      }
    });
  }
  const search = async(req,res)=>{
    let query = req.params.query;
    try{
      let genres = await genreModel.find({
        name: {
          $regex: query,
          $options: 'i',
        }
      });
      res.status(200).json(genres);
      res.end('');
    }
    catch(e){
      res.status(500);
      res.end('');
    }
  }
  const getById = async(req,res)=>{
    let id = req.params.id;
    try{
      var genre = await genreModel.findOne({_id:id});
      if(genre == null){
        res.status(404);
        return res.end('');
      }
      res.status(200).json(genre);
      return res.end('');
    }
    catch(e){
      res.status(500);
      return res.end('');
    }
  }
  module.exports = {
    getGenres,
    create,
    deleteOne,
    update,
    search,
    getById
  }
