const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Cart = require('./models/Cart');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: false
}));

const products = [
  { productId: "1", name: "Product 1", price: 10, image: "https://via.placeholder.com/200" },
  { productId: "2", name: "Product 2", price: 20, image: "https://via.placeholder.com/200" }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/cart', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });

  const { name, price } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) cart = new Cart({ userId: req.session.userId, items: [] });

    const item = cart.items.find(i => i.name === name);
    if (item) item.quantity += 1;
    else cart.items.push({ name, price, quantity: 1 });

    await cart.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/api/cart', async (req, res) => {
  if (!req.session.userId) return res.json({ items: [] });
  const cart = await Cart.findOne({ userId: req.session.userId });
  res.json({ items: cart?.items || [] });
});

app.delete('/api/cart/remove/:index', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.session.userId });
  if (!cart) return res.status(400).json({ error: "No cart" });

  cart.items.splice(req.params.index, 1);
  await cart.save();
  res.json({ message: "Item removed" });
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: "User exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();

  req.session.userId = user._id;
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false, message: "Not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: "Wrong password" });

  req.session.userId = user._id;
  res.json({ success: true });
});

app.get('/api/user', async (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  const user = await User.findById(req.session.userId);
  res.json({ loggedIn: true, username: user.username });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});
app.get('/api/cart/admin-view', async (req, res) => {
  try {
    const carts = await Cart.find().populate('userId', 'username'); // 👈 join with User
    const result = carts.map(cart => ({
      username: cart.userId.username,
      items: cart.items
    }));
    res.json(result);
  } catch (err) {
    console.error('Error fetching carts with username:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(port, () => console.log(`🚀 Server: http://localhost:${port}`));
