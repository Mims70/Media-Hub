# Media Hub

Media Hub is a web application built with Node.js, Express, MongoDB, and other technologies. It provides features for user authentication, including sign up, login, logout, and password reset functionalities.

## Features

- **Sign Up**: Users can create a new account by providing their name, email, and password.
- **Verify code**: Users must verify their email address with their 4-digit code that will be sent to their email address.
- **Login**: Registered users can log in to their accounts using their email and password.
- **Logout**: Logged-in users can log out of their accounts, terminating their session.
- **Password Reset**: Users can request a password reset if they forget their password. They will receive an email with a password reset code.
- **Token-based Authentication**: The application uses JWT (JSON Web Tokens) for user authentication and authorization.
- **User Model**: The user model stores user data in the MongoDB database, including name, email, hashed password, and login status.
- **Token Model**: The token model stores tokens associated with password reset requests.
- **Middleware**: Middleware functions are used for authentication and error handling.
- **Frontend Integration**: This application can be integrated with frontend frameworks like React, Angular, or Vue.js for a complete user interface.


## Usage

1. Sign Up: Navigate to the sign-up page and provide your name, email, and password to create a new account.
2. Login: After signing up, log in to your account using your email and password.
3. Logout: Click on the logout button to log out of your account.
4. Password Reset: If you forget your password, use the password reset functionality by providing your email address. You will receive an email with instructions to reset your password.

## URL 
https://data-be-13-4.onrender.com/

## Endpoints
- `POST api/v1/auth/signup`
- `POST api/v1/auth/verifyCode`
- `POST api/v1/auth/login`
- `POST api/v1/auth/requestResetPassword`
- `POST api/v1/auth/verifyResetCode`
- `POST api/v1/auth/resetPassword`
- `POST api/v1/auth/logout`

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or create a pull request on GitHub.