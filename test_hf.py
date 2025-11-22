import os
from openai import OpenAI

# Use the URL and Token from server.py
HF_ENDPOINT_URL = "https://nxa044cp82ks3owk.us-east-1.aws.endpoints.huggingface.cloud/v1"
HF_TOKEN = os.getenv("HF_TOKEN")
MODEL = "SukhdevTechsteck/US-Law-v3"

print(f"Testing endpoint: {HF_ENDPOINT_URL}")
print(f"Model: {MODEL}")

client = OpenAI(
    base_url=HF_ENDPOINT_URL,
    api_key=HF_TOKEN
)

try:
    response = client.completions.create(
        model=MODEL,
        prompt="User: What power has Congress assumed regarding elector qualifications?\nAssistant:",
        temperature=0.1,
        max_tokens=50
    )
    print("✅ Success with Completions API!")
    print(response.choices[0].text)
except Exception as e:
    print(f"❌ Error: {e}")
