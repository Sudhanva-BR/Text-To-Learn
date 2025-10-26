import os
import sys

# Add the texttolearn directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'texttolearn'))

os.environ['GEMINI_API_KEY'] = 'AIzaSyCQ6bq7RMWeyiQbDdFcFRP84pMWx-naWR8'

import google.generativeai as genai

print("=" * 50)
print("Testing Gemini API with New Key")
print("=" * 50)

# Configure with your key
api_key = os.environ.get('GEMINI_API_KEY')
print(f"\n1. API Key (first 20 chars): {api_key[:20]}...")

genai.configure(api_key=api_key)

# Use Gemini 1.5 Flash model
print("\n2. Using model: gemini-1.5-flash")
model = genai.GenerativeModel('gemini-1.5-flash')

try:
    # Test with simple prompt
    print("\n3. Testing content generation...")
    response = model.generate_content("Say 'Hello World' in exactly two words")
    print(f"   ✓ Response: {response.text}")
    
    print("\n" + "=" * 50)
    print("✅ SUCCESS! Your Gemini API key is working!")
    print("=" * 50)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Verify your API key is correct")
    print("2. Check if the API key has proper permissions")
    print("3. Make sure you have internet connection")
