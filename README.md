#BudgetBuddy

This is a web application designed to help users manage their daily expenses. It provides a simple and intuitive interface where users can add, view, and delete expenses, as well as subscribe to premium features via a secure payment gateway.

User Registration and Login:

Users can sign up and log in securely.
Passwords are hashed, and authentication is managed with JWT (JSON Web Tokens).
Expense Management:

Users can add expenses, categorize them, and delete them when necessary.
Easy-to-use dashboard interface for tracking and managing expenses.
Subscription System:

Users can subscribe to premium features using Razorpay as the payment gateway.
Manage subscriptions, view payment history, and access exclusive features.
Password Reset:

If a user forgets their password, they can reset it through an email-based token system.
A secure token is generated using JWT, allowing the user to create a new password.
Secure API with JWT:

JWT is used for both authentication and protecting user data.
All routes related to sensitive data are secured by middleware that validates the user's token.

