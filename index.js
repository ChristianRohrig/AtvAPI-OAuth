const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const app = express();


app.use(session({ secret: 'Chave123', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new GitHubStrategy({
  clientID: '0d7171c1b222f23277f8',
  clientSecret: '44ad1afa89091a1bd6d1470d8092e9a65be2f235',
  callbackURL: 'http://localhost:3000/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
  
  return done(null, profile);
}));


passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Bem-vindo, ${req.user.displayName}!`);
  } else {
    res.send('Bem-vindo à página inicial. <a href="/auth/github">Login com GitHub</a>');
  }
});


app.get('/auth/github', passport.authenticate('github'));


app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
