const router = require('express').Router();
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['comment_text', 'user_id'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { posts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.render('dashboard');
  } else {
    res.redirect('/login');
  }
});

router.post('/signup', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const newUser = await User.create({
        username: req.body.username,
        password: hashedPassword,
      });
  
      req.session.loggedIn = true;
      req.session.userId = newUser.id;
  
      res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ where: { username: req.body.username } });
  
      if (!user || !(await user.checkPassword(req.body.password))) {
        res.status(400).json({ message: 'Incorrect username or password' });
        return;
      }
  
      req.session.loggedIn = true;
      req.session.userId = user.id;
  
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  router.post('/logout', (req, res) => {
    try {
      req.session.destroy(() => {
        res.status(200).json({ message: 'Logout successful' });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

module.exports = router;