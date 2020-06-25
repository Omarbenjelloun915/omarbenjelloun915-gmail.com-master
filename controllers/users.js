/*

     **--Using Postgres Database--**
const client = require('../config/setup');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const gravatar = require('gravatar');
const Helper = require('./helper');

const schemaName = 'authentification';

//
 * Create A User
 * @param {object} req
 * @param {object} res
 //
const register = async (req, res) => {
  const hashPassword = Helper.hashPassword(req.body.password);
  const avatar = gravatar.url(req.body.email, {
    s: '200',
    r: 'pg',
    d: 'mm',
  });

  const createQuery = `INSERT INTO ${schemaName}.users(id,name,email,password,avatar,date) VALUES($1, $2, $3, $4, $5, $6) returning *;`;
  const values = [
    uuidv4(),
    req.body.name,
    req.body.email,
    hashPassword,
    avatar,
    moment(new Date()),
  ];

  try {
    const { rows } = await client.query(createQuery, values);
    const token = Helper.generateToken(rows[0].id);
    return res.status(201).send('Enregistrement avec succés...');
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res
        .status(400)
        .send({ message: 'User with that EMAIL already exist' });
    }
    console.log(error);
    return res.status(400).send('erreur d enregistrement');
  }
};
//
 * Login
 * @param {object} req
 * @param {object} res
 //
const login = async (req, res) => {
  const text = `SELECT * FROM ${schemaName}.users WHERE email = $1;`;
  try {
    const { rows } = await client.query(text, [req.body.email]);
    if (!rows[0]) {
      return res
        .status(400)
        .send({ message: 'The credentials you provided is incorrect' });
    } else if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ message: 'The credentials you provided is incorrect' });
    }
    const token = Helper.generateToken(rows[0].id);
    return res.status(200).send('Login');
  } catch (error) {
    console.error(error, message);
    return res.status(400).send(error);
  }
};
//
 * Delete A User
 * @param {object} req
 * @param {object} res
 * @returns {void} return status code 204
 //
const supp = async (req, res) => {
  const deleteQuery = `DELETE FROM ${schemaName}.users WHERE id=$1 returning *;`;
  try {
    const { rows } = await client.query(deleteQuery, [req.id]);
    if (!rows[0]) {
      return res.status(404).send({ message: 'user not found' });
    }
    return res.status(204).send({ message: 'deleted' });
  } catch (error) {
    console.log(error);
    return res.status(400).send('Erreur de suppression');
  }
};

module.exports = { login, register, supp };
*/
