const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const connectEnsureLogin = require('connect-ensure-login');
const { ensureAuthenticated, forwardAuthenticated } = require('../controllers/config/auth');
const passport = require('passport');
const localStrategy   = require('passport-local').Strategy;
/**
 * App Routes
 */
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe );
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/about-us', recipeController.exploreAboutus);

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});




router.get('/contact-us', recipeController.Contactus);
router.post('/contact-us', recipeController.ContactusOnPost);





router.get('/login', forwardAuthenticated, recipeController.login);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: 'Wrong Email or Password'
    })(req, res, next);
  });

router.get('/register',  recipeController.register);
router.post('/register', recipeController.registerOnPost);

module.exports = router;

