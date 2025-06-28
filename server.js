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

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});

// ✅ Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySuperSecret',
    resave: false,
    saveUninitialized: false
}));

// ✅ Dummy Product List
const products = [
    { name: "Product 1", price: 10, image: "https://via.placeholder.com/200" },
    { name: "Product 2", price: 20, image: "https://via.placeholder.com/200" }
];

// ✅ Get Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// ✅ Save Cart to MongoDB
app.post('/api/cart', async(req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

    const { items } = req.body;
    try {
        // Remove existing cart and create new
        await Cart.findOneAndDelete({ userId: req.session.userId });
        const cart = new Cart({ userId: req.session.userId, items });
        await cart.save();
        res.json({ success: true, cart });
    } catch (err) {
        console.error("Cart save error:", err);
        res.status(500).json({ success: false, message: "Failed to save cart" });
    }
});

// ✅ Get Cart from MongoDB
app.get('/api/cart', async(req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });

    try {
        const cart = await Cart.findOne({ userId: req.session.userId });
        res.json({ items: cart ? cart.items : [] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to get cart" });
    }
});

// ✅ Register
app.post('/api/register', async(req, res) => {
    const { username, password } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.json({ success: false, message: "User already exists" });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hash });
        await user.save();
        req.session.userId = user._id;
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: "Error registering user" });
    }
});

// ✅ Login
app.post('/api/login', async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.json({ success: false, message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ success: false, message: "Incorrect password" });

        req.session.userId = user._id;
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: "Login error" });
    }
});

// ✅ Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ✅ Get Logged-in User
app.get('/api/user', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});