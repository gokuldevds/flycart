import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.get(`${API_URL}/api/products`);
            setProducts(res.data);
        };
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_URL}/api/products/${id}`, config);
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert('Error deleting product');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>All Products</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Seller</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{product.name}</td>
                                <td style={{ padding: '1rem' }}>${product.price}</td>
                                <td style={{ padding: '1rem' }}>{product.seller ? product.seller.name : 'Unknown'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => deleteProduct(product._id)} style={{ color: '#ef4444', background: 'transparent' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
