const express         = require('express');
const expressLayouts  = require('express-ejs-layouts');
const fileUpload      = require('express-fileupload');
const session         = require('express-session');
const cookieParser    = require('cookie-parser');
const flash           = require('connect-flash');
const hbs             = require('express-handlebars');
const passport        = require('passport');
const localStrategy   = require('passport-local').Strategy;
const bcrypt          = require('bcrypt');
const User = require('./server/models/User.js');

const mongoose = require('mongoose');


const app = express();
const port = process.env.PORT || 3000;



require('dotenv').config();




app.use(express.urlencoded({ extended: true} ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('RecipeBlogSecure'));
app.use(session({
  secret: 'RecipeBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));

//middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use( 'local',
    new localStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );


app.use(flash());
app.use(fileUpload());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next(); 
})


app.set('layout','./layouts/main');
app.set('view engine','ejs');

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));