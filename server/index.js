require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes - Auth
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// Routes - Products
app.get('/api/products', async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const categoryQuery = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {};

        const products = await Product.find({ ...keyword, ...categoryQuery }).populate('seller', 'name email');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Protected Product Routes (Add Product)
const { protect, authorize } = require('./middleware/auth');

app.post('/api/products', protect, authorize('seller', 'admin'), async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const product = new Product({
            name, description, price, category, image,
            seller: req.user._id
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/products/:id', protect, authorize('seller', 'admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if user is seller or admin
        if (req.user.role !== 'admin' && product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Routes - Cart
app.get('/api/cart/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/cart/:userId/add', async (req, res) => {
    try {
        const { userId } = req.params;
        const { product } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === product._id);

        if (itemIndex > -1) {
            cart.items[itemIndex].qty += 1;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: 1
            });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/cart/:userId/update', async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, qty } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
        if (itemIndex > -1) {
            if (qty > 0) {
                cart.items[itemIndex].qty = qty;
            } else {
                cart.items.splice(itemIndex, 1);
            }
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/cart/:userId/remove/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
