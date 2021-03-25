const reviewModel = require('../Models/review.js');
const updateOptions = {runValidators: true,useFindAndModify:false};
const mongoose = require("mongoose");
const errorFormatter = require('../Config/errorFormatter.js');
const createReview = async (req,res)=>{
  let userId = req.decodedToken.id;
  let filmId = req.params.filmid;
  let text = req.body.text;
  let vote = req.vote;
  let review = new reviewModel({
    user: userId,
    film: filmId,
    text: text,
  });
  review.save((err,doc)=>{
    if(err){
      res.status(400).json(errorFormatter(err));
      return res.end('');
    }
    doc.populate('user',(err,doc)=>{
      let data = {
        user: [{
          name:doc.user.name,
          avatar: doc.user.avatar,
        },
      ],
      text: doc.text,
      vote: vote,
      date: doc.date,
    };
    res.status(200).json({
      result:data});
      return res.end('');
    });
  });
}
const deleteUserReview = async (req,res)=>{
  let filmId = req.params.filmid;
  let userId = req.decodedToken.id;
  try{
    await reviewModel.findOneAndRemove({film: filmId, user:userId},
      {
        useFindAndModify: false});
        res.status(200).json({
          deleted: true,
        });
        return res.end('');
      }
      catch(e){
        res.status(400);
        return res.end('');
      }
    }
    const updateReview = async (req,res)=>{
      let id = req.decodedToken.id;
      let filmId = req.params.filmid;
      let text = req.body.text;
      try{
        let updated = await reviewModel.findOneAndUpdate({
          user:id,
          film: filmId,
        },{
          text: text,
          date: Date.now(),
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
    const getReview = async (req,res)=>{
      let userId = req.decodedToken.id;
      let filmId = req.params.filmid;
      try{
        let review = await reviewModel.findOne({
          user:userId,
          film: filmId,
        });
        if(review == null){
          res.status(404);
          return res.end('');
        }
        res.status(200).json(review);
        return res.end('');
      }
      catch(e){
        res.status(500);
        res.end('');
      }
    }
    const getReviews = async (req,res)=>{
      let filmId = req.query.filmid;
      let perPage = parseInt(req.query.perpage) || 10;
      let page = parseInt(req.query.page) || 1;
      let skip = (page -1) * perPage;
      try{
        if(filmId == undefined){
          let result = await reviewModel.aggregate([
            {
              $lookup:{
                from: "listFilm",
                let:{
                  userId: "$user",
                  filmId: "$film",
                },
                pipeline: [{
                  $match:{
                    $and:[{
                      $expr:{
                        $eq:["$user","$$userId"],
                      },
                    },
                    {$expr:{
                      $eq:["$film","$$filmId"],
                    }
                  },
                ]
              }
            }],
            as:"userVote",
          }
        },

        {
          $lookup:
          {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup:
          {
            from: 'film',
            localField: 'film',
            foreignField: '_id',
            as: 'film',
          },
        },

        {
          $addFields:{
            vote: {$first:"$userVote.vote"}
          }
        },
        {
          $project: {
            userVote:0,
          }
        },
        {$skip: skip},
        {$limit: perPage},
      ]
    );
    let countItems = await reviewModel.countDocuments();
    res.status(200).json({
      result:result,
      meta:{
        currentPage:page,
        totalItems:countItems,
        totalPages:Math.ceil(countItems),
      }
    });
    return res.end('');
  }
  let result = await reviewModel.aggregate([
    {
      $lookup:{
        from: "listFilm",
        let:{
          userId: "$user",
          filmId: "$film",
        },
        pipeline: [{
          $match:{
            $and:[{
              $expr:{
                $eq:["$user","$$userId"],
              },
            },
            {$expr:{
              $eq:["$film","$$filmId"],
            }
          },
        ]
      }
    }],
    as:"userVote",
  }
},

{
  $lookup:
  {
    from: 'users',
    localField: 'user',
    foreignField: '_id',
    as: 'user',
  },
},
{
  "$match":{
    "film": new mongoose.Types.ObjectId(filmId),
  }
},
{
  $addFields:{
    vote: {$first:"$userVote.vote"}
  }
},
{
  $project: {
    userVote:0,
  }
},
{$skip: skip},
{$limit: perPage},
]
);
res.status(200).json({
  result: result,
});
return res.end('');
}
catch(e){
  console.log(e);
  res.status(400);
  return res.end('');
}
}
const reviews = async (req,res)=>{
  let perPage = parseInt(req.query.perpage) || 10;
  let page = parseInt(req.query.page);
  let skip = (page - 1) * perPage;
  let userId = req.decodedToken.id;
  let data = [];
  try{
    let data = await reviewModel.aggregate([
      {
        $lookup:{
          from: "listFilm",
          let:{
            userId: "$user",
            filmId: "$film",
          },
          pipeline: [{
            $match:{
              $and:[{
                $expr:{
                  $eq:["$user","$$userId"],
                },
              },
              {$expr:{
                $eq:["$film","$$filmId"],
              }
            },
          ]
        }
      }],
      as:"userVote",
    }
  },
  {
    $lookup:
    {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $lookup:
    {
      from: 'film',
      localField: 'film',
      foreignField: '_id',
      as: 'film',
    },
  },
  {
    $match:{
      "user._id":new mongoose.Types.ObjectId(userId),
    }
  },
  {
    $addFields:{
      vote: {
        $first: "$userVote.vote",
      }
    }
  },
  {
    $project:{
      "user.password": 0,
      "user.email": 0,
    }
  },
  {$skip: skip},
  {$limit: perPage},
]);
res.status(200).json(data);
res.end('');
return;
}
catch(e){
  res.status(500);
  res.end('');
  return;
}
}
const userReviewsSearch = async (req,res)=>{
  let query = req.params.query;
  let userId = req.decodedToken.id;
  try{
    let reviews = await reviewModel.aggregate([
      {
          $lookup:{
            from: "listFilm",
            let:{
              userId: "$user",
              filmId: "$film",
            },
            pipeline: [{
              $match:{
                $and:[{
                  $expr:{
                    $eq:["$user","$$userId"],
                  },
                },
                {$expr:{
                  $eq:["$film","$$filmId"],
                }
              },
            ]
          }
        }],
        as:"userVote",
        },
      },
      {
        $lookup:{
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as:'user',
        }
      },
      {
        $lookup: {
          from: 'film',
          localField: 'film',
          foreignField: '_id',
          as: 'film',
        }
      },
      {
        "$match": {
          "film.name":{
            $regex:query,
            $options: 'i',
          },
          "user._id":new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $addFields:{
          vote: {
            $first: "$userVote.vote",
          }
        }
      },
      {
        $project:{
          "user.password": 0,
          "user.email": 0,
          "film.genre":0,
            userVote:0,
        }
      },
    ]);
    res.status(200).json(reviews);
    return res.end('');
  }
  catch(e){
    res.status(500);
    return res.end('');
  }
}
const deleteReview = async (req,res)=>{
  let reviewId = req.params.id;
  try{
    let deleted = await reviewModel.findOneAndRemove({
      _id: reviewId,
    },{useFindAndModify:false},);
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
const reviewSearch = async (req,res)=>{
  let query = req.params.query;
  try{
    let result = await reviewModel.aggregate([
      {
        $lookup:
        {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup:
        {
          from: 'film',
          localField: 'film',
          foreignField: '_id',
          as: 'film',
        },
      },
      {
        $project:{
          "user.password": 0,
          "user.email": 0,
        }
      },
      {
        "$match":{
          $or:[{
            "user.name":{
              $regex: query,
              $options: "i",
            }
          },
          {
            "film.name":{
              $regex: query,
              $options: "i",
            }
          },
        ]

      }
    },
  ]
);
res.status(200).json(result);
return res.end('');
}
catch(e){
  res.status(500);
  return res.end('');
}
}
const getReviewById = async (req,res)=>{
  let id = req.params.id;
  try{
    let review = await reviewModel.aggregate([
      {
        $lookup:{
          from: "listFilm",
          let:{
            userId: "$user",
            filmId: "$film",
          },
          pipeline: [{
            $match:{
              $and:[{
                $expr:{
                  $eq:["$user","$$userId"],
                },
              },
              {$expr:{
                $eq:["$film","$$filmId"],
              }
            },
          ]
        }
      }],
      as:"userVote",
    }
  },
  {
    $lookup:{
      from: "users",
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $addFields:{
      vote: {
        $first:"$userVote.vote"},
      }
    },
    {
      $project:{
        "user.password": 0,
        "user.email": 0,
        "user.admin": 0,
        "userVote":0,
      }
    },
    {
      $match:{
        _id: new mongoose.Types.ObjectId(id),
      }
    }
  ]);
  review = review[0] != undefined ? review[0] : null;
  if(review == null){
    res.status(404);
    return res.end('');
  }
  res.status(200).json(review);
  return res.end('');
}
catch(e){
  res.status(500);
  return res.end('');
}
}
module.exports = {
  createReview,
  deleteReview,
  updateReview,
  getReview,
  getReviews,
  reviews,
  userReviewsSearch,
  deleteUserReview,
  reviewSearch,
  getReviewById
}
