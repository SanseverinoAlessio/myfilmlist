const filmModel = require('../Models/filmModel.js');
const reviewModel = require('../Models/review.js');
const listModel = require('../Models/listFilmModel.js');
const upload = require('../Config/uploadImage.js');
const filmPhoto = upload.single('photo');
const mongoose = require('mongoose');
const path = require('path');
let aws_storage = process.env.aws_storage || "false";
const fs = require('fs');
const errorFormatter = require('../Config/errorFormatter.js');
const updateOptions = {runValidators: true,useFindAndModify:false};
const genreModel = require("../Models/genreModel.js");
const s3 = require("../Config/s3Bucket.js");
const deleteFile = require('../Config/deleteFile.js');
const getFilm = async(req,res)=>{
  let id = req.params.id;
  let film = await filmModel.aggregate([
    {
      $lookup:
      {
        from:'listFilm',
        localField: '_id',
        foreignField: 'film',
        as: 'userVote',
      },
    },
    {
      $lookup:{
        from: 'genre',
        localField: 'genre',
        foreignField: '_id',
        as: 'genre',
      }
    },
    {
      $match:{
        "_id":new mongoose.Types.ObjectId(id),
      }
    },

    {
      $addFields:{
        avg:{
          $avg:"$userVote.vote",
        }
      }
    },
    {
      $project:{
        "vote":{
          $round: ["$avg",2]
        },
        description:1,
        genre:1,
        releaseDate:1,
        image:1,
        name:1
      }
    }
  ]);
  console.log(film);
  if(film.length <= 0){
    res.status(404);
    return res.end('');
  }
  film = film[0];
  res.status(200).json(film);
  return res.end('');
}
const removeFilm = async (req,res)=>{
  let id = req.params.id;
  try{
    let deleted = await filmModel.findOneAndRemove({_id: id}, {
      useFindAndModify:false});
      await listModel.deleteMany({film: id});
      await reviewModel.deleteMany({film:id});
      await deleteFile(deleted.image);
      res.status(200);
      return res.end('');
    }
    catch(e){
      res.status(500);
      return res.end('');
    }
  }
  const createFilm = async (req,res)=>{
    filmPhoto(req,res,async (err)=>{
      if(err){
        res.status(400).json({
          error: err.message,
        });
        return res.end('');
      }
      let name = req.body.name;
      let description = req.body.description;
      let image = req.file;
      let genres = req.body.genres;
      let releaseDate = req.body.releaseDate;
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
        let film = new filmModel({
          name: name,
          description: description,
          image: image.filename,
          genre: genres,
          releaseDate: releaseDate,
        });
        await film.save();
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
  const updateFilm = async (req,res)=>{
    filmPhoto(req,res,async(err)=>{
      let genres = req.body.genres;
      let id = req.params.id;
      let name = req.body.name
      let description = req.body.description;
      let image = req.file;
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
        if(image != undefined){
          let updated = await filmModel.findOneAndUpdate({_id:id}, {
            name: name,
            image: image.filename,
            description: description,
            genre: genres,
          },updateOptions
        );
        let deletedImage = await deleteFile(updated.image);
        console.log(deletedImage);
        res.status(200).json({
          updated: true
        });
        return res.end('');
      }
      else{
        let updated = await filmModel.findOneAndUpdate({_id:id}, {
          name: name,
          description: description,
          genre: genres,
        },updateOptions
      );
      res.status(200).json({
        updated: true
      });
      return res.end('');
    }
  }
  catch(e){
    console.log(e);
    res.status(400).json(errorFormatter(e));
    return res.end('');
  }
});
}
const getFilms = async (req,res)=>{
  let perPage = parseInt(req.query.perpage) || 10;
  let genre = req.query.genre || '';
  let page = parseInt(req.query.page) || 1;
  let skip = (page -1) * perPage;
  let match ={};
  if(genre.length > 0){
    match["genre.name"] = {$regex: genre, $options: "i",}
    }
    try{
      let films = await filmModel.aggregate([
        {
          $lookup:
          {
            from:'listFilm',
            localField: '_id',
            foreignField: 'film',
            as: 'userScore',
          },
        },
        {
          $lookup:{
            from: 'genre',
            localField: 'genre',
            foreignField: '_id',
            as: 'genre',
          }
        },
        {
          "$match":match
        },
        {
          $addFields:{
            avg: {
              $avg:"$userScore.vote"
            }
          }
        },
        {
          $project:{
            vote: {
              $round:['$avg',2],
            },
            name: 1,
            releaseDate: 1,
            states: 1,
            genre: 1,
            description:1,
            image:1,
          },
        },
        {$skip: skip},
        {$limit: perPage},
      ]
    );
    let countItems = await filmModel.countDocuments();
    res.status(200).json({
      result: films,
      meta:{
        totalPages: Math.ceil(countItems/perPage),
        totalItems: countItems,
        currentPage: page,
      }
    });
    return res.end('');
  }
  catch(e){
    console.log(e);
    res.status(500);
    return res.end('');
  }
}
const getByName = async (req,res)=>{
  let name = req.params.name;
  try{
    let films = await filmModel.aggregate([
      {
        $lookup:
        {
          from:'listFilm',
          localField: '_id',
          foreignField: 'film',
          as: 'userVote',
        },
      },
      {
        $lookup:
        {
          from:'genre',
          localField: 'genre',
          foreignField: '_id',
          as: 'genre',
        },
      },
      {
        "$match":{
          "name":{
            $regex: name,
            $options: "i",
          }
        }
      },
      {
        $addFields: {
          avg: {
            $avg: "$userVote.vote",
          }
        }
      },
      {
        $project:{
          vote:{
            $round: ["$avg",2],
          },
          genre:1,
          description:1,
          releaseDate:1,
          name:1,
          image:1,
        }
      }

    ]);
    res.status(200).json(films);
    return res.end('');

  }
  catch(e){
    res.status(500);
    return res.end('');
  }
}
const topFilms = async (req,res)=>{
  let page = parseInt(req.query.page) || 1;
  let perpage = parseInt(req.query.perpage) || 10;
  let skip = (page -1) * perpage;
  try{
    let result = await filmModel.aggregate([
      {
        $lookup:{
          from: 'genre',
          localField: 'genre',
          foreignField: '_id',
          as: 'genre',
        }
      },
      {
        $lookup:{
          from: 'review',
          localField: '_id',
          foreignField: 'film',
          as: 'review',
        }
      },
      {
        $lookup:{
          from: "listFilm",
          localField: '_id',
          foreignField: 'film',
          as: "userScore",
        }
      },
      {
        $addFields:{
          avg: {
            $avg: "$userScore.vote",
          },
        }
      },
      {
        $addFields: {
          totalReview: {
            $size: "$review"
          },
          totalVote:{
            $size: "$userScore",
          },
          averageVote: {
            $round:["$avg",2],
          }
        }
      },
      {
        $project:{
          "ranking":{
            $multiply:[
              {$sum:[
                "$totalReview",
                '$totalVote',
              ]},
              "$averageVote",
            ]
          },
          name: 1,
          image:1,
          description:1,
          genre: 1,
          releaseDate: 1,
          averageVote:1,
        }
      },
      {
        $sort: {
          "ranking":-1,
        }
      },
      {
        $skip: skip,
      },
      {
        $limit: perpage,
      }
    ]);
    res.status(200).json(result);
    res.end('');
  }
  catch(e){
    console.log(e);
    res.status(500);
    res.end('');
  }
}
module.exports = {
  getFilm,
  removeFilm,
  createFilm,
  updateFilm,
  getFilms,
  getByName,
  topFilms
}
