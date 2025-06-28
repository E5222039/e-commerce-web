const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const port = 3000;

// ✅ MongoDB Connection (ONLY ONCE)
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

// ✅ Dummy Product List (you can later move to MongoDB)
const products = [
    { name: "Product 1", price: 10, image: "https://via.placeholder.com/200" },
    { name: "Product 2", price: 20, image: "https://via.placeholder.com/200" }
];

// ✅ In-memory cart per session
const userCarts = {};

// ✅ API: Get Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// ✅ API: Add to Cart
app.post('/api/cart', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: "Not logged in" });

    const username = req.session.user;
    const { name, price } = req.body;
    if (!userCarts[username]) userCarts[username] = [];

    const cart = userCarts[username];
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    res.json({ success: true });
});

// ✅ API: Get Cart
app.get('/api/cart', (req, res) => {
    const username = req.session.user;
    const cart = username ? userCarts[username] || [] : [];
    res.json({ items: cart });
});

// ✅ API: Remove from Cart
app.delete('/api/cart/remove/:index', (req, res) => {
    const username = req.session.user;
    const cart = userCarts[username] || [];
    cart.splice(req.params.index, 1);
    res.json({ success: true });
});

// ✅ API: Register
app.post('/api/register', async(req, res) => {
    const { username, password } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.json({ success: false, message: "User already exists" });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hash });
        await user.save();

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: "Error registering user" });
    }
});

// ✅ API: Login
app.post('/api/login', async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.json({ success: false, message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ success: false, message: "Incorrect password" });

        req.session.user = username;
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: "Login error" });
    }
});

// ✅ API: Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ✅ API: Get Logged-in User
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});