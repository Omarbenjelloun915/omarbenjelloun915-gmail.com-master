const express = require('express');
const router = express.Router();
const request = require('request');
const auth = require('../../middleware/auth');
const Profile = require('../../database/profileSchema');
const User = require('../../database/userSchema');
const { check, validationResult } = require('express-validator');
const config = require('config');

/**
 *@route     GET api/profile/me
 *@desc      GET users profile
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
  [
    auth,
    [
      check('status', 'Status is required ').not().isEmpty(),
      check('skills', 'Skills is required ').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build User Profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //Build Social profile
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.Stwitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    //Build Education profile-Look Down- I create a route for them
    //Build Experience profile-Look Down I create a route for them

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json({ msg: 'Your profile', profile });
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
 *@route     GET api/profile/all
 *@desc      GET all profiles
 *@access    Public
 */

router.get('/all', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);
    return res.send(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Server Failed...');
  }
});

/**
 *@route     GET api/profile/user/:user_id
 *@desc      GET profile by user id
 *@access    Public
 */

router.get('/user/:user_id', async (req, res) => {
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
 *@desc      DELETE profile,user,posts
 *@access    Public
 */

router.delete('/', auth, async (req, res) => {
  try {
    //@todo - remove user posts

    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ user: req.user.id });
    //Remove Posts

    return res.json({ msg: 'You have deleted your Account' });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Server Failed...');
  }
});

/**
 *@route     PUT api/profile/experience
 *@desc      PUT users profile experiences
 *@access    Private
 */
router.put(
  '/experience',
  [
    auth,
    check('title', 'Title id required ! ').not().isEmpty(),
    check('company', 'Company is required !').not().isEmpty(),
    check('from', 'Date is required ! ').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json({ msg: 'Experience added ' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server failed...' });
    }
  }
);

/**
 *@route     DELETE api/profile/experience/:exp_id
 *@desc      Delete profile experience by experience id
 *@access    Private
 */

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json({ msg: 'experience deleted !' });
    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    if ((err.kind = 'objectId')) {
      return res.status(400).json({ msg: 'Experience not found ! ' });
    }
    return res.status(400).send('Server Failed...');
  }
});

/**
 *@route     PUT api/profile/education
 *@desc      PUT users profile education
 *@access    Private
 */
router.put(
  '/education',
  [
    auth,
    check('school', 'School is required ! ').not().isEmpty(),
    check('degree', 'Degree is required !').not().isEmpty(),
    check('fieldofstudy', 'Field of your study is required ! ').not().isEmpty(),
    check('from', 'Date is required ! ').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    newEduc = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      });
      profile.education.unshift(newEduc);
      await profile.save();
      res.json({ msg: 'Nouveau parcours ...', profile });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server failed...' });
    }
  }
);

/**
 *@route     DELETE api/profile/education/:educ_id
 *@desc      Delete profile experience using experience id
 *@access    Private
 */

router.delete('/education/:educ_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.educ_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json({ msg: 'Parcours Supprimé... !', profile });
  } catch (err) {
    console.error(err.message);
    if ((err.kind = 'objectId')) {
      return res.status(400).json({ msg: 'Parcours not found ! ' });
    }
    return res.status(400).send('Server Failed...');
  }
});

/**
 *@route     GET api/profile/github/:username
 *@desc      GET users repos from github
 *@access    Public
 */
router.get('/github/:username', (req, res) => {
  try {
    var username = req.params.username;
    var client_id = config.get('githubClientId');
    var client_secret = config.get('githubSecret');
    const options = {
      uri:
        'https://api.github.com/users/' +
        username +
        '/repos?per_page=5&sort=created:asc&client_id=' +
        client_id +
        '&client_secret=' +
        client_secret,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error.message);
        res.status(501).send('Server failed !');
      }
      if (response.statusCode != 200) {
        res.status(404).json({ msg: 'No github profile found!' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err, message);
    res.status(500).json({ msg: 'Server failed...' });
  }
});

module.exports = router;
