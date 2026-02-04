import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState({
        name: '', description: '', price: '', category: '', image: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_URL}/api/products`, product, config);
            setMessage('Product added successfully!');
            setProduct({ name: '', description: '', price: '', category: '', image: '' });
        } catch (err) {
            setMessage('Error adding product');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Seller Dashboard</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>

            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Add New Product</h2>
                {message && <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <input name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required style={{ padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />
                    <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required style={{ padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem', minHeight: '100px' }} />
                    <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required style={{ padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />
                    <input name="category" placeholder="Category" value={product.category} onChange={handleChange} required style={{ padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />
                    <input name="image" placeholder="Image URL" value={product.image} onChange={handleChange} required style={{ padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />

                    <button type="submit" className="btn-primary">Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default SellerDashboard;
