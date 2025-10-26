import google.generativeai as genai
from django.conf import settings
import json
import re
import os

# Check if API key is available
api_key = settings.GEMINI_API_KEY
if not api_key:
    print("WARNING: GEMINI_API_KEY is not set in settings!")
    api_key = os.getenv('GEMINI_API_KEY', '')

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in settings or environment variables!")
else:
    print(f"Gemini API key found: {api_key[:20]}...")
    # Configure Gemini with the API key
    genai.configure(api_key=api_key)

class AIService:
    def __init__(self):
        # Initialize model when service is created
        if api_key:
            try:
                # Try gemini-2.0-flash-exp (latest model)
                self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
                print("Gemini model initialized successfully with gemini-2.0-flash-exp")
            except Exception as e:
                print(f"Error initializing gemini-2.0-flash-exp: {str(e)}")
                try:
                    # Fallback to gemini-1.5-flash
                    self.model = genai.GenerativeModel('gemini-1.5-flash')
                    print("Gemini model initialized successfully with gemini-1.5-flash")
                except Exception as e2:
                    print(f"Error initializing gemini-1.5-flash: {str(e2)}")
                    self.model = None
        else:
            self.model = None
    
    def generate_course_outline(self, topic):
        if not api_key or not self.model:
            raise Exception("Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.")
        
        prompt = f"""Create a course outline for: "{topic}"

Return ONLY valid JSON (no markdown formatting, no code blocks):
{{
  "title": "Course Title",
  "description": "Course description",
  "tags": ["tag1", "tag2"],
  "modules": [
    {{"title": "Module 1", "lessons": ["Lesson 1", "Lesson 2"]}}
  ]
}}"""
        
        try:
            print(f"Calling Gemini API")
            response = self.model.generate_content(prompt)
            print(f"Gemini API response received")
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            raise Exception(f"Gemini API failed: {str(e)}")
    
    def generate_lesson_content(self, course_title, module_title, lesson_title):
        if not api_key or not self.model:
            raise Exception("Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.")
        
        prompt = f"""Create lesson content for "{lesson_title}"

Return ONLY valid JSON (no markdown formatting, no code blocks):
{{
  "title": "{lesson_title}",
  "objectives": ["obj1", "obj2"],
  "content": [
    {{"type": "heading", "text": "Title"}},
    {{"type": "paragraph", "text": "Content"}}
  ]
}}"""
        
        try:
            print(f"Generating lesson content for: {lesson_title}")
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            raise Exception(f"Gemini API failed: {str(e)}")
    
    def _parse_json_response(self, text):
        print(f"Parsing JSON response (length: {len(text)})")
        cleaned = re.sub(r'```json\s*', '', text)
        cleaned = re.sub(r'```\s*', '', cleaned).strip()
        try:
            parsed = json.loads(cleaned)
            print(f"Successfully parsed JSON")
            return parsed
        except Exception as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Cleaned text: {cleaned[:200]}...")
            match = re.search(r'\{.*\}', cleaned, re.DOTALL)
            if match:
                return json.loads(match.group())
            raise Exception(f"Invalid JSON: {str(e)}")

ai_service = AIService()