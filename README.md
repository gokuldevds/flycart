# FlyCart - Premium Electronics Store

A full-stack MERN e-commerce application with a premium, responsive design.

## Features

- **MERN Stack**: MongoDB, Express, React, Node.js.
- **Modern UI**: Glassmorphism, animations, dark mode aesthetic, and responsive design using Vanilla CSS variables.
- **Product Catalog**: View products with details, ratings, and categories.
- **Shopping Cart**: Add/remove items, update quantities, and view real-time totals.
- **API Proxying**: Seamless development with Vite proxy.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Installation

1.  **Clone/Open the project**
2.  **Install Server Dependencies**
    ```bash
    cd server
    npm install
    ```
3.  **Install Client Dependencies**
    ```bash
    cd client
    npm install
    ```

### Running the Application

1.  **Start the Server** (Terminal 1)
    ```bash
    cd server
    node index.js
    ```
    The server runs on `http://localhost:5000`.

2.  **Start the Client** (Terminal 2)
    ```bash
    cd client
    npm run dev
    ```
    The client runs on `http://localhost:5173`.

### Database Seeding

The database comes pre-seeded. If you need to reset the data:
```bash
cd server
node seed.js
```

## Structure

- `server/`: Backend API and Database Models.
- `client/`: React Frontend.
  - `src/components`: UI Components (Navbar, ProductCard, Footer).
  - `src/pages`: Page layouts (Home, ProductDetails, Cart).
  - `src/index.css`: Global Design System (variables, styles).
