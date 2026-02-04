require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const dummyProducts = [
    {
        name: "Wireless Headphones",
        description: "High quality noise cancelling headphones with 20h battery life.",
        price: 199.99,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        rating: 4.5
    },
    {
        name: "Smart Watch Series 7",
        description: "Track your fitness, heart rate, and stay connected on the go.",
        price: 299.50,
        category: "Wearables",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
        rating: 4.2
    },
    {
        name: "Gaming Laptop Pro",
        description: "Powerful i9 processor and RTX 4080 for ultimate gaming.",
        price: 1299.00,
        category: "Computers",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80",
        rating: 4.8
    },
    {
        name: "Smartphone X",
        description: "Latest technology with 108MP camera and 5G connectivity.",
        price: 999.00,
        category: "Mobiles",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
        rating: 4.6
    },
    {
        name: "4K OLED TV",
        description: "Cinematic experience at home with deep blacks and vibrant colors.",
        price: 799.00,
        category: "Home Entertainment",
        image: "https://images.unsplash.com/photo-1593784997289-b85097241459?auto=format&fit=crop&w=500&q=80",
        rating: 4.3
    },
    {
        name: "Bluetooth Portable Speaker",
        description: "Waterproof, durable, and punchy bass for outdoor parties.",
        price: 59.99,
        category: "Audio",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80",
        rating: 4.1
    },
    {
        name: "Mirrorless Camera",
        description: "Professional photography made easy with interchangeable lenses.",
        price: 850.00,
        category: "Cameras",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
        rating: 4.7
    },
    {
        name: "Mechanical Keyboard",
        description: "RGB Backlit mechanical keyboard with blue switches.",
        price: 120.00,
        category: "Computers",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=500&q=80",
        rating: 4.4
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flipcart_clone')
    .then(async () => {
        console.log('MongoDB Connected for Seeding');
        await Product.deleteMany({});
        console.log('Cleared existing products');
        await Product.insertMany(dummyProducts);
        console.log('Seeded database with products');
        mongoose.disconnect();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
