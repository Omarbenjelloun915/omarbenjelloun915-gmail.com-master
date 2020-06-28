const express = require('express');
const connectDB = require('./config/db');
const rootUser = require('./routes/api/users');
const rootProfile = require('./routes/api/profile');
const rootTrajet = require('./database/trajet');
const rootAuth = require('./routes/api/auth');

const app = express();

//Connect to Database
connectDB();

//Parse incoming request bodies in a middleware before your handlers,
//Init Middleware, pour l'analyseur corporel
//app.use(bodyParser.json({ type: '/' }));
//app.use(express.json({extended : false}));
// parse application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/api/users', rootUser);
app.use('/api/profile', rootProfile);
app.use('/api/uber', rootTrajet);
app.use('/api/auth', rootAuth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started at Port :' + PORT));
