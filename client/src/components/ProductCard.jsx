import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: '0.3s' }}>
            <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '0.5rem' }}>
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', cursor: 'pointer' }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                </Link>
            </div>

            <div>
                <Link to={`/product/${product._id}`}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', cursor: 'pointer' }}>{product.name}</h3>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
                    <FaStar /> <span>{product.rating}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {product.description.substring(0, 60)}...
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>${product.price}</span>
                <button
                    className="btn-primary"
                    onClick={() => addToCart(product)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
