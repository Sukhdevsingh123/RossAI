
import os
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline import answer_query
from vector_database import load_any, create_chunks, store_in_pinecone
import uvicorn
from pydantic import BaseModel
import json
from openai import OpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = "pdfs"
os.makedirs(uploads_dir, exist_ok=True)
HF_ENDPOINT_URL = "https://nxa044cp82ks3owk.us-east-1.aws.endpoints.huggingface.cloud/v1"
HF_TOKEN = os.getenv("HF_TOKEN")

client = OpenAI(
    base_url=HF_ENDPOINT_URL,
    api_key=HF_TOKEN
)

# ---------- Upload API ----------
@app.post("/api/upload")
async def upload(files: List[UploadFile] = File(...)):
    processed = []
    try:
        for uf in files:
            path = os.path.join(uploads_dir, uf.filename)
            with open(path, "wb") as f:
                f.write(await uf.read())
            docs = load_any(path)
            chunks = create_chunks(docs)
            store_in_pinecone(chunks)
            processed.append(uf.filename)
        return {"status": "success", "message": f"Indexed: {processed}", "files": processed}
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

# ---------- Files API ----------
@app.get("/api/files")
async def list_files():
    try:
        files = sorted(os.listdir(uploads_dir))
        return {"status": "success", "files": files}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.delete("/api/files/{filename}")
async def delete_file(filename: str):
    try:
        path = os.path.join(uploads_dir, filename)
        if os.path.exists(path):
            os.remove(path)
            return {"status": "success", "message": f"{filename} deleted."}
        return {"status": "error", "message": "File not found."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ---------- Prompts API ----------
PROMPTS_PATH = os.path.join("prompts", "prompts.json")
os.makedirs("prompts", exist_ok=True)
if not os.path.exists(PROMPTS_PATH):
    with open(PROMPTS_PATH, "w") as f:
        json.dump({"shared": {}, "private": {}}, f)

def _read_prompts():
    with open(PROMPTS_PATH, "r") as f:
        return json.load(f)

def _write_prompts(data):
    with open(PROMPTS_PATH, "w") as f:
        json.dump(data, f, indent=2)

class PromptCreate(BaseModel):
    key: str
    template: str
    scope: str = "shared"

@app.get("/api/prompts")
async def get_prompts():
    return _read_prompts()

@app.post("/api/prompts")
async def add_prompt(p: PromptCreate):
    data = _read_prompts()
    data.setdefault(p.scope, {})
    data[p.scope][p.key] = p.template
    _write_prompts(data)
    return {"status": "success"}

@app.delete("/api/prompts/{scope}/{key}")
async def delete_prompt(scope: str, key: str):
    data = _read_prompts()
    if scope in data and key in data[scope]:
        del data[scope][key]
        _write_prompts(data)
        return {"status": "success"}
    return {"status": "error", "message": "Not found"}

# ---------- Ask API ----------
class AskRequest(BaseModel):
    question: str
    task: str = "qa"
    file: Optional[str] = None
    top_k: int = 6
    promptKey: Optional[str] = None
    customPrompt: Optional[str] = None
    model: str = "SukhdevTechsteck/US-Law-v3"  # ✅ new field

@app.post("/api/ask")
async def ask(req: AskRequest):
    try:
        result = answer_query(
            question=req.question,
            task=req.task,
            file=req.file,
            top_k=req.top_k,
            prompt_key=req.promptKey,
            custom_prompt=req.customPrompt,
            model=req.model,
        )
        return result
    except Exception as e:
        print(f"❌ Error in /api/ask: {e}")
        return {"status": "error", "message": str(e)}

JUDGE_DETECT_PROMPT = """
Determine whether the user's message is asking about a judge or judicial behavior.
Respond only with:

- "judge_query"       → if the message clearly relates to a judge, court behavior, rulings, strategy, tendencies, etc.
- "normal_query"      → if the message is not related to judges or courts at all.

Message: {{MESSAGE}}
"""

JUDGE_NAME_PROMPT = """
Extract the judge name mentioned in the message. 
If no clear judge name is mentioned, respond with "none".

Message: {{MESSAGE}}
"""

JUDGE_PROMPT = """
You are to generate a fully synthetic, fictional judge profile.
The profile must NOT resemble any real judge and should be entirely invented.
Produce strictly JSON in the following schema:

{
  "judge": "",
  "sample_size": 0,
  "case_types": {},
  "outcomes": [],
  "citations": [],
  "tendencies": {
    "leniency": "",
    "favorability_patterns": "",
    "argumentation_style": "",
    "precedents_frequently_used": []
  },
  "recommended_strategy": {
    "argument_style": "",
    "phrasing_examples": [],
    "precedents_to_use": [],
    "points_to_avoid": []
  }
}

Guidelines:
- All content must be fictional.
- `sample_size` should be a synthetic integer (e.g., 5–40).
- `case_types` should include 2–4 fake categories with percentages.
- `outcomes` should be fictional or generic (e.g., "motions granted", "appeals upheld").
- `citations` should be fictional references (e.g., "R v Thornton (2019)").
- Tendencies and strategies should be plausible but entirely fabricated.
- Do NOT break JSON format.

Judge Name: {{JUDGE_NAME}}
"""

INTERPRET_PROMPT = """
You are an assistant that extracts ONLY the relevant fields from a judge profile JSON
based on the user's question.

You must follow these rules:

- If the user asks for a specific field (e.g., “leniency”, “case types”, 
  “strategy”, “citations”), return ONLY that field in JSON.
- If the user asks for multiple specific fields, return only those.
- If the user asks for something broad like “Give judge profile”, return the entire profile.
- If the question is unclear, return the full profile.
- Output must always be valid JSON.

User question: {{QUESTION}}

Judge profile JSON:
{{PROFILE}}
"""



class JudgeRequest(BaseModel):
    judge: str
    model: str = "SukhdevTechsteck/US-Law-v3"

@app.post("/api/judge")
async def judge_router(req: JudgeRequest):
    try:
        user_msg = req.judge  # keeping same param name for compatibility

        # ---------------- STEP 1: Is this a judge query? ----------------
        detect_prompt_str = f"System: Analyze message intent.\n\nUser: {JUDGE_DETECT_PROMPT.replace('{{MESSAGE}}', user_msg)}\n\nAssistant:"

        detect_response = client.completions.create(
            model=req.model,
            prompt=detect_prompt_str,
            temperature=0,
            top_p=0.95,
            max_tokens=20
        )

        mode = detect_response.choices[0].text.strip()

        if "normal_query" in mode:
            # Return a regular chat completion
            normal_response = client.completions.create(
                model=req.model,
                prompt=f"User: {user_msg}\n\nAssistant:",
                top_p=0.95,
                max_tokens=500
            )
            return {
                "status": "success",
                "answer": normal_response.choices[0].text
            }

        # ---------------- STEP 2: Extract judge name (optional) ----------------
        name_prompt_str = f"System: Extract judge names.\n\nUser: {JUDGE_NAME_PROMPT.replace('{{MESSAGE}}', user_msg)}\n\nAssistant:"
        name_response = client.completions.create(
            model=req.model,
            prompt=name_prompt_str,
            temperature=0,
            top_p=0.95,
            max_tokens=50
        )

        judge_name = name_response.choices[0].text.strip()

        if judge_name.lower() == "none":
            judge_name = "Justice Placeholder"  # generates synthetic

        # ---------------- STEP 3: Generate full synthetic profile ----------------
        profile_prompt_str = f"System: Generate fictional judge profiles.\n\nUser: {JUDGE_PROMPT.replace('{{JUDGE_NAME}}', judge_name)}\n\nAssistant:"

        profile_response = client.completions.create(
            model=req.model,
            prompt=profile_prompt_str,
            temperature=0.3,
            top_p=0.95,
            max_tokens=1000
        )

        full_profile = profile_response.choices[0].text

        # ---------------- STEP 4: Interpret user's question ----------------
        interpret_prompt_str = f"System: Return only relevant JSON fields.\n\nUser: {INTERPRET_PROMPT.replace('{{QUESTION}}', user_msg).replace('{{PROFILE}}', full_profile)}\n\nAssistant:"

        interpret_response = client.completions.create(
            model=req.model,
            prompt=interpret_prompt_str,
            temperature=0,
            top_p=0.95,
            max_tokens=1000
        )

        filtered = interpret_response.choices[0].text

        return {"status": "success", "profile": json.loads(filtered)}

    except Exception as e:
        return {"status": "error", "message": str(e)}
