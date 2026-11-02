# Crypto Tracker Platform

A multi-page cryptocurrency tracking web application with portfolio management, built with the MERN stack.

## Features

- **Homepage**: Live crypto prices from CoinGecko API, currency switcher (USD, EUR, JPY, GBP, CAD, AUD, CHF, CNY)
- **Authentication**: Register, login, logout with JWT
- **Portfolio Tracker**: Add buy/sell transactions with price, quantity, fees, and date/time
- **Transaction Management**: View transaction history, delete transactions
- **Currency Switcher**: Change display currency across the platform
- **Responsive Design**: Works on desktop and mobile

## Project Structure

```
crypto-tracker/
├── backend/
│   ├── models/          (User, Transaction schemas)
│   ├── routes/          (auth, transactions)
│   ├── controllers/     (authController, transactionController)
│   ├── middleware/      (auth verification)
│   ├── .env.example     (environment variables)
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/  (Navbar, BuySellDialog)
│   │   ├── context/     (AuthContext, CurrencyContext)
│   │   ├── pages/       (Home, Login, Register, Portfolio)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd crypto-tracker/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/crypto-tracker
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=30d
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd crypto-tracker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Register a new account or login
3. View live crypto prices on the homepage
4. Navigate to Portfolio to add buy/sell transactions
5. Use the currency switcher to change display currency
6. Delete transactions if needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile (protected)
- `PUT /api/auth/currency` - Update currency preference (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create new transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)
- `GET /api/transactions/portfolio` - Get portfolio summary (protected)

## Technologies

- **Frontend**: React, React Router, Tailwind CSS, Axios, Lucide React, React Hot Toast
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **External API**: CoinGecko (crypto prices)

## Notes

- Make sure MongoDB is running before starting the backend
- CoinGecko API is used without an API key (free tier has rate limits)