## Scripts 🐜

The `package.json` file contains several useful scripts:

- `npm start`: Starts the production server.
- `npm run dev`: Starts the development server with Nodemon for automatic restarts.
- `npm run seed`: Seeds the database with initial data using the script.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run lint:fix`: Runs ESLint and fixes issues automatically.
- `npm run format`: Formats the code using Prettier.

## API Endpoints 📌

See the [API Endpoints Documentation](./docs/swagger) for a comprehensive list of endpoints, their descriptions, and required parameters. Set-up the project and access the API documentation at `http://localhost:5000/api-docs`.

Here is a quick overview:

### Auth Endpoints 🔑

| Method | Endpoint                 | Description                                                |
| ------ | ------------------------ | ---------------------------------------------------------- |
| `POST` | `/api/v1/signup`         | Registers a new user account.                              |
| `POST` | `/api/v1/signin`         | Authenticates a user and provides a session token.         |
| `POST` | `/api/v1/reset-password` | Resets the password against the provided email reset link. |

### Email Endpoints 📧

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| `GET`  | `/api/v1/verify-email/:verificationToken` | Verifies a user's email address. |
| `POST` | `/api/v1/send-verification-email`         | Sends a verification email.      |

## OTP Endpoints

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| `POST` | `/api/v1/otp/send`   | Sends an OTP to the user email.    |
| `POST` | `/api/v1/otp/verify` | Verifies the OTP send by the user. |

### User Endpoints 👤

| Method   | Endpoint           | Description                      |
| -------- | ------------------ | -------------------------------- |
| `GET`    | `/api/v1/user/`    | Retrieves all users.             |
| `GET`    | `/api/v1/user/:id` | Retrieves a specific user by ID. |
| `PATCH`  | `/api/v1/user/:id` | Updates a specific user by ID.   |
| `DELETE` | `/api/v1/user/:id` | Deletes a specific user by ID.   |

## Author ✍️

**Sharjeel Faiq**
# romulus-backend
