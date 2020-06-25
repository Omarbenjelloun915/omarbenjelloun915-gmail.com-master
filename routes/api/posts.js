const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Post = require('../../database/postSchema');
const User = require('../../database/userSchema');
const Profile = require('../../database/profileSchema');
const auth = require('../../middleware/auth');

//@route     POST api/posts
//@desc      Create a post
//@access    Private

router.post(
  '/',
  [auth, [check('text', 'text field is empty!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
      const post = await newPost.save();
      res.json({ post });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server failed!' });
    }
  }
);

//@route     Get api/posts
//@desc      GET all posts
//@access    Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server failed ! ');
  }
});

//@route     Get api/posts/:id_post
//@desc      GET post by id_post
//@access    Private

router.get('/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);
    if (!post) {
      res.json({ msg: 'Post not found ! ' });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if ((err.kind = 'objectId')) {
      return res.status(400).json({ msg: 'Profile not found ! ' });
    }
    res.status(500).send('Server failed ! ');
  }
});

//@route     Delete api/posts/:id_post
//@desc      Delete post by id_post
//@access    Private

router.delete('/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);

    if (!post) {
      return res.status(404).json({ msg: 'No post found!' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorised ! ' });
    }
    await post.remove();
    res.json({ msg: 'Post deleted !' });
    res.json({ post });
  } catch (error) {
    console.error(error.message);
    if ((err.kind = 'objectId')) {
      return res.status(400).json({ msg: 'Profile not found ! ' });
    }
    return res.status(500).send('Server Failed!');
  }
});

//@route     Put api/posts/like/:id_post
//@desc      Put liKe to a post by id_post
//@access    Private
router.put('/like/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);
    if (!post) {
      return res.status(404).json({ msg: 'No post found!' });
    }
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0
    ) {
      return res.json({ msg: 'Post already liked !' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json({ msg: 'You have liked this post', post });
  } catch (error) {
    console.error(error.message);
    if ((error.kind = 'objectId')) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server failed!');
  }
});

//@route     Put api/posts/unlike/:id_post
//@desc      Put liKe to a post by id_post
//@access    Private
router.put('/unlike/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);
    if (!post) {
      return res.status(404).json({ msg: 'No post found!' });
    }
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id)
        .length === 0
    ) {
      return res.json({ msg: 'Post has not yet been liked  !' });
    }
    //Remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json({ msg: 'You have unliked this post', post });
  } catch (error) {
    console.error(error.message);
    if ((error.kind = 'objectId')) {
      return res.status(400).json({ msg: 'No post found ! ' });
    }
    res.status(500).send('Server failed!');
  }
});

//@route     Post api/posts/comments/:id_post
//@desc      Post comment to a post by id_post
//@access    Private
router.post(
  '/comments/:id_post',
  [auth, check('text', 'text is required').not().isEmpty()],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id_post);
      if (!post) {
        return res.status(404).json({ msg: 'No post found!' });
      }
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json({ post });
    } catch (error) {
      console.error(error.message);
      if ((error.kind = 'objectId')) {
        return res.status(400).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server failed!');
    }
  }
);

//@route     Delete api/posts/comments/:id_post/:id_comment
//@desc      Delete comment by using id_post & id_comment
//@access    Private
router.delete('/comments/:id_post/:id_comment', auth, async (req, res) => {
  try {
    //Pull out post
    const post = await Post.findById(req.params.id_post);
    if (!post) {
      return res.status(404).json({ msg: 'No post found!' });
    }
    //Pull out comment
    const comment = await post.comments.find(
      (comment) => comment.id === req.params.id_comment
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist !' });
    }
    //Check if user authorised to delete this comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorised ! ' });
    }
    const removeIndex = post.comments
      .map((commentaire) => commentaire.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json({ msg: 'Comment deleted ! ', post });
  } catch (error) {
    console.error(error.message);
    if ((error.kind = 'objectId')) {
      return res.status(400).json({ msg: 'No post found ! ' });
    }
    res.status(500).send('Server failed!');
  }
});

module.exports = router;
