# AI-Assisted Development - Exam Documentation

## Overview

**Project Name:** CryptoTracker AI - Cryptocurrency Portfolio Tracking Platform

**Project Type:** Multi-page Web Application (MERN Stack)

**Description:**
CryptoTracker AI is a full-stack cryptocurrency tracking web application that allows users to register, login, and manage their cryptocurrency portfolio. Users can track live crypto prices from the CoinGecko API, add buy/sell transactions with detailed information (price, quantity, fees, date/time), view portfolio holdings with profit/loss calculations, and delete transactions if errors are made. The application is built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS for styling.

**System Requirements:**
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Modern web browser
- Internet connection (for CoinGecko API)

---

## System Architecture – Modules

The system is broken down into the following technological modules:

### 1. Authentication Module
**Description:** Handles user registration, login, logout, and session management using JWT (JSON Web Tokens) with bcrypt password hashing.

**AI Approach:** The authentication flow was designed with security in mind - passwords are hashed using bcrypt with salt, and JWT tokens are used for stateless authentication. The AI helped structure the middleware to protect routes and ensure only authenticated users can access portfolio data.

**AI Assistance:** NVIDIA Nemotron 3.5 Super VL was used to generate the authentication middleware, route handlers, and JWT token generation/verification logic. The AI helped identify security best practices such as password hashing and token expiration.

### 2. Portfolio Management Module
**Description:** Handles CRUD operations for cryptocurrency transactions (buy/sell), portfolio summary calculations, and PnL (Profit and Loss) computations.

**AI Approach:** The module was designed to calculate realized and unrealized profit/loss based on transaction history. The AI helped implement the FIFO-style averaging for buy prices and proper PnL percentage calculations.

**AI Assistance:** NVIDIA Nemotron 3.5 Super VL assisted in designing the transaction schema, implementing the portfolio aggregation logic, and creating the PnL calculation formulas. The AI helped identify edge cases such as division by zero and null values.

### 3. Frontend UI Module
**Description:** React-based user interface with Tailwind CSS, including homepage, login/register pages, portfolio tracker, and buy/sell transaction dialog.

**AI Approach:** The UI was designed to be responsive and user-friendly, with clear navigation, modal dialogs for transactions, and real-time price updates. The AI helped structure the component hierarchy and state management using React Context API.

**AI Assistance:** NVIDIA Nemotron 3.5 Super VL helped create the React components, implement routing with React Router, manage authentication state with Context API, and style the interface with Tailwind CSS.

### 4. External API Integration Module
**Description:** Integrates with CoinGecko API to fetch live cryptocurrency prices and exchange rates.

**AI Approach:** The module was designed to fetch prices in USD for PnL calculation accuracy, with fallback error handling if the API is unavailable.

**AI Assistance:** NVIDIA Nemotron 3.5 Super VL helped implement the API fetching logic, error handling, and data parsing from the CoinGecko API responses.

---

## Development Process per Module

### Module 1: Authentication

**Approach & Reasoning:**
The authentication system was designed to be secure and stateless using JWT tokens. Passwords are hashed with bcrypt before storage, and tokens are stored in localStorage on the client side. Protected routes verify the JWT token before allowing access to portfolio data.

**Step-by-Step Workflow:**
1. Asked AI to design User schema with bcrypt password hashing
2. Asked AI to implement JWT token generation and verification middleware
3. Asked AI to create register/login route handlers with input validation
4. Asked AI to create AuthContext for React frontend state management
5. Tested registration and login endpoints with curl commands

**AI Tool Choice:** NVIDIA Nemotron 3.5 Super VL - chosen for its strong understanding of security best practices and ability to generate secure authentication code.

**Key Prompts:**
- "Create a User model with bcrypt password hashing and JWT support"
- "Implement JWT authentication middleware for protected routes"
- "Create React AuthContext for managing authentication state"

---

### Module 2: Portfolio Management

**Approach & Reasoning:**
The portfolio module was designed to track buy/sell transactions and calculate profit/loss. The system uses FIFO-style averaging for buy prices and calculates both realized and unrealized PnL. All calculations are done in USD.

**Step-by-Step Workflow:**
1. Asked AI to design Transaction schema with buy/sell types, price, quantity, fees, and date
2. Asked AI to implement portfolio aggregation logic (grouping by coin)
3. Asked AI to implement PnL calculation formulas (realized, unrealized, all-time)
4. Asked AI to create transaction CRUD routes with user ownership verification
5. Tested transaction CRUD operations with curl commands

**AI Tool Choice:** NVIDIA Nemotron 3.5 Super VL - chosen for its ability to handle complex mathematical calculations and edge cases.

**Key Prompts:**
- "Create Transaction schema with buy/sell types and portfolio aggregation"
- "Implement PnL calculation: realized profit, unrealized profit, all-time profit"
- "Create transaction CRUD routes with user ownership verification"

---

### Module 3: Frontend UI

**Approach & Reasoning:**
The frontend was designed as a multi-page application with React Router for navigation. The UI uses Tailwind CSS for responsive design, Lucide React for icons, and React Hot Toast for notifications. State management uses React Context API for authentication.

**Step-by-Step Workflow:**
1. Asked AI to create React app structure with React Router
2. Asked AI to implement Navbar with auth buttons and profile dropdown
3. Asked AI to create Home page with live crypto prices from CoinGecko
4. Asked AI to create Portfolio page with transaction table and PnL calculations
5. Asked AI to create BuySellDialog modal for adding transactions
6. Tested UI interactions in browser

**AI Tool Choice:** NVIDIA Nemotron 3.5 Super VL - chosen for its strong React and Tailwind CSS knowledge.

**Key Prompts:**
- "Create React app with React Router and Tailwind CSS"
- "Implement Navbar with auth buttons and profile dropdown"
- "Create Portfolio page with transaction table and PnL calculations"
- "Create BuySellDialog modal for adding transactions"

---

### Module 4: External API Integration

**Approach & Reasoning:**
The application integrates with CoinGecko API to fetch live cryptocurrency prices. The API is called without an API key (free tier), and prices are fetched in USD for PnL calculation accuracy. Error handling is implemented for API failures.

**Step-by-Step Workflow:**
1. Asked AI to implement CoinGecko API fetching for live prices
2. Asked AI to implement error handling for API failures
3. Asked AI to implement currency conversion logic (USD to display currency)
4. Tested API integration in browser

**AI Tool Choice:** NVIDIA Nemotron 3.5 Super VL - chosen for its understanding of API integration and error handling.

**Key Prompts:**
- "Implement CoinGecko API fetching for live crypto prices"
- "Implement error handling for API failures"
- "Implement currency conversion logic"

---

## Challenges & Tool Comparison

### Biggest Challenges:

1. **MongoDB Connection:** Initially, MongoDB was not installed locally, causing connection errors. Solved by using MongoDB Atlas (cloud database) with connection string configuration.

2. **Frontend-Backend Communication:** The frontend was making API calls to relative URLs, which caused CORS issues. Solved by adding proxy configuration in frontend package.json.

3. **PnL Calculation Accuracy:** Initially, PnL was calculated in the selected currency instead of USD, causing incorrect values when switching currencies. Solved by calculating PnL in USD first, then converting only the final amount. - Consequentially I decided to make the project use only USD for fiat currency.

4. **Ethereum Icon Missing:** The `Ethereum` icon doesn't exist in lucide-react. Solved by using Unicode symbols for all cryptocurrency icons.

5. **Transaction Deletion:** Mongoose `remove()` method is deprecated. Solved by using `deleteOne()` instead.

### Which Tool Helped Most:

**NVIDIA Nemotron 3.5 Super VL** was the most helpful tool because:
- Strong understanding of security best practices (JWT, bcrypt)
- Excellent React and Tailwind CSS knowledge
- Ability to handle complex mathematical calculations (PnL formulas)
- Good understanding of MongoDB/Mongoose operations
- Clear explanations of code and architecture decisions

### What I Would Improve:

1. Add charting library for price history visualization
2. Add more cryptocurrencies and trading pairs
3. Add email verification for registration
4. Add password reset functionality
5. Add transaction categories/tags
6. Add export functionality (CSV/PDF)
7. Add mobile app version
8. Add real-time WebSocket updates for prices

---

## Working System Evidence

### Screenshot 1: Homepage with Live Prices
The homepage displays live cryptocurrency prices from CoinGecko API in USD, with 24-hour change indicators and price charts.

### Screenshot 2: Portfolio Tracker with PnL
The portfolio tracker shows transaction history, portfolio holdings with PnL calculations (realized/unrealized/all-time), and percentage PnL for each coin.

### Screenshot 3: Buy/Sell Transaction Dialog
The buy/sell dialog allows users to input price, quantity, fees, and date/time for transactions.

### Screenshot 4: Backend API Testing
Terminal output showing successful API responses for register, login, create transaction, get transactions, and delete transaction endpoints.

---

## Conclusion

CryptoTracker AI is a fully functional cryptocurrency tracking platform built using the MERN stack with AI assistance. The application demonstrates modern web development practices including JWT authentication, RESTful API design, responsive UI with Tailwind CSS, and real-time data integration with external APIs. The AI-assisted development approach significantly accelerated development time and helped implement best practices for security, code organization, and error handling.

---

**Project Repository:** C:/Users/Ignatius Christenson/Desktop/crypto-tracker

**Backend URL:** http://localhost:5000

**Frontend URL:** http://localhost:3000

**API Endpoints:**
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get user profile (protected)
- GET /api/transactions - Get all transactions (protected)
- POST /api/transactions - Create transaction (protected)
- DELETE /api/transactions/:id - Delete transaction (protected)
- GET /api/transactions/portfolio - Get portfolio summary (protected)