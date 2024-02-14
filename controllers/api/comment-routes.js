const router = require('express').Router();
const { Comment, User, Post } = require('../../models');

router.get('/comments', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Post,
          attributes: ['title'],
        },
      ],
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.render('comments', { comments });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/comments', async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.user_id, 
      post_id: req.body.post_id,
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/comments/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.destroy({
      where: {
        comment_id: req.params.id,
      },
    });

    if (!deletedComment) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }

    res.status(200).json(deletedComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;