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
| `POST` | `/api/auth/signup`         | Registers a new user account.                              |
| `POST` | `/api/auth/signin`         | Authenticates a user and provides a session token.         |
| `POST` | `/api/auth/reset-password` | Resets the password against the provided email reset link. |

### Email Endpoints 📧

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| `GET`  | `/api/check-verification-token/:verificationToken` | Verifies a user's email address. |
| `POST` | `/api/send-verification-token`         | Sends a verification email.      |

## OTP Endpoints

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| `POST` | `/api/otp/send`   | Sends an OTP to the user email.    |
| `POST` | `/api/otp/verify` | Verifies the OTP send by the user. |

### User Endpoints 👤

| Method   | Endpoint           | Description                      |
| -------- | ------------------ | -------------------------------- |
| `GET`    | `/api/user/`    | Retrieves all users.             |
| `GET`    | `/api/user/:id` | Retrieves a specific user by ID. |
| `PATCH`  | `/api/user/:id` | Updates a specific user by ID.   |
| `DELETE` | `/api/user/:id` | Deletes a specific user by ID.   |

## Author ✍️

**Sharjeel Faiq**
# romulus-backend
