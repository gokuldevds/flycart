import React from 'react';
import { FaHeart, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-text">FlyCart</span>
                        <p>Premium Electronics Store</p>
                    </div>

                    <div className="footer-links">
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                        <a href="#">Terms</a>
                        <a href="#">Privacy</a>
                    </div>

                    <div className="social-links">
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaGithub /></a>
                        <a href="#"><FaInstagram /></a>
                    </div>
                </div>

                <div className="copyright">
                    <p>Made with <FaHeart className="heart-icon" /> by Gokul Dev D S. &copy; 2026</p>
                </div>
            </div>

            <style>{`
        .footer {
          margin-top: 4rem;
          background: rgba(15, 23, 42, 0.9);
          border-top: 1px solid var(--border-light);
          padding: 3rem 0 2rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-brand .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, #fff, var(--primary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .footer-brand p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: var(--text-muted);
        }
        
        .footer-links a:hover {
          color: var(--primary);
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
          font-size: 1.2rem;
        }

        .copyright {
          text-align: center;
          border-top: 1px solid var(--border-light);
          padding-top: 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .heart-icon {
          color: var(--secondary);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
