# Fashion Cube - Emoji-Based E-commerce 🛍️

A fun, modern e-commerce application featuring emoji-based products with a vibrant UI and smooth user experience.

## Tech Stack

**Frontend:**
- React.js with Redux for state management
- React Router v5 for navigation
- Axios for API calls
- Sass for styling
- React-Bootstrap for UI components
- AOS for scroll animations

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose (with localStorage fallback)

## Features

✅ **1000+ Emoji Products** - Browse through a vast collection of emoji-based products across multiple categories

✅ **Smart Categories** - Filter products by Men, Women, Shoes, and Accessories

✅ **Modern UI** - Gradient backgrounds, hover animations, and smooth transitions

✅ **Shopping Cart** - Add items, update quantities, and manage your cart (localStorage-backed)

✅ **User Authentication** - Register and login functionality (localStorage-backed)

✅ **Indian Pricing** - All prices displayed in Indian Rupees (₹)

✅ **Discount System** - Dynamic discount badges on products

✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

✅ **LocalStorage Fallback** - Complete offline functionality without backend dependency

## Product Catalog

The application features 1000 dynamically generated products with:
- 30 unique product templates (T-Shirts, Dresses, Shoes, Bags, Watches, etc.)
- Random color and style variations
- Realistic pricing with discounts
- Emoji representations (👕 👗 👞 👜 ⌚ 👔 🎒 and more)

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AbhimanyuAryan/MultiAgentSYM.git
cd MultiAgentSYM
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server/ecommerce
npm install
cd ../..
```

### Running the Application

1. Start the backend server:
```bash
cd server/ecommerce
NODE_OPTIONS=--openssl-legacy-provider npm start
```
The server will run on http://localhost:3001

2. In a new terminal, start the frontend:
```bash
npm start
```
The app will open at http://localhost:3000

## Architecture

### Frontend Structure
```
src/
├── components/
│   ├── Products/          # Product display components
│   ├── NavBar/           # Navigation components
│   ├── LoginRegisterModal/ # Authentication modals
│   └── ...
├── redux/
│   ├── actions/          # Redux actions
│   ├── reducers/         # Redux reducers
│   └── store/            # Redux store
├── views/                # Page components
└── modules/              # Helper modules
```

### LocalStorage Fallback System

The application implements a robust fallback system:
- **Authentication**: Stores user credentials in `ecommerce_users`
- **Cart Management**: Stores cart per user with key `cart_${userId}`
- **Session Tokens**: Mock JWT tokens for authentication
- **Automatic Fallback**: Tries API first, falls back to localStorage on failure

## Key Features in Detail

### Product Generation
1000 products are generated using a template system with:
- 30 base product templates
- 12 color variations
- 10 style variations
- Random pricing between base price ±30%
- Random discounts up to 50%

### Shopping Cart
- Add products with one click
- Update quantities (increase/decrease)
- Automatic total calculation
- Persists across page refreshes
- Per-user cart isolation

### Authentication
- User registration with validation
- Login with error handling
- Mock JWT token generation
- Session persistence
- Welcome message on login

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- MongoDB backend has compatibility issues with newer Node versions
- All data stored in localStorage (not shared across devices)
- No payment gateway integration
- No order history tracking

## Future Enhancements

- [ ] Add product search functionality
- [ ] Implement wishlist feature
- [ ] Add product reviews and ratings
- [ ] Implement checkout and payment flow
- [ ] Add order history
- [ ] Enable product image uploads
- [ ] Add admin dashboard
- [ ] Implement real-time inventory management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Original template by Santosh Kumar Dash
- Enhanced with emoji-based products and localStorage system
- Built with Claude Code assistance

---

Made with ❤️ and lots of emojis 🎉
