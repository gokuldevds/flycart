import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/products?keyword=${keyword}`;
                if (category) url += `&category=${category}`;

                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category]);

    return (
        <div>
            <CategoryBar />

            {/* Only show Hero banner if no search/filter is active */}
            {!keyword && !category && (
                <div style={{ height: '300px', background: 'linear-gradient(to right, #0f172a, #1e1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div className="container" style={{ zIndex: 1, textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Big Savings Festival
                        </h1>
                        <p style={{ fontSize: '1.5rem', color: '#e2e8f0' }}>Up to 70% off on top Electronics</p>
                    </div>
                    <div style={{ position: 'absolute', width: '300px', height: '300px', background: '#4f46e5', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.3', top: '-50px', left: '-50px' }}></div>
                    <div style={{ position: 'absolute', width: '300px', height: '300px', background: '#ec4899', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.3', bottom: '-50px', right: '-50px' }}></div>
                </div>
            )}

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
                    {keyword ? `Search Results for "${keyword}"` : category ? `${category}` : "Best of Electronics"}
                </h2>

                {loading ? (
                    <div className="flex-center" style={{ height: '50vh' }}><h2>Loading items...</h2></div>
                ) : products.length === 0 ? (
                    <div className="flex-center" style={{ height: '40vh', flexDirection: 'column' }}>
                        <h3>No products found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or category.</p>
                    </div>
                ) : (
                    <div className="grid-products">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
