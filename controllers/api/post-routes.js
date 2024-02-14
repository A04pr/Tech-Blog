const router = require('express').Router();
const { Post, User } = require('../../models');

router.get('/posts', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: {
        model: User,
        attributes: ['username'],
      },
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('posts', { posts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['username'],
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = postData.get({ plain: true });

    res.render('single-post', { post });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/posts', async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id, 
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/posts/:id', async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          post_id: req.params.id,
        },
      }
    );

    if (!updatedPost) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        post_id: req.params.id,
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.status(200).json(deletedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;