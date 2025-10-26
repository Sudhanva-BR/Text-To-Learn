import os
os.environ['GEMINI_API_KEY'] = 'AIzaSyCQ6bq7RMWeyiQbDdFcFRP84pMWx-naWR8'

import google.generativeai as genai

print("=" * 70)
print("Checking Available Gemini Models")
print("=" * 70)

# Configure with your key
api_key = os.environ.get('GEMINI_API_KEY')
print(f"\n1. API Key (first 20 chars): {api_key[:20]}...")

genai.configure(api_key=api_key)

# List all available models
print("\n2. Fetching available models...")
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
    else:
        # Try to use the first available model
        print(f"\n4. Testing with model: {available_models[0]}")
        model_name = available_models[0].split('/')[-1]  # Extract just the model name
        model = genai.GenerativeModel(model_name)
        
        response = model.generate_content("Say 'Hello' in one word")
        print(f"   ✓ Response: {response.text}")
        
        print("\n" + "=" * 70)
        print("✅ SUCCESS! Use this model in your code:", model_name)
        print("=" * 70)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
