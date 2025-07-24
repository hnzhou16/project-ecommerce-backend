# E-Commerce Platform - Backend API

A robust, scalable backend API for the e-commerce platform built with Node.js, TypeScript, and Express. Provides comprehensive e-commerce functionality including user authentication, product management, order processing, payment integration, and AI-powered features.

## Features

### Authentication & Security

- **JWT Authentication**: Secure token-based authentication with refresh token support
- **User Registration**: Email-based account creation with verification system
- **Password Security**: Bcrypt password hashing with salt rounds
- **Role-Based Access Control**: Admin and customer roles with granular permissions
- **Session Management**: Secure session handling with HTTP-only cookies
- **Input Validation**: Comprehensive request validation using class-validator

### User Management

- **User Profiles**: Complete user profile management with personal information
- **Account Verification**: Email-based account activation system
- **Password Reset**: Secure password reset functionality via email
- **User Preferences**: Customizable user settings and preferences
- **Admin Panel**: Administrative user management and oversight

### Product Management

- **Product Catalog**: Full CRUD operations for product management
- **Category Management**: Hierarchical product categorization system
- **Inventory Tracking**: Real-time inventory management and stock updates
- **Product Search**: Advanced search functionality with filters and sorting
- **Product Images**: Image upload and management with file validation
- **Product Reviews**: Customer review and rating system

### Order Management

- **Shopping Cart**: Persistent cart management with session handling
- **Order Processing**: Complete order lifecycle from creation to fulfillment
- **Order Tracking**: Real-time order status updates and tracking
- **Order History**: Comprehensive order history for customers and admins
- **Inventory Updates**: Automatic inventory adjustments on order placement

### Payment Integration

- **PayPal Integration**: Secure payment processing with PayPal REST SDK
- **Payment Validation**: Transaction verification and fraud prevention
- **Payment History**: Complete payment transaction logging
- **Refund Processing**: Automated and manual refund capabilities
- **Multiple Currencies**: Support for various currencies and payment methods

### AI-Powered Features

- **OpenAI Integration**: AI-powered product recommendations and descriptions
- **Smart Search**: Intelligent search with natural language processing
- **Product Suggestions**: Personalized product recommendations

### Email Services

- **Account Notifications**: User registration and password reset emails


### Database & ORM

- **TypeORM Integration**: Object-relational mapping with SQLite database
- **Entity Management**: Well-structured database entities and relationships
- **Migration Support**: Database schema versioning and migration system
- **Connection Pooling**: Efficient database connection management
- **Transaction Support**: ACID transactions for data consistency


## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Database**: SQLite with TypeORM
- **Authentication**: JWT with jsonwebtoken
- **Password Hashing**: Bcrypt
- **Email**: Nodemailer for email services
- **Payment**: PayPal REST SDK
- **AI**: OpenAI API integration
- **File Upload**: Express-fileupload
- **Validation**: Class-validator and class-transformer
- **Security**: Helmet.js, CORS
- **Development**: tsx for hot reload, Prettier for formatting

## Project Structure

```
project-ecommerce-backend/
├── src/                      # Source code
│   ├── controllers/          # Request handlers and business logic
│   │   ├── AuthController.ts # Authentication endpoints
│   │   ├── CartController.ts # Shopping cart management
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

### Authentication
- `POST /auth/register` - Register new user account
- `POST /auth/login` - User login and JWT token generation
- `POST /auth/logout` - User logout and token invalidation
- `POST /auth/refresh` - Refresh JWT access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset user password

### User Management
- `GET /user/profile` - Get current user profile
- `PUT /user/profile` - Update user profile information
- `GET /user/orders` - Get user order history
- `PUT /user/preferences` - Update user preferences

### Product Management
- `GET /products` - Get product catalog with pagination
- `GET /products/:id` - Get product details by ID
- `POST /products` - Create new product (admin only)
- `PUT /products/:id` - Update product information (admin only)
- `DELETE /products/:id` - Delete product (admin only)
- `GET /products/search` - Search products with filters
- `GET /products/categories` - Get product categories

### Shopping Cart
- `GET /cart` - Get user's shopping cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item quantity
- `DELETE /cart/remove` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

### Order Management
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (admin only)
- `GET /orders/:id/tracking` - Get order tracking information

### Payment Processing
- `POST /payment/create` - Create payment intent
- `POST /payment/confirm` - Confirm payment
- `POST /payment/refund` - Process refund (admin only)
- `GET /payment/history` - Get payment history

### AI Features
- `POST /ai/recommendations` - Get product recommendations
- `POST /ai/search` - AI-powered product search
- `POST /ai/generate-description` - Generate product description
- `POST /ai/analyze-reviews` - Analyze product reviews

### File Management
- `POST /upload/image` - Upload product images
- `DELETE /upload/image/:id` - Delete uploaded image
- `GET /upload/image/:id` - Get image by ID

### Admin Features
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/orders` - Get all orders (admin only)
- `GET /admin/analytics` - Get platform analytics (admin only)
- `PUT /admin/users/:id/status` - Update user status (admin only)
