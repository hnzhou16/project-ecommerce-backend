# E-Commerce Platform - Backend API

A robust, scalable backend API for the e-commerce platform built with Node.js, TypeScript, and Express. Provides
comprehensive e-commerce functionality including user authentication, product management, shopping cart updates, order
processing, and AI-powered features.

**Live Demo**: [https://hugzest.com/](https://hugzest.com/)

## Features

### Authentication & Security

- **JWT Authentication**: Secure token-based authentication
- **User Registration**: Account creation with verification system
- **Password Security**: Bcrypt password hashing with salt rounds
- **Input Validation**: Comprehensive request validation using class-validator

### User Management

- **User Profiles**: Complete user profile management with personal information

### Product Management

- **Product Catalog**: Full CRUD operations for product management
- **Category Management**: Hierarchical product categorization system
- **Product Search**: Advanced search functionality with filters

### Order Management

- **Shopping Cart**: Persistent cart management with real-time updates
- **Order Processing**: Complete order lifecycle from creation to fulfillment

### Payment Integration

- **PayPal Integration**: Secure payment processing with PayPal REST SDK

### AI-Powered Features

- **OpenAI Integration**: AI-powered product recommendations and descriptions
- **Product Suggestions**: Personalized product recommendations

### Database & ORM

- **TypeORM Integration**: Object-relational mapping with SQLite database
- **Entity Management**: Well-structured database entities and relationships
- **Migration Support**: Database schema versioning and migration system

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Database**: SQLite with TypeORM
- **Authentication**: JWT with jsonwebtoken
- **Password Hashing**: Bcrypt
- **Email**: Nodemailer for email services
- **Payment**: PayPal REST SDK
- **AI**: OpenAI API integration
- **Validation**: Class-validator and class-transformer

## Project Structure

```
project-ecommerce-backend/
├── src/                      # Source code
│   ├── controllers/          # Request handlers and business logic
│   │   ├── AuthController.ts # Authentication endpoints
│   │   ├── CartController.ts  # Shopping cart management
│   │   ├── FilterController.ts # Product filtering and search
│   │   ├── OpenAIController.ts # AI integration endpoints
│   │   ├── OrderController.ts # Order processing
│   │   ├── PaymentController.ts # Payment processing
│   │   └── ProductController.ts # Product management
│   ├── entity/               # TypeORM entities
│   ├── enums/                # TypeScript enums and constants
│   ├── helper/               # Utility functions and helpers
│   ├── routes/               # API route definitions
│   ├── AppHelper.ts          # Application helper functions
│   ├── index.ts              # Application entry point
│   └── InitDataSource.ts     # Database configuration
├── db/                       # Database files and migrations
├── build/                    # Compiled JavaScript output
├── .env.development          # Development environment variables
├── .env.production.local     # Production environment variables
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## API Endpoints

### Authentication & User

- `GET /auth/verifyToken` - Verify authentication token 
- `POST /auth/signup` - Register a new user 
- `POST /auth/login` - Log in a user 
- `POST /auth/forgot-password` - Request a password reset token 
- `POST /auth/reset-password/:resetToken` - Reset password using reset token 
- `POST /auth/update-info/:userId` - Update user profile information

### Product Management

- `GET /product/allProducts` - Get all products
- `GET /product/:productId` - Get product details by ID
- `POST /product/addProduct` - Create new product (admin only)
- `POST /product/addCategory` - Assign category to product (admin only)
- `POST /product/addSwatch` - Add color swatch to product (admin only)

### Cart Management

- `POST /cart/getCart` - Get the current user’s cart
- `POST /cart/addItem` - Add item to cart
- `PUT /cart/changeQuantity/:itemId` - Update cart item quantity 
- `PUT /cart/editItem/:itemId` - Edit details of an item in the cart (e.g., size, color)
- `DELETE /cart/removeItem/:itemId` - Remove an item from the cart 
- `DELETE /cart/clearCart/:userId` - Clear all items in a user’s cart

### Filtering

- `GET /filter/getFilter` - Get available filter options (categories, colors, sizes, etc.)
- `POST /filter/filteredProducts` - Get products filtered by selected options

### Payment Processing

- `POST /payment/create` - Create payment intent

### AI Features

- `POST /AI` - Get product recommendations

### File Management

- `POST /upload/image` - Upload product images
- `DELETE /upload/image/:id` - Delete uploaded image
- `GET /upload/image/:id` - Get image by ID


