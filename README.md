# Cold Mail Generator

A full-stack AI-powered cold email generation platform that helps users create personalized outreach messages for job applications and recruiter outreach.

Live demo: https://cold-mail-generator-hwc8.vercel.app/

## Overview

This project combines a React + Vite frontend with an Express + MongoDB backend to provide:

- User login and signup flow
- OTP email verification
- Secure session management with JWT cookies
- AI-generated email, LinkedIn DM, and follow-up email content
- Email history tracking per user
- Chat-style homepage with history sidebar
- Seamless deployment-ready structure for Vercel

## Tech Stack

### Frontend
- React 19
- Vite
- JavaScript
- Axios
- React Hot Toast
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Cookie-based session handling
- Nodemailer for email verification
- Groq AI API integration for cold email generation

## Project Structure

```bash
ColdMailGenerator/
├── client/
│   └── ai-cold-mail-generator/
│       ├── public/
│       ├── src/
│       ├── .env.example
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── vercel.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── api/
│   ├── package.json
│   ├── server.js
│   └── vercel.json
│
├── architecture.png
├── README.md
└── .gitignore
```

## Features

### Authentication
- Sign up with name, email, and password
- Email verification using OTP
- Login/logout flow
- Protected routes using JWT middleware
- Cookie-based session persistence

### AI Content Generation
- Generate cold email subject line
- Create personalized email body
- Generate LinkedIn DM message
- Generate follow-up email
- Save generated outputs under user history

### History Management
- View all generated email histories
- Select a specific history item
- Reuse past generated content
- Start a new chat session

### UX
- Sidebar-based dashboard
- Chat-like messaging experience
- User-friendly validation and toast notifications
- Responsive design for desktop and smaller screens

## Environment Variables

### Frontend
Create a `.env` file inside `client/ai-cold-mail-generator`:

```env
VITE_API_URL=https://cold-mail-generator-orcin.vercel.app/api
```

### Backend
Create a `.env` file inside `server`:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=https://cold-mail-generator-hwc8.vercel.app
AI_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
NODE_ENV=production
```

## Local Development

### 1. Install frontend dependencies

```bash
cd client/ai-cold-mail-generator
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Start backend

```bash
cd server
npm run dev
```

### 4. Start frontend

```bash
cd client/ai-cold-mail-generator
npm run dev
```

The frontend will run on:

- http://localhost:5173

The backend will run on:

- http://localhost:3000

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/logout`

### AI
- `POST /api/ai/generate-email`
- `GET /api/ai/history`
- `GET /api/ai/history/:id`

## Deployment

This project is designed to be deployed on Vercel.

### Frontend
- Project root: `client/ai-cold-mail-generator`
- Framework: Vite

### Backend
- Project root: `server`
- Runtime: Node.js server

### Deployment notes
- Use a separate Vercel project for the frontend and backend.
- Set backend environment variables in Vercel project settings.
- Use the backend deployed URL in the frontend `VITE_API_URL` variable.
- Add correct rewrite rules for SPA routing on the frontend.

## Notes

- This project uses MongoDB Atlas for persistent user and history data.
- AI generation is powered by the Groq API.
- Email verification uses SMTP via Nodemailer.
- Secure cookies are configured for cross-origin frontend/backend communication in production.

## License

This project is for demonstration and educational use.

## Author

Kanishka
