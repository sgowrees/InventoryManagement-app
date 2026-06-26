# Inventory Management Application Backend

A robust and secure backend API for an Inventory Management System, built with Node.js, Express, and MongoDB. This application efficiently handles user authentication, product management, and integrates with Cloudinary for image storage, providing a solid foundation for a comprehensive inventory solution.

---

## 🚀 Key Features & Benefits

*   **User Authentication & Authorization**: Secure registration, login, logout, and password reset functionalities. Users are authenticated using JSON Web Tokens (JWT), ensuring secure access to protected routes.
*   **Comprehensive Product Management (CRUD)**: Full Create, Read, Update, and Delete (CRUD) operations for managing inventory products.
*   **Image Uploads**: Seamless integration with Cloudinary for efficient and scalable storage and retrieval of product images.
*   **Secure Password Hashing**: Utilizes `bcryptjs` to securely hash and store user passwords, protecting sensitive user data.
*   **Centralized Error Handling**: Implements middleware for consistent and user-friendly error responses across the API.
*   **RESTful API Design**: Follows REST principles for clear, stateless communication.

---

## 🛠️ Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js**: A JavaScript runtime environment. (LTS version recommended)
*   **npm** (Node Package Manager) or **Yarn**: For managing project dependencies.
*   **MongoDB**: A NoSQL database. You can use a local instance or a cloud-hosted service like MongoDB Atlas.
*   **Cloudinary Account**: Required for storing and managing product images. Sign up at [Cloudinary](https://cloudinary.com/).

---

## ⚙️ Installation & Setup Instructions

Follow these steps to get your development environment up and running:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sgowrees/InventoryManagement-app.git
    cd InventoryManagement-app/backend
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```

3.  **Create a `.env` file:**
    In the `backend` directory, create a new file named `.env` and add the following environment variables. Replace the placeholder values with your actual credentials and settings.

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=a_very_secret_key_for_jwt_signing

    # Frontend URL for CORS and email links
    FRONTEND_URL=http://localhost:3000

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Email Configuration (for password reset functionality)
    # Example for Gmail:
    # EMAIL_HOST=smtp.gmail.com
    # EMAIL_PORT=587
    # EMAIL_USER=your_email@gmail.com
    # EMAIL_PASS=your_gmail_app_password
    # (Note: For Gmail, you might need to generate an App Password if 2FA is enabled)
    ```
    *   **`MONGO_URI`**: Obtain this from your MongoDB Atlas dashboard or your local MongoDB setup.
    *   **Cloudinary Credentials**: Find these on your Cloudinary dashboard.
    *   **Email Configuration**: Configure these for sending password reset emails. The example uses Gmail, but any SMTP server can be used.

4.  **Start the server:**
    ```bash
    npm start
    # or using node
    # node server.js
    ```
    The server will start on the specified `PORT` (default is `5000`). You should see a message indicating the server is running and connected to MongoDB.

---

## 📖 Usage Examples & API Documentation

The Inventory Management API exposes a set of RESTful endpoints for managing users and products. All endpoints are prefixed with `/api`.

### User Authentication & Management (`/api/users`)

| Endpoint                               | Method  | Description                                        | Authentication |
| :------------------------------------- | :------ | :------------------------------------------------- | :------------- |
| `/api/users/register`                  | `POST`  | Register a new user                                | None           |
| `/api/users/login`                     | `POST`  | Log in an existing user and receive a JWT cookie   | None           |
| `/api/users/logout`                    | `GET`   | Log out the current user (clears cookie)           | Token          |
| `/api/users/getuser`                   | `GET`   | Get details of the logged-in user                  | Token          |
| `/api/users/updateuser`                | `PATCH` | Update logged-in user's profile                    | Token          |
| `/api/users/changepassword`            | `PATCH` | Change the logged-in user's password               | Token          |
| `/api/users/forgotpassword`            | `POST`  | Request a password reset link (sends email)        | None           |
| `/api/users/resetpassword/:resetToken` | `PUT`   | Reset password using a valid reset token           | None           |

**Example: Register a New User**

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123"
}
```

### Product Management (`/api/products`)

| Endpoint            | Method  | Description                                                    | Authentication |
| :------------------ | :------ | :------------------------------------------------------------- | :------------- |
| `/api/products`     | `POST`  | Create a new product. Requires `multipart/form-data` for image upload. | Token          |
| `/api/products`     | `GET`   | Get all products belonging to the logged-in user.              | Token          |
| `/api/products/:id` | `GET`   | Get a single product by its ID.                                | Token          |
| `/api/products/:id` | `PATCH` | Update an existing product by ID. Supports `multipart/form-data` for image update. | Token          |
| `/api/products/:id` | `DELETE`| Delete a product by ID.                                        | Token          |

**Example: Create a New Product (using `multipart/form-data`)**

```http
POST /api/products
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

# Use a tool like Postman, Insomnia, or your frontend to send this request.
# Fields should be sent as form-data:
#   name: Gaming Keyboard
#   category: Peripherals
#   quantity: 50
#   price: 79.99
#   description: Mechanical keyboard with RGB lighting.
#   image: [file upload, e.g., keyboard.jpg]
```

---

## 🛠️ Configuration Options

The application relies on environment variables for sensitive data and configurable settings. These are primarily defined in the `.env` file (see [Installation & Setup Instructions](#installation--setup-instructions)).

*   **`PORT`**: The network port on which the Node.js server will listen (e.g., `5000`).
*   **`MONGO_URI`**: The connection string for your MongoDB database.
*   **`JWT_SECRET`**: A strong, random string used as a secret key for signing JSON Web Tokens.
*   **`FRONTEND_URL`**: The base URL of your frontend client application, used for CORS configuration and generating links (e.g., for password reset emails).
*   **`CLOUDINARY_CLOUD_NAME`**, **`CLOUDINARY_API_KEY`**, **`CLOUDINARY_API_SECRET`**: Your credentials for accessing the Cloudinary image management service.
*   **`EMAIL_HOST`**, **`EMAIL_PORT`**, **`EMAIL_USER`**, **`EMAIL_PASS`**: SMTP server configuration for sending emails, used for features like password reset.

---

## 🤝 Contributing Guidelines

We welcome contributions to the Inventory Management Application! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository to your local development machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/InventoryManagement-app.git
    cd InventoryManagement-app/backend
    ```
3.  **Create a new branch** for your feature or bug fix.
    ```bash
    git checkout -b feature/your-feature-name
    ```
4.  **Make your changes**, ensuring they adhere to the project's coding style and best practices.
5.  **Commit your changes** with clear, concise, and descriptive commit messages.
    ```bash
    git commit -m "feat: Implement product search functionality"
    ```
6.  **Push your branch** to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
7.  **Open a Pull Request** from your forked repository to the `main` branch of the original `InventoryManagement-app` repository. Provide a detailed description of your changes and why they are beneficial.

---

## 📄 License Information

This project currently **does not have an explicit license specified**.

We recommend the repository owner to choose and add an appropriate open-source license (e.g., MIT, Apache 2.0, GPL) to clarify the terms under which this software can be used, modified, and distributed.

---

## 🙏 Acknowledgments

*   Special thanks to the developers of Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Cloudinary, and all other open-source libraries that contribute to the functionality and stability of this project.
*   Inspired by common practices in building robust and scalable backend APIs.
