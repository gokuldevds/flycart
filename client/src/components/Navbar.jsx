import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { cart } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <span className="gradient-text">FlipCart</span>
                </Link>

                <form onSubmit={handleSearch} className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: '2rem', width: '40%', border: '1px solid var(--glass-border)' }}>
                    <FaSearch style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </form>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--accent)' }}>Hi, {user.name}</span>
                            <Link to="/myorders" style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>My Orders</Link>
                            {user.role === 'seller' && <Link to="/seller-dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Dashboard</Link>}
                            {user.role === 'admin' && <Link to="/admin-dashboard" style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Admin Panel</Link>}
                            <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-muted)' }}><FaSignOutAlt /></button>
                        </div>
                    ) : (
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500 }}>
                            <FaUser /> Login
                        </Link>
                    )}

                    <Link to="/cart" style={{ position: 'relative' }}>
                        <FaShoppingCart size={24} color="var(--text-main)" />
                        {cart.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: 'var(--secondary)', color: 'white',
                                fontSize: '0.75rem', width: '20px', height: '20px',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {cart.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
