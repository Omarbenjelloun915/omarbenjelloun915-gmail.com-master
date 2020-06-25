const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../database/userSchema');

dotenv.config();
/**
 * @route     POST api/users
 * @desc      Register user
 * @access    Public
 **/

router.post(
  '/',
  [
    check('name', 'Name is required ! Enter a valid name...').not().isEmpty(),
    check('email', 'email is required ! Enter a valid email...').isEmail(),
    check(
      'password',
      'Password is required !Please enter a password with 6 or more characters...'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    /*console.log(req.body); //le corps des requêttes, l'objet des données qui seront envoyées, mais pour cela fonctionne nous devons initialiser le middleware*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    //See if user exists
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.json('User existant...');
      }
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      user = new User({
        name,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken- cas stateless - pour que les données de la session seront enregistré dans un jeton et lors de l'authentifaction on recupère le jeton pour s'assusrer de les infos
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_KEY,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //send token in header
        }
      ); //config.get('jwtToken')
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
