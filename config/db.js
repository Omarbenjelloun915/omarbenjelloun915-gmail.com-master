const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Connected to MongoDB... at : ', db);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;

/*

    **--Using PostgresDatabase--**


const Client = require('pg').Client;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mern',
  password: 'saramaroc',
  port: '5432',
});

module.exports = client;
const client = require('./setup');
const pg = require('pg');
const findSchema = require('../database/userSchema');

const connectDB = async () => {
  try {
    client.connect(() => console.log('connected to Database'));
    findSchema();
  } catch (err) {
    console.error(err, message);
  }
};

module.exports = connectDB;
*/
