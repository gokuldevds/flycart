import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQty } = useContext(CartContext);

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (cart.length === 0) {
        return (
            <div className="container flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1.5rem' }}>
                <h2>Your cart is empty</h2>
                <Link to="/" className="btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item._id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />

                            <div style={{ flex: 1 }}>
                                <h3>{item.name}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>${item.price}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button onClick={() => updateQty(item._id, -1)} style={{ padding: '5px', background: 'var(--bg-card)', color: 'white', borderRadius: '50%' }}><FaMinus size={12} /></button>
                                <span>{item.qty}</span>
                                <button onClick={() => updateQty(item._id, 1)} style={{ padding: '5px', background: 'var(--bg-card)', color: 'white', borderRadius: '50%' }}><FaPlus size={12} /></button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                style={{ color: '#ef4444', background: 'transparent', fontSize: '1.2rem' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        <span>Total:</span>
                        <span style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'block', textAlign: 'center' }}>Checkout</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
