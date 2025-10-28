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
        
        prompt = f"""Create detailed educational content for "{lesson_title}" in the course "{course_title}" under module "{module_title}".

The content should be comprehensive and engaging. Include:
- Clear headings for each section
- Detailed explanations
- Examples and practical insights
- Lists where helpful
- Code examples if relevant

Also, add at least ONE video suggestion block using this format:
{{"type": "video", "query": "relevant search term for YouTube"}}

And add at least ONE quiz section using this format:
{{"type": "quiz", "questions": [
  {{
    "question": "What is the main concept?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Explanation of why this is correct"
  }}
]}}

Return ONLY valid JSON (no markdown formatting, no code blocks):
{{
  "title": "{lesson_title}",
  "objectives": ["Learning objective 1", "Learning objective 2", "Learning objective 3"],
  "content": [
    {{"type": "heading", "text": "Introduction"}},
    {{"type": "paragraph", "text": "Detailed content explaining the topic..."}},
    {{"type": "list", "items": ["Point 1", "Point 2", "Point 3"]}},
    {{"type": "video", "query": "relevant YouTube search term"}},
    {{"type": "heading", "text": "Key Concepts"}},
    {{"type": "paragraph", "text": "More detailed content..."}},
    {{"type": "quiz", "questions": [
      {{
        "question": "What is the main concept?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Explanation of why this is correct"
      }}
    ]}}
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
        
        # Remove markdown code blocks
        cleaned = re.sub(r'```json\s*', '', text)
        cleaned = re.sub(r'```\s*', '', cleaned).strip()
        
        # Try to find JSON object in the text
        json_match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if json_match:
            cleaned = json_match.group()
        
        try:
            parsed = json.loads(cleaned)
            print(f"Successfully parsed JSON")
            return parsed
        except Exception as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Cleaned text: {cleaned[:500]}...")
            
            # Try to fix common JSON issues
            try:
                # Fix trailing commas
                cleaned = re.sub(r',\s*}', '}', cleaned)
                cleaned = re.sub(r',\s*]', ']', cleaned)
                parsed = json.loads(cleaned)
                print(f"Successfully parsed JSON after fixing trailing commas")
                return parsed
            except Exception as e2:
                print(f"Still failed after fixing: {str(e2)}")
                raise Exception(f"Invalid JSON: {str(e)}")

ai_service = AIService()