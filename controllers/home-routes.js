const router = require('express').Router();
const { Post, User, Comment } = require('../models');

const { getHomepage } = require('../controllers/homepageController');

router.get('/', getHomepage);

module.exports = router;