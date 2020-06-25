const express = require('express');
const router = express.Router();
const User = require('../../database/userSchema');
const auth = require('../../middleware/auth');
const Helper = require('../../controllers/helper');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// @route     GET api/auth
// @desc      Test route
// @access    Private
dotenv.config();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server failed...');
  }
});

/**
 * @route     POST api/auth
 * @desc      Login user
 * @access    Public
 **/

router.post(
  '/',
  [
    check('email', 'email is required ! Enter a valid email...').isEmail(),
    check('password', 'Password is required !').exists(),
  ],
  async (req, res) => {
    /*console.log(req.body); //le corps des requêttes, l'objet des données qui seront envoyées, mais pour cela fonctionne nous devons initialiser le middleware*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    //See if user exists
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = Helper.comparePassword(user.password, password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Password...' }] });
      }

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
