const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/cart', async(req, res) => {
    try {
        const { userId, items } = req.body;

        const cart = new Cart({ userId, items });
        await cart.save();

        res.status(201).json({ message: 'Cart saved', cart });
    } catch (error) {
        console.error('Cart error:', error);
        res.status(500).json({ error: 'Failed to save cart' });
    }
});

module.exports = router;