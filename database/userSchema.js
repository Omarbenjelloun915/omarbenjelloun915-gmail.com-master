const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('user', userSchema);

/*

     **---- Using Postgres Databse ----**


const client = require('../config/setup');

const schemaCodes = {
  '25007': 'schema_and_data_statement_mixing_not_supported',
  '3F000': 'invalid_schema_name',
  '42P06': 'duplicate_schema',
  '42P15': 'invalid_schema_definition',
  '42000': 'syntax_error_or_access_rule_violation',
  '42601': 'syntax_error',
};
var pgSchemas = [];
const postgresRole = 'postgres';
const schemaName = 'authentification';
const findSchema = async () => {
  let selectSchemasSql = 'SELECT schema_name FROM information_schema.schemata;';
  await client.query(selectSchemasSql, (err, res) => {
    console.log('\nselectSchemasSql:', selectSchemasSql);
    if (err) {
      console.log('SELECT schema_name:', schemaCodes[err.code]);
      console.log('ERROR code:', err.code);
    } else if (res.rows != undefined) {
      res.rows.forEach((row) => {
        pgSchemas.push(row.schema_name);
      });
      console.log('schema names:', pgSchemas);
      console.log('SELECT schema_name total schemas:', res.rowCount);
    }
  });
  let createSql = `CREATE SCHEMA IF NOT EXISTS ${schemaName} AUTHORIZATION ${postgresRole};`;
  console.log('\ncreateSql:', createSql);
  await client.query(createSql, (createErr, createRes) => {
    if (createErr) {
      console.log(
        'CREATE SCHEMA ERROR:',
        createErr.code,
        '--',
        schemaCodes[createErr.code]
      );
      console.log('ERROR code:', createErr.code);
      console.log('ERROR detail:', createErr.detail);
    }
    if (createRes) {
      console.log('\nCREATE SCHEMA RESULT:', createRes.command);

      let createTableSql = `CREATE TABLE ${schemaName}.users(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        avatar VARCHAR(255),
        date DATE DEFAULT current_date);`;

      console.log('\ncreateTableSql:', createTableSql);
      client.query(createTableSql, (tableErr, tableRes) => {
        if (tableErr) {
          console.log(
            'CREATE TABLE ERROR:',
            tableErr.code,
            '--',
            schemaCodes[tableErr.code]
          );
          console.log('createTableSql:', tableErr);
        }

        if (tableRes) {
          console.log('\nCREATE TABLE RESULT:', tableRes);
        }
      });
    }
  });
};
module.exports = findSchema;
//let dropSql = `DROP SCHEMA "${schemaName}" CASCADE;`;
client.query(dropSql, (err, res) => {
  console.log('\ndropSql:', dropSql);
  if (err) {
    console.log('DROP SCHEMA ERROR:', schemaCodes[err.code]);
    console.log('ERROR code:', err.code);
    console.log('ERROR detail:', err.detail);
  }
  if (res) {
    console.log('DROP SCHEMA RESULT:', res.command);
  }
});
*/
