const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const session = require('cookie-session');


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const path = require('path');


const app = express();
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));

app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));

app.use(session({
  keys: ['key1', 'key2'],
  name: 'session',
  cookie: { 
    httpOnly: true,
    expires: new Date( Date.now() + 60 * 60 * 1000 )
  }
}));

mongoose.connect('mongodb+srv://validateur:motdepasse@cluster0.oxj94.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;