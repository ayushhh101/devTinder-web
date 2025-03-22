# DevTinder Web

## 🚀 Overview
DevTinder is a platform designed to connect developers based on their skills, interests, and projects. It provides a swipe-based interface to match developers with potential collaborators, mentors, or job opportunities.

This repository contains the **frontend** of DevTinder, built using modern web technologies, and connects to the backend hosted at [DevTinder-BE](https://github.com/ayushhh101/DevTinder-BE).

## 🛠 Tech Stack
- **Frontend:** React.js, Material-UI, Redux Toolkit
- **Backend:** [DevTinder-BE](https://github.com/ayushhh101/DevTinder-BE) (Node.js, Express, MongoDB, JWT Authentication)
- **State Management:** Redux Toolkit
- **Styling:** Material-UI (MUI)
- **Authentication:** JWT-based authentication

## 🌟 Features
- 🔥 Swipe-based matching for developers
- 🛠 Skill-based filtering and search
- 💬 Real-time chat with matches
- 🎯 User profile creation and editing
- 🛡 Secure authentication and authorization
- 📈 Dashboard with insights and analytics

## 📦 Installation & Setup
To run the project locally, follow these steps:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ayushhh101/devTinder-web.git
cd devTinder-web
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```env
REACT_APP_API_BASE_URL=<your-backend-url>
```

### 4️⃣ Start the Development Server
```bash
npm start
```
This will launch the frontend at `http://localhost:3000/`.

## 🖥 Backend Connection
Ensure that the [DevTinder-BE](https://github.com/ayushhh101/DevTinder-BE) backend is running and properly configured. Update `REACT_APP_API_BASE_URL` in `.env` to point to the backend server.

## 🚀 Deployment
To deploy the application:

### Build the Project
```bash
npm run build
```
The optimized production build will be available in the `build/` directory. You can deploy it to platforms like **Vercel, Netlify, or AWS S3**.

## 🤝 Contributing
We welcome contributions! Feel free to **fork** the repository, create a branch, and submit a pull request.

## 📩 Contact
For queries or collaborations, reach out to **Ayushhh101** via GitHub or email.

---
💡 *DevTinder - Helping developers connect and collaborate!*
