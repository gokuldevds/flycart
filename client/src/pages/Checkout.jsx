import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const { cart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const placeOrder = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const orderData = {
                orderItems: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.qty
                })),
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'PayPal', // Mock
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice
            };

            await axios.post('http://localhost:5000/api/orders', orderData, config);
            alert('Order Placed Successfully!');
            navigate('/myorders');
        } catch (err) {
            alert('Error placing order: ' + (err.response?.data?.message || err.message));
        }
    };

    if (cart.length === 0) return <div className="flex-center" style={{ height: '60vh' }}><h2>Your Cart is Empty</h2></div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Shipping Details</h2>
                    <form onSubmit={placeOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />
                        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} required style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />
                        <input placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />
                        <input placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '0.5rem' }} />

                        <h2 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Payment Method</h2>
                        <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="radio" checked readOnly /> PayPal / Credit Card (Mock)
                            </label>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Place Order</button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Items:</span> <span>${itemsPrice.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping:</span> <span>${shippingPrice.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax:</span> <span>${taxPrice.toFixed(2)}</span></div>
                        <div style={{ height: '1px', background: 'var(--glass-border)' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}><span>Total:</span> <span>${totalPrice}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
