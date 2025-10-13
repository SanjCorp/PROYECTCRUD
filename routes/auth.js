const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

// ---------- Local register ----------
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password son requeridos' });
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Usuario ya existe' });
    user = new User({ email, password, name, provider: 'local' });
    await user.save();
    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ---------- Local login ----------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password son requeridos' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ---------- Passport Google OAuth config ----------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL || 'https://proyectcrud.onrender.com'}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    let user = await User.findOne({ provider: 'google', providerId: profile.id });
    if (!user && email) {
      // try find by email to link accounts
      user = await User.findOne({ email });
    }
    if (!user) {
      user = new User({
        email: email || `no-email-${profile.id}@example.com`,
        name: profile.displayName,
        provider: 'google',
        providerId: profile.id
      });
      await user.save();
    } else {
      // if existing user but no providerId, set it
      if (!user.providerId) {
        user.provider = 'google';
        user.providerId = profile.id;
        await user.save();
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// init passport (we will call this from server.js)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// callback: issue JWT and redirect or return token
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }), (req, res) => {
  // Generate JWT
  const token = jwt.sign({ sub: req.user._id, email: req.user.email }, JWT_SECRET, { expiresIn: '8h' });
  // If you want to redirect to a front-end, pass token via query or render a page. For simplicity, return JSON:
  // But because this is a redirect from browser, we'll send an HTML page with the token for easy copy.
  res.send(`<html><body>
    <h3>Autenticación con Google exitosa</h3>
    <p>Token (cópialo):</p>
    <textarea style="width:100%;height:120px">${token}</textarea>
    <p>Úsalo como: <code>Authorization: Bearer ${token}</code></p>
  </body></html>`);
});

router.get('/google/failure', (req, res) => {
  res.status(401).send('Autenticación con Google fallida');
});

router.get('/logout', (req, res) => {
  // For JWT, logout es responsabilidad del cliente (borrar token). Aquí opcional.
  res.json({ message: 'Para cerrar sesión, elimina el token en cliente' });
});

module.exports = router;
