const express = require('express');
const router = express.Router();
const listController = require('../Controllers/list.js');
router.post('/addFilm',listController.addFilm);
router.get('/films',listController.getFilms);
router.put('/film/:filmId',listController.update);
router.delete('/film/:filmId',listController.deleteFilm);
router.get('/film/:filmId',listController.getFilm);
router.get('/film/search/:name', listController.searchFilm);

module.exports = router;
