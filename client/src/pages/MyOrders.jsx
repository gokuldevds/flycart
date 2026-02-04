import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${API_URL}/api/orders/myorders`, config);
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2>No orders found</h2>
                    <p style={{ margin: '1rem 0' }}>Looks like you haven't bought anything yet.</p>
                    <Link to="/" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Order ID:</span> {order._id}
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Total:</span> <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div style={{ padding: '1rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                                {order.orderItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>{item.name}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>{item.qty} x ${item.price}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ padding: '0.5rem 1rem', background: order.isDelivered ? 'green' : '#f59e0b', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {order.isDelivered ? 'Delivered' : 'Processing'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
