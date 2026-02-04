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
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flipcart_clone')
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

app.post('/api/seed', async (req, res) => {
    try {
        const dummyProducts = [
            // Mobiles
            {
                name: "iPhone 14 Pro",
                description: "Dynamic Island, Always-On display, and 48MP Main camera.",
                price: 999.00,
                category: "Mobiles",
                image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=500&q=80",
                rating: 4.9
            },
            {
                name: "Samsung Galaxy S23 Ultra",
                description: "Epic Nightography, 200MP camera, and built-in S Pen.",
                price: 1199.00,
                category: "Mobiles",
                image: "https://images.unsplash.com/photo-1610945415295-d96bf067153c?auto=format&fit=crop&w=500&q=80",
                rating: 4.8
            },
            {
                name: "Google Pixel 7",
                description: "Google Tensor G2, 50MP camera, and all-day battery.",
                price: 599.00,
                category: "Mobiles",
                image: "https://images.unsplash.com/photo-1598327105666-5b89351aff70?auto=format&fit=crop&w=500&q=80",
                rating: 4.5
            },
            {
                name: "OnePlus 11",
                description: "Snapdragon 8 Gen 2, 100W charging.",
                price: 699.00,
                category: "Mobiles",
                image: "https://images.unsplash.com/photo-1679069695029-76081da309e1?auto=format&fit=crop&w=500&q=80",
                rating: 4.4
            },

            // Computers
            {
                name: "MacBook Air M2",
                description: "Supercharged by M2. Strikingly thin and fast.",
                price: 1199.00,
                category: "Computers",
                image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=500&q=80",
                rating: 4.9
            },
            {
                name: "Dell XPS 13",
                description: "InfinityEdge display, premium materials.",
                price: 999.00,
                category: "Computers",
                image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=500&q=80",
                rating: 4.6
            },
            {
                name: "Gaming Laptop Rog Strix",
                description: "Powerful performance for gaming and work.",
                price: 1299.00,
                category: "Computers",
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80",
                rating: 4.8
            },

            // Audio
            {
                name: "Sony WH-1000XM5",
                description: "Industry-leading noise cancellation.",
                price: 348.00,
                category: "Audio",
                image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
                rating: 4.8
            },
            {
                name: "AirPods Pro 2",
                description: "Adaptive Audio, Active Noise Cancellation.",
                price: 249.00,
                category: "Audio",
                image: "https://images.unsplash.com/photo-1603351154351-5cf99bc32f2d?auto=format&fit=crop&w=500&q=80",
                rating: 4.7
            },
            {
                name: "JBL Flip 6",
                description: "Bold sound, waterproof, 12 hours playtime.",
                price: 99.99,
                category: "Audio",
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80",
                rating: 4.5
            },

            // Wearables
            {
                name: "Apple Watch Series 8",
                description: "Advanced health sensors and apps.",
                price: 399.00,
                category: "Wearables",
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80",
                rating: 4.8
            },
            {
                name: "Samsung Galaxy Watch 5",
                description: "Sleep tracking, monitoring, and wellness.",
                price: 279.00,
                category: "Wearables",
                image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80",
                rating: 4.4
            },

            // Gaming
            {
                name: "PlayStation 5",
                description: "Lightning-fast loading, 3D audio.",
                price: 499.00,
                category: "Gaming",
                image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80",
                rating: 4.9
            },
            {
                name: "Xbox Series X",
                description: "The fastest, most powerful Xbox ever.",
                price: 499.00,
                category: "Gaming",
                image: "https://images.unsplash.com/photo-1621259182903-06dc1c460c59?auto=format&fit=crop&w=500&q=80",
                rating: 4.7
            },
            {
                name: "Nintendo Switch OLED",
                description: "7-inch OLED screen, wide adjustable stand.",
                price: 349.00,
                category: "Gaming",
                image: "https://images.unsplash.com/photo-1578303512597-8198dd38ad59?auto=format&fit=crop&w=500&q=80",
                rating: 4.6
            },

            // Cameras
            {
                name: "Sony Alpha a7 IV",
                description: "33MP Full-Frame Mirrorless Camera.",
                price: 2498.00,
                category: "Cameras",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
                rating: 4.9
            },
            {
                name: "Canon EOS R6",
                description: "20MP Full-Frame Mirrorless Camera.",
                price: 2299.00,
                category: "Cameras",
                image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=500&q=80",
                rating: 4.7
            },
            {
                name: "GoPro HERO11 Black",
                description: "Action camera with 5.3K60 video.",
                price: 399.00,
                category: "Cameras",
                image: "https://images.unsplash.com/photo-1564463836205-aca608801772?auto=format&fit=crop&w=500&q=80",
                rating: 4.6
            },

            // Home Entertainment
            {
                name: "LG OLED C2 65\"",
                description: "Self-lit OLED pixels, 4K Cinema HDR.",
                price: 1696.00,
                category: "Home Entertainment",
                image: "https://images.unsplash.com/photo-1593784997289-b85097241459?auto=format&fit=crop&w=500&q=80",
                rating: 4.8
            },
            {
                name: "Samsung QLED 4K",
                description: "Quantum Dot technology, 100% Color Volume.",
                price: 997.00,
                category: "Home Entertainment",
                image: "https://images.unsplash.com/photo-1552972476-418081511228?auto=format&fit=crop&w=500&q=80",
                rating: 4.5
            }
        ];

        await Product.deleteMany({});
        await Product.insertMany(dummyProducts);
        res.json({ message: 'Database Seeded!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
