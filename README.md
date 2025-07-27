# Romulus Backend

Node.js backend application with Express.js for authentication, user management, and email services.

## Prerequisites

- Node.js (v16+)
- MongoDB database
- Environment variables configured

## Installation

```bash
npm install
```

## Scripts

- **`npm start`** - Production server
- **`npm run dev`** - Development server with hot reload
- **`npm run format`** - Format code with Prettier
- **`npm run seed`** - Seed database with initial data
- **`npm run lint`** - Check code quality with ESLint

## Environment Setup

Configure required environment variables before running the application.

## API Documentation

Interactive Swagger documentation available at:

```
http://localhost:5000/api-docs
```

## Project Structure

ES6 modules with import mapping:

```
📁 romulus-backend
├── 📄 eslint.config.js
├── 📄 nodemon.json
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 README.md
├── 📁 docs
│   └── 📁 swagger
│       ├── 📄 common.yaml
│       ├── 📁 auth
│       │   └── 📄 index.yaml
│       ├── 📁 educators
│       │   └── 📄 index.yaml
│       ├── 📁 email
│       │   └── 📄 index.yaml
│       ├── 📁 health
│       │   └── 📄 index.yaml
│       ├── 📁 mission
│       │   └── 📄 index.yaml
│       ├── 📁 notifications
│       │   └── 📄 index.yaml
│       ├── 📁 organizations
│       │   └── 📄 index.yaml
│       └── 📁 twilio
│           └── 📄 index.yaml
└── 📁 src
    ├── 📄 index.js
    ├── 📁 config
    │   ├── 📄 cloudinary.config.js
    │   ├── 📄 database.config.js
    │   ├── 📄 env.config.js
    │   ├── 📄 index.js
    │   ├── 📄 logger.config.js
    │   ├── 📄 mail.config.js
    │   ├── 📄 swagger.config.js
    │   └── 📄 twilio.config.js
    ├── 📁 constants
    │   └── 📄 index.js
    ├── 📁 data-access
    │   ├── 📄 blacklisted-token.data-access.js
    │   ├── 📄 educator.data-access.js
    │   ├── 📄 index.js
    │   ├── 📄 mission.data-access.js
    │   ├── 📄 notification.data-access.js
    │   ├── 📄 organization.data-access.js
    │   └── 📄 user.data-access.js
    ├── 📁 dtos
    │   ├── 📄 index.js
    │   ├── 📄 validations.js
    │   └── 📁 schemas
    │       ├── 📄 auth-schema.js
    │       ├── 📄 educator-schema.js
    │       ├── 📄 index.js
    │       ├── 📄 mission-schema.js
    │       ├── 📄 organization-schema.js
    │       └── 📄 utils.js
    ├── 📁 middleware
    │   ├── 📄 global.middleware.js
    │   ├── 📄 index.js
    │   ├── 📄 upload.middleware.js
    │   └── 📄 validate.middleware.js
    ├── 📁 models
    │   ├── 📄 blacklisted-token.model.js
    │   ├── 📄 educator.model.js
    │   ├── 📄 index.js
    │   ├── 📄 mission.model.js
    │   ├── 📄 notification.model.js
    │   ├── 📄 organization.model.js
    │   └── 📄 user.model.js
    ├── 📁 modules
    │   ├── 📄 index.js
    │   ├── 📁 auth
    │   │   ├── 📄 auth.controllers.js
    │   │   ├── 📄 auth.routes.js
    │   │   └── 📄 auth.services.js
    │   ├── 📁 educator
    │   │   ├── 📄 educator.controllers.js
    │   │   ├── 📄 educator.routes.js
    │   │   └── 📄 educator.services.js
    │   ├── 📁 email
    │   │   ├── 📄 email.controllers.js
    │   │   ├── 📄 email.routes.js
    │   │   └── 📄 email.services.js
    │   ├── 📁 health
    │   │   ├── 📄 health.controllers.js
    │   │   ├── 📄 health.routes.js
    │   │   └── 📄 health.services.js
    │   ├── 📁 mission
    │   │   ├── 📄 mission.controllers.js
    │   │   ├── 📄 mission.routes.js
    │   │   └── 📄 mission.services.js
    │   ├── 📁 notification
    │   │   ├── 📄 notification.controllers.js
    │   │   ├── 📄 notification.routes.js
    │   │   └── 📄 notification.services.js
    │   ├── 📁 organization
    │   │   ├── 📄 organization.controllers.js
    │   │   ├── 📄 organization.routes.js
    │   │   └── 📄 organization.services.js
    │   └── 📁 twilio
    │       ├── 📄 twilio.controllers.js
    │       ├── 📄 twilio.routes.js
    │       └── 📄 twilio.services.js
    ├── 📁 routes
    │   └── 📄 index.js
    ├── 📁 server
    │   └── 📄 index.js
    ├── 📁 utils
    │   ├── 📄 email.utils.js
    │   ├── 📄 geo-coding.utils.js
    │   ├── 📄 global.utils.js
    │   ├── 📄 index.js
    │   ├── 📄 token.utils.js
    │   └── 📄 twilio.utils.js
    └── 📁 views
        ├── 📁 reset-password
        │   └── 📄 index.html
        ├── 📁 verification-email
        │   └── 📄 index.html
        └── 📁 verification-notification
            └── 📄 index.html

```

## Core Dependencies

- Express.js (v4.21.2)
- Mongoose (v8.9.6)
- JWT (v9.0.2)
- Bcrypt.js (v2.4.3)
- Joi (v17.13.3)
- Nodemailer (v6.10.0)

## Author

**Sharjeel Faiq**
