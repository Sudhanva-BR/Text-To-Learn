🧠 Text-to-Learn: AI-Powered Course Generator

Transform any topic into a full, structured course — powered by AI.

🚀 Overview

Text-to-Learn is an AI-powered full-stack web application that generates structured online courses from any topic prompt.
Enter a topic like “React Basics” or “Machine Learning Fundamentals” — and the app creates a full course with modules, lessons, objectives, videos, and Hinglish audio explanations.

🧩 Live Demo

🔗 Frontend: https://text-to-learn-sandy.vercel.app/

🖥️ Backend: https://text-to-learn-klnl.onrender.com/


✨ Key Features
Feature	Description
🧾 AI Course Generator	Generates a full course (modules + lessons) using Gemini API.
🗣️ Hinglish Audio Lessons	Converts lessons into natural-sounding Hinglish speech.
🎥 YouTube Integration	Embeds educational videos automatically based on lesson content.
📄 Download as PDF	Save any lesson as a well-formatted PDF.
🔐 Secure Authentication	Uses Auth0 for user login and access control.
💾 SQLite Database	Lightweight and fast relational database powered by Django ORM.
🧠 Tech Stack
Frontend

⚛️ React (Vite)

🎨 Chakra UI

🧭 React Router v6

📦 Axios

🧾 html2canvas + jsPDF

Backend

🐍 Django + Django REST Framework

🤖 Gemini API (Google) for AI text generation

🗣️ Text-to-Speech API for Hinglish audio

🎬 YouTube Data API v3

🗃️ SQLite (default Django database)

🔐 Auth0 Authentication

🌐 Hosted on Render

Deployment

Frontend → Vercel

Backend → Render

Database → SQLite (Django default)

⚙️ Environment Setup
🧩 Frontend (.env)
VITE_API_URL=https://text-to-learn-klnl.onrender.com/api/

⚙️ Backend (.env)
GEMINI_API_KEY=<your-gemini-api-key>
YOUTUBE_API_KEY=<your-youtube-api-key>
SECRET_KEY=<django-secret-key>
DEBUG=True

🧭 Project Architecture
text-to-learn/
├── backend/
│   ├── api/                # Django REST API endpoints
│   ├── models.py           # Course, Module, Lesson models (SQLite)
│   ├── views.py            # Gemini + TTS + YouTube integrations
│   ├── serializers.py      # Data serialization for API responses
│   ├── urls.py             # REST routes
│   └── settings.py         # Django + API configurations
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Home, Course, Lesson views
│   │   ├── context/        # Auth0 context provider
│   │   ├── utils/          # API helpers and request handlers
│   │   └── App.jsx         # Routing setup
│   └── index.css
│
└── README.md

🔄 Workflow

User enters a topic prompt

Backend (Gemini API) generates a course outline → modules + lessons

For each lesson:

AI generates text content, objectives, examples, and quizzes

YouTube API finds top videos

TTS API generates Hinglish narration

Frontend displays the structured lessons

User can download lessons as PDFs

🧰 Future Roadmap

✅ Lesson progress tracking

✅ Multi-language support

✅ AI-powered personal tutor chat

✅ Interactive quizzes and grading

✅ Collaborative course creation

📜 License

MIT License © 2025 Sudhanva B.R
