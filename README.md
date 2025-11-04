🧠 Text-to-Learn — AI-Powered Course Generator

Transform any topic into a complete interactive course — with AI-generated modules, lessons, videos, and Hinglish audio.

🚀 Overview

Text-to-Learn is a full-stack AI-powered web application that turns any topic prompt into a structured online course.
Just enter a topic like “React Basics” or “Machine Learning Fundamentals”, and the app generates:

📘 A detailed course outline (modules + lessons)

🎯 Learning objectives and key concepts

🎥 YouTube video recommendations

🗣️ Hinglish audio narration for each lesson

📄 Downloadable PDF content

🌐 Live Demo

🔗 Frontend: text-to-learn-sandy.vercel.app

🔗 Backend: text-to-learn-klnl.onrender.com

✨ Core Features
Feature	Description
🤖 AI Course Generator	Generates structured courses using the Gemini API.
🗣️ Hinglish Audio Lessons	Uses Text-to-Speech API for natural Hinglish narration.
🎥 YouTube Integration	Embeds educational videos automatically.
📄 PDF Export	Save any lesson as a well-formatted PDF.
🔐 Auth0 Authentication	Secure login and protected access to user courses.
💾 SQLite Database	Lightweight and fast backend database using Django ORM.
🧠 Tech Stack
🖥️ Frontend

⚛️ React (Vite)

🎨 Chakra UI

🧭 React Router v6

📦 Axios

🧾 html2canvas + jsPDF (PDF export)

🐍 Backend

Django + Django REST Framework

Gemini API (Google)

Text-to-Speech API

YouTube Data API v3

SQLite (Django ORM)

Auth0 Authentication

☁️ Deployment

Frontend → Vercel

Backend → Render

Database → SQLite

⚙️ Environment Setup
🔧 Frontend (.env)
VITE_API_URL=https://text-to-learn-klnl.onrender.com/api/

🔧 Backend (.env)
GEMINI_API_KEY=AIzaSyCQ6bq7RMWeyiQbDdFcFRP84pMWx-naWR8
YOUTUBE_API_KEY= AIzaSyBZ5putxSB6T89nWahrAY8y9Omcfesky_o
OPENAI_API_KEY=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
SECRET_KEY=
DEBUG=True

🔄 How It Works

✍️ User inputs a topic

⚙️ Backend (Gemini API) generates:

Course outline (modules + lessons)

Lesson content, objectives, examples, and quizzes

🎥 YouTube API fetches related videos

🗣️ TTS API creates Hinglish audio lessons

💾 User can view, listen, or download lessons as PDFs

🧰 Future Roadmap

 ✅ Lesson progress tracking

 🌐 Multi-language support

 💬 AI-powered personal tutor chat

 🧩 Interactive quizzes and grading

 🤝 Collaborative course creation

🧑‍💻 Author

Sudhanva B.R
🔗 GitHub

📧 Open for collaborations on AI x Education projects!

📜 License

MIT License © 2025 — Sudhanva B.R
