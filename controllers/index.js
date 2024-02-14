const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const postRoutes = require('./api/post-routes.js'); 
const userRoutes = require('./api/user-routes.js'); 
const commentRoutes = require('./api/comment-routes.js'); 

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/posts', postRoutes); 
router.use('/users', userRoutes); 
router.use('/comments', commentRoutes); 

module.exports = router;