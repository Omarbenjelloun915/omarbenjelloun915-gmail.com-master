const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../database/profileSchema');
const User = require('../../database/userSchema');
const { check, validationResult } = require('express-validator');

/**
 *@route     GET api/profile/me
 *@desc      GET user profile
 *@access    Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(500).json({ msg: 'You have no profile...' });
    }
    return res.json({ profile });
  } catch (err) {
    console.error(err, message);
    res.status(500).json({ msg: 'Server failed...' });
  }
});

/**
 *@route     POST api/profile
 *@desc      Create or Update users profile
 *@access    Private
 */
router.post(
  '/',
  [auth, [check('numberPhone', 'Phone Number is required ').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { numberPhone, isPassenger, bio, car, facebook } = req.body;

    //Build User Profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (numberPhone) profileFields.numberPhone = numberPhone;
    profileFields.isPassenger = isPassenger;
    if (bio) profileFields.bio = bio;
    if (car) profileFields.car = car;
    if (facebook) profileFields.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json({ msg: 'Your profile setup', profile });
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.send(400).json('Server Failed...');
    }
  }
);

/**
 *@route     GET api/profile/user/:user_id
 *@desc      GET profile by user id
 *@access    Private
 */

router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'Profile not found !' });
    return res.send(profile);
  } catch (err) {
    console.error(err.message);
    if ((err.kind = 'objectId')) {
      return res.status(400).json({ msg: 'Profile not found ! ' });
    }
    return res.status(400).send('Server Failed...');
  }
});

/**
 *@route     DELETE api/profile
 *@desc      DELETE profile,user
 *@access    Public
 */

router.delete('/', auth, async (req, res) => {
  try {
    //@todo - remove user posts

    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ user: req.user.id });

    return res.json({ msg: 'You have deleted your Account' });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Server Failed...');
  }
});

module.exports = router;
