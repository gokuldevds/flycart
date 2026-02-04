import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Footer from './components/Footer';

import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Router>
      {/* Wrap everything in AuthProvider first, then CartProvider if Cart needs Auth */}
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/seller-dashboard"
                  element={
                    <ProtectedRoute roles={['seller', 'admin']}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/myorders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
