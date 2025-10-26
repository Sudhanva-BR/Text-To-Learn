import os
os.environ['GEMINI_API_KEY'] = 'AIzaSyBnCJmGGmE9JcVY099IqWrwQmbSTOiZ6kw'  # Replace with your actual key

import google.generativeai as genai

print("=" * 50)
print("Testing Gemini API Connection")
print("=" * 50)

# Configure with your key
api_key = os.environ.get('GEMINI_API_KEY')
print(f"\n1. API Key (first 20 chars): {api_key[:20]}...")

genai.configure(api_key=api_key)

# List models
print("\n2. Listing available models...")
try:
    models = list(genai.list_models())
    print(f"   Found {len(models)} models")
    
    print("\n3. Models that support generateContent:")
    available_models = []
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            print(f"   ✓ {m.name}")
            available_models.append(m.name)
    
    if not available_models:
        print("   ❌ No models available!")
        print("\n   Your API key might not have access to Gemini models.")
        print("   Please create a new API key at: https://aistudio.google.com/app/apikey")
        exit(1)
    
    # Try to generate content with the first available model
    print(f"\n4. Testing generation with {available_models[0]}...")
    model_name = available_models[0].split('/')[-1]  # Extract just the model name
    model = genai.GenerativeModel(model_name)
    
    response = model.generate_content("Say 'Hello World' in exactly two words")
    print(f"   ✓ Response: {response.text}")
    
    print("\n" + "=" * 50)
    print("✅ SUCCESS! Your API key is working!")
    print(f"✅ Use this model name: {model_name}")
    print("=" * 50)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Create a NEW API key at https://aistudio.google.com/app/apikey")
    print("2. Make sure you're signed in with the correct Google account")
    print("3. Try the Gemini web chat first to verify your account works")
    print("4. The API key might take a few minutes to activate")