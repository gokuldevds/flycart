import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { FaStar, FaArrowLeft } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <div className="flex-center" style={{ height: '80vh' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--accent)' }}>
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', padding: '3rem' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', borderRadius: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            <FaStar /> <span>{product.rating}</span>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
            {product.description}
          </p>

          <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '2rem' }}>
            ${product.price}
          </h2>

          <button
            className="btn-primary"
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
