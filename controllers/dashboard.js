const router = require('express').Router();
const { User, Post } = require('../models');

router.get('/', async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.redirect('/login');
      return;
    }

    const userData = await User.findByPk(req.session.user_id, {
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', { 
      user, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/new', async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.redirect('/login');
      return;
    }

    res.render('new-post', { loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/new', async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.redirect('/login');
      return;
    }

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.redirect('/login');
      return;
    }

    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id, 
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;