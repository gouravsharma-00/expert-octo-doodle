<div align="center">

# 🤖 AI Code Debugger

### An intelligent debugging assistant powered by Google Gemini AI

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

**Paste your code → Get AI-powered bug reports, fix suggestions, performance tips, and security analysis — instantly.**

[Live Demo](https://expert-ai-eta.vercel.app) · [Report a Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)
- [Supported Languages](#-supported-languages)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🌟 Overview

**AI Code Debugger** is a full-stack web application that leverages Google's **Gemini 2.5 Flash** model to act as your personal senior developer. It analyzes code snippets for bugs, explains errors in plain English, suggests fixes, and even returns a fully refactored version of your code.

Built with authentication, a VS Code-like Monaco editor, and a personal debug history — it's designed to help developers at every level write cleaner, safer, and more efficient code.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Bug Detection** | Identifies syntax errors, logical flaws, and runtime issues with line-level precision |
| 💡 **AI Fix Suggestions** | Provides clear, actionable fixes with beginner-friendly explanations |
| ⚡ **Performance Analysis** | Highlights inefficiencies and suggests optimizations |
| 🛡️ **Security Scanning** | Detects common vulnerabilities and insecure coding patterns |
| 🔄 **Code Refactoring** | Returns a fully cleaned and optimized version of your code |
| 📝 **Monaco Editor** | VS Code-like editing experience with syntax highlighting |
| 📜 **Debug History** | All past sessions are saved and browsable per user |
| 🔐 **JWT Authentication** | Secure user registration and login with token-based sessions |
| 📱 **Responsive UI** | Fully functional on desktop and mobile browsers |

---

## 🛠️ Tech Stack

### Frontend
- **[React 19](https://react.dev/)** — UI library
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Monaco Editor](https://github.com/microsoft/monaco-editor)** — VS Code editor component
- **[Framer Motion](https://www.framer.com/motion/)** — Animations
- **[React Router v7](https://reactrouter.com/)** — Client-side routing
- **[Axios](https://axios-http.com/)** — HTTP client

### Backend
- **[Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)** — REST API server
- **[MongoDB](https://mongodb.com/) + [Mongoose](https://mongoosejs.com/)** — Database & ODM
- **[JSON Web Tokens](https://jwt.io/)** — Authentication
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Password hashing

### AI
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** — Code analysis engine (`@google/genai`)

---

## 📁 Project Structure

```
expert-octo-doodle/
│
├── frontend/                    # React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BugPanel.jsx     # Displays AI analysis results
│   │   │   ├── CodeEditor.jsx   # Monaco Editor wrapper
│   │   │   ├── Layout.jsx       # Authenticated layout shell
│   │   │   └── Sidebar.jsx      # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Public landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # User dashboard with stats
│   │   │   ├── DebugCode.jsx    # Main code debugging page
│   │   │   ├── History.jsx      # Debug session history
│   │   │   └── Settings.jsx     # User settings
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Route definitions
│   │   └── main.jsx             # App entry point
│   ├── .env                     # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js    # Register & login logic
│   │   ├── debugController.js   # Gemini AI integration
│   │   └── historyController.js # Fetch & delete history
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── DebugHistory.js      # Debug session schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── debugRoutes.js       # /api/debug
│   │   └── historyRoutes.js     # /api/history
│   ├── server.js                # Express app entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** v18 or higher
- **[npm](https://www.npmjs.com/)** v8 or higher
- A **[MongoDB](https://www.mongodb.com/atlas)** connection string (MongoDB Atlas free tier works great)
- A **[Google Gemini API Key](https://aistudio.google.com/app/apikey)**

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/expert-octo-doodle.git
cd expert-octo-doodle
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Variables

**Backend** — create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

**Frontend** — create a `.env` file inside the `frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

> **⚠️ Security Note:** Never commit `.env` files to version control. Both are listed in `.gitignore` by default.

---

### Running the App

**Start the backend server** (from the `backend/` directory):

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

**Start the frontend dev server** (from the `frontend/` directory):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

**Build for production** (from the `frontend/` directory):

```bash
npm run build
```

---

## 📡 API Reference

All protected routes require a `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT token |

**Register / Login Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

---

### Debug

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/debug/analyze` | ✅ Yes | Analyze code with Gemini AI |

**Request Body:**
```json
{
  "code": "function add(a, b) { return a - b; }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "bugs": [
    {
      "line": 1,
      "issue": "Wrong arithmetic operator",
      "explanation": "The function is supposed to add two numbers but uses subtraction (-) instead of addition (+).",
      "fix": "Change `a - b` to `a + b`"
    }
  ],
  "performance": "Looks good",
  "security": "No major issues detected",
  "refactored_code": "function add(a, b) {\n  return a + b;\n}"
}
```

---

### History

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/history` | ✅ Yes | Get all debug sessions for the logged-in user |
| `DELETE` | `/api/history/:id` | ✅ Yes | Delete a specific debug session |

---

## 🧠 How It Works

```
User pastes code in Monaco Editor
          │
          ▼
Selects language & clicks "Analyze Code"
          │
          ▼
Frontend sends POST /api/debug/analyze (with JWT)
          │
          ▼
Backend verifies JWT → calls Gemini 2.5 Flash API
          │
          ▼
Gemini returns structured JSON with:
  ├── Bug list (line, issue, explanation, fix)
  ├── Performance suggestions
  ├── Security analysis
  └── Refactored code
          │
          ▼
Result saved to MongoDB (DebugHistory)
          │
          ▼
BugPanel renders results in the UI
```

---

## 💻 Supported Languages

| Language | Editor Mode |
|----------|-------------|
| JavaScript | `javascript` |
| Python | `python` |
| Java | `java` |
| C++ | `cpp` |
| C# | `cs` |

> More languages can be added by extending the `<select>` in `DebugCode.jsx` — Gemini handles most popular languages out of the box.

---

## 📸 Screenshots

> Add screenshots of your app here. Recommended sections to capture:
> - Landing page
> - Debug Code page (with results)
> - Dashboard with stats
> - History page

---

## 🔮 Future Improvements

- [ ] Code execution sandbox (run code safely in-browser)
- [ ] Inline error highlighting directly in the Monaco Editor
- [ ] Chat-based iterative debugging assistant
- [ ] GitHub Gist / repository import
- [ ] Export analysis as PDF or Markdown
- [ ] Redis caching for repeated code snippets
- [ ] Support for more languages (Go, Rust, TypeScript, PHP)
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Contributions are always welcome! Here's how:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add some feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** on GitHub

Please follow existing code style and add comments where necessary.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

If this project helped you, please give it a ⭐ on GitHub — it means a lot!

</div>
