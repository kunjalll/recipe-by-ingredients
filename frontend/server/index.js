const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'data.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 4000;

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { users: [], nextUserId: 1 };
  }
}

function writeData(d) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), 'utf8');
}

const app = express();
app.use(express.json());
app.use(cookieParser());
// Allow requests from development devices (phone/host) — in production narrow this down
app.use(cors({ origin: true, credentials: true }));

function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const data = readData();
    const user = data.users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const data = readData();
  const existing = data.users.find(u => u.email === email.toLowerCase());
  if (existing) return res.status(400).json({ error: 'Email already in use' });
  const hashed = bcrypt.hashSync(password, 10);
  const user = { id: data.nextUserId++, name, email: email.toLowerCase(), password: hashed, saved: [], history: [] };
  data.users.push(user);
  writeData(data);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const data = readData();
  const user = data.users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const data = readData();
    const user = data.users.find(u => u.id === payload.id);
    if (!user) return res.json({ user: null });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.json({ user: null });
  }
});

app.get('/api/saved', authMiddleware, (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);
  res.json({ saved: user.saved || [] });
});

app.post('/api/saved', authMiddleware, (req, res) => {
  const { id, action } = req.body; // action: 'add' | 'remove'
  if (!id || !['add','remove'].includes(action)) return res.status(400).json({ error: 'Bad request' });
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user.saved) user.saved = [];
  if (action === 'add' && !user.saved.includes(id)) user.saved.push(id);
  if (action === 'remove') user.saved = user.saved.filter(x => x !== id);
  writeData(data);
  res.json({ saved: user.saved });
});

app.get('/api/history', authMiddleware, (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);
  res.json({ history: user.history || [] });
});

app.post('/api/history', authMiddleware, (req, res) => {
  const recipe = req.body;
  if (!recipe || !recipe.id) return res.status(400).json({ error: 'Bad request' });
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user.history) user.history = [];
  // remove duplicate
  user.history = user.history.filter(h => h.id !== recipe.id);
  user.history.unshift({ id: recipe.id, name: recipe.title || recipe.name || 'Recipe', icon: recipe.emoji || '🍽️', viewedAt: Date.now() });
  user.history = user.history.slice(0, 50);
  writeData(data);
  res.json({ history: user.history });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
