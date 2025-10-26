# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the `backend/texttolearn/` directory with the following content:

```
# Django Settings
SECRET_KEY=django-insecure-cfi-s90)vvasw8+*btldojezo@=7057v&f91i=u0qesxu%v5&p
DEBUG=True

# AI API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=
YOUTUBE_API_KEY=
```

## Steps to Fix the Course Generation Issue

1. **Get an OpenAI API Key:**

   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Create a new API key

2. **Create the .env file:**

   - Navigate to `backend/texttolearn/` directory
   - Create a new file named `.env`
   - Copy the template above and replace `your_openai_api_key_here` with your actual API key

3. **Restart the Django server:**

   - Stop the current server (Ctrl+C)
   - Run: `python manage.py runserver`

4. **Try generating a course again**

## Troubleshooting

If you still see errors after setting up the API key, check:

- The API key is correctly set in the `.env` file
- The `.env` file is in the correct location: `backend/texttolearn/.env`
- The Django server has been restarted after creating the `.env` file
- You have sufficient API credits on your OpenAI account
