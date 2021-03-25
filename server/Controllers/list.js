const listFilmModel = require('../Models/listFilmModel');
const updateOptions = {runValidators: true,useFindAndModify:false};
const errorFormatter = require('../Config/errorFormatter.js');
const reviewModel = require('../Models/review.js');
const mongoose = require("mongoose");
const addFilm = async (req,res)=>{
  let userId = req.decodedToken.id;
  let filmId = req.body.filmId;
  let vote = req.body.vote;
  let state = req.body.state;
  let listFilm = new listFilmModel({
    film: filmId,
    user: userId,
    vote: vote,
    state: state,
  });
  let found = await listFilmModel.findOne({userId:userId,filmId: filmId});
  try{
    await listFilm.save();
    let update = await listFilmModel.aggregate([
      {
        $match:{
          film: new mongoose.Types.ObjectId(filmId),
          state: {
            $regex: "^Visto|Incompleto$" ,
            $options: "i"
          },
        }
      },
      {
        $group:{
          _id: null,
          "avg": {
            "$avg": "$vote",
          }
        }
      },
      {
        $project:{
          "newAverageVote": {
            $round: ['$avg',2],
          }
        }
      },
    ]);
    res.status(200).json({
      added:true,
      newAverageVote: update[0] != undefined ? update[0].newAverageVote : 0,
    });
    return res.end('');
  }
  catch(e){
    res.status(400).json(errorFormatter(e));
    return res.end('');
  }
}
const deleteFilm = async (req,res)=>{
  let userId = req.decodedToken.id;
  let filmId = req.params.filmId;
  try{
    let deleted = await listFilmModel.findOneAndRemove({
      user: userId,
      film: filmId },
      {useFindAndModify: false,  }
    );
    await reviewModel.findOneAndRemove({user:userId,film:filmId},{useFindAndModify: false,});
    if(deleted == null){
      res.status(404);
      return res.end('');
    }
    res.status(200).json({
      deleted: true
    });
    return res.end('');
  }
  catch(e){
    res.status(400);
    return res.end('');
  }
}
const getFilms = async(req,res)=>{
  let userId = req.decodedToken.id;
  let page = parseInt(req.query.page) || 1;
  let state = req.query.state || '';
  let perPage = parseInt(req.query.perpage) || 10;
  let skip = (page -1) * 10;
  try{
    let films = await listFilmModel.find({user:userId,state:{
      $regex: state.length > 0 ? "^" + state + '$' : '',
      $options: 'i',
    }
  }).skip(skip).limit(perPage).populate('film').exec();
  res.status(200).json(films);
  return res.end('');
}
catch(e){
  res.status(400);
  return res.end('');
}
}
const update = async (req,res)=>{
  let userId = req.decodedToken.id;
  let vote = req.body.vote;
  let state = req.body.state;
  let filmId = req.params.filmId;
  try{
    await listFilmModel.findOneAndUpdate({
      user: userId,
      film: filmId,
    },
    {
      vote: vote,
      state: state,
    },
    updateOptions);
    await reviewModel.findOneAndUpdate({
      film: filmId,
      user:userId,
    },{
      vote: vote,
    },
    updateOptions,
  )

  res.status(200).json({
    updated: true})
    return res.end('');
  }
  catch(e){
    res.json(errorFormatter(e));
    return res.end('');
  }
}
const getFilm = async (req,res)=>{
  let userId = req.decodedToken.id;
  let filmId = req.params.filmId;
  try{
    let film  = await listFilmModel.findOne({user:userId,film:filmId});
    if(film == null){
      res.status(404);
      return res.end('');
    }
    res.status(200).json(
      film);
      return res.end('');
    }
    catch(e){
      res.status(400);
      return res.end('');
    }
  }
  const searchFilm = async (req,res)=>{
    try{
      let name = req.params.name;
      let userId = req.decodedToken.id;
      let films =  await listFilmModel.aggregate([
        {
          $lookup:{
            from: 'film',
            localField: 'film',
            foreignField: "_id",
            as: 'film',
          },
        },
        {
          "$match": {
            "film.name":{
              $regex:name,
              $options: 'i',
            },
            "user":new mongoose.Types.ObjectId(userId),
          },
        },
      ]);
      res.status(200).json(films);
      return res.end('');
    }
    catch(e){
      res.status(500);
      return res.end('');
    }
  }
  module.exports = {
    addFilm,
    update,
    getFilms,
    deleteFilm,
    getFilm,
    searchFilm
  }
