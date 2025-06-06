# Romulus Backend 🚀

A robust Node.js backend application built with Express.js, featuring comprehensive authentication, user management, and email verification capabilities.

## 📋 Overview

Romulus Backend is a production-ready API server that provides essential backend services including user authentication, email verification, OTP validation, and user management. The application follows modern development practices with proper code organization, validation, and documentation.

## ✨ Features

- **Authentication & Authorization**: Secure user registration, login, and password reset functionality
- **Email Verification**: Automated email verification system with token-based validation
- **OTP System**: One-time password generation and verification for enhanced security
- **User Management**: Complete CRUD operations for user accounts
- **API Documentation**: Interactive Swagger documentation for all endpoints
- **Development Tools**: Hot reloading, code formatting, and linting setup
- **Database Integration**: MongoDB integration with Mongoose ODM
- **Security**: JWT-based authentication with bcrypt password hashing
- **Logging**: Comprehensive logging with Winston
- **File Upload**: Multer integration for file handling capabilities

## 🛠️ Technology Stack

### Core Dependencies
- **Express.js** (v4.21.2) - Web framework
- **Mongoose** (v8.9.6) - MongoDB object modeling
- **JWT** (v9.0.2) - Authentication tokens
- **Bcrypt.js** (v2.4.3) - Password hashing
- **Joi** (v17.13.3) - Data validation
- **Nodemailer** (v6.10.0) - Email sending
- **Winston** (v3.17.0) - Logging

### Documentation & Development
- **Swagger** - API documentation with interactive UI
- **Nodemon** (v3.1.9) - Development auto-restart
- **ESLint** (v9.20.0) - Code linting
- **Prettier** (v3.5.0) - Code formatting
- **Faker.js** (v9.5.0) - Test data generation

### Additional Features
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Cookie Parser** - Cookie handling middleware
- **Multer** - File upload handling
- **Colors** - Console output styling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run dev`

## 📜 Available Scripts

The project includes several utility scripts for development and maintenance:

- **`npm start`** - Launches the production server
- **`npm run dev`** - Starts development server with hot reloading via Nodemon  
- **`npm run seed`** - Populates the database with initial seed data
- **`npm run lint`** - Analyzes code for quality and style issues using ESLint
- **`npm run format`** - Automatically formats code using Prettier across all supported file types

## 📖 API Documentation

Comprehensive API documentation is available through Swagger UI. After setting up the project locally, access the interactive documentation at:

```
http://localhost:5000/api-docs
```

The documentation provides detailed information about all available endpoints, request/response schemas, authentication requirements, and example usage.

## 🏗️ Project Structure

The application uses ES6 modules with a well-organized import mapping system:

```
src/
├── config/     # Application configuration
├── constants/  # Application constants
├── data-access/# Database access layer
├── dtos/       # Data transfer objects
├── middleware/ # Express middleware
├── models/     # Database models
├── modules/    # Feature modules
├── routes/     # API route definitions
├── server/     # Server configuration
├── utils/      # Utility functions
└── scripts/    # Maintenance scripts
```

## 👨‍💻 Author

**Sharjeel Faiq**

## 📄 License

This project is licensed under the ISC License.