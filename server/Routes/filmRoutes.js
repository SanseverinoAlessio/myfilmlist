const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.js');
const filmController = require('../Controllers/film.js');
const isAdmin = require('../middleware/isAdmin.js');
const verifyToken = require('../middleware/verifyToken.js');
const filmIsInList = require('../middleware/filmIsInList.js');
const idValidation = require('../middleware/idValidation.js');
router.get('/single/:id',idValidation(),filmController.getFilm);
router.delete('/:id',verifyToken(),isAdmin(),idValidation(),filmController.removeFilm);
router.post("/",verifyToken(),isAdmin(),filmController.createFilm);
router.put("/:id",verifyToken(),isAdmin(),idValidation(),filmController.updateFilm);
router.get("/",filmController.getFilms);
router.get('/search/:name', filmController.getByName);
router.get('/top',filmController.topFilms);


module.exports = router;
  
