import React from 'react';
import { FaLaptop, FaMobileAlt, FaHeadphones, FaStopwatch, FaCamera, FaGamepad, FaTv } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: "All", icon: <FaLaptop /> },
    { name: "Mobiles", icon: <FaMobileAlt /> },
    { name: "Computers", icon: <FaLaptop /> },
    { name: "Audio", icon: <FaHeadphones /> },
    { name: "Wearables", icon: <FaStopwatch /> },
    { name: "Gaming", icon: <FaGamepad /> },
    { name: "Home Entertainment", icon: <FaTv /> },
];

const CategoryBar = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        if (category === 'All') navigate('/');
        else navigate(`/?category=${category}`);
    };

    return (
        <div style={{ background: 'var(--bg-card)', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', overflowX: 'auto', gap: '2rem' }}>
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleCategoryClick(cat.name)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '80px', gap: '0.5rem' }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--accent)' }}>
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
