import json
import os
from typing import Optional, Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain.schema import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from vector_database import get_retriever

PROMPTS_PATH = os.path.join("prompts", "prompts.json")

def _load_prompts() -> Dict[str, Any]:
    if not os.path.exists(PROMPTS_PATH):
        return {"shared": {}, "private": {}}
    with open(PROMPTS_PATH, "r") as f:
        return json.load(f)

def _resolve_prompt(task: str, prompt_key: Optional[str], custom_prompt: Optional[str]) -> str:
    if custom_prompt:
        return custom_prompt

    prompts = _load_prompts().get("shared", {})
    if prompt_key and prompt_key in prompts:
        return prompts[prompt_key]

    defaults = {
        "qa": "You are a precise legal assistant. Using ONLY the provided context, answer the user's query. If the answer is not in the context, say you don't know and suggest what to look for.",
        "summarize": "Summarize for a lawyer: parties, purpose, key obligations, deadlines, term/termination, payments, governing law, notable risks.",
        "identify_risks": "List legal/commercial risks from the context. Include clause reference (if any), explanation, severity (Low/Med/High), and mitigation.",
        "draft_email": "Draft a concise, professional email to a client summarizing the document and implications. Include 3–5 bullet points and next steps.",
    }
    return defaults.get(task, defaults["qa"])

def _make_prompt(template: str) -> ChatPromptTemplate:
    system = (
        "{template}\n\n"
        "Rules:\n"

        "- If context is insufficient, say so.\n"
        "- Keep answers clear and structured for lawyers.\n"
    )
    return ChatPromptTemplate.from_messages(
        [
            ("system", system),
            ("human", "User question: {question}\n\nContext:\n{context}"),
        ]
    ).partial(template=template)

def _format_context(docs: List[Document]) -> str:
    chunks = []
    for d in docs:
        src = d.metadata.get("source")
        page = d.metadata.get("page")
        header = f"[Source: {src}{', p.'+str(page) if page is not None else ''}]"
        chunks.append(f"{header}\n{d.page_content}")
    return "\n\n---\n\n".join(chunks)

def _extract_citations(docs: List[Document]) -> List[Dict[str, Any]]:
    cites = []
    for d in docs:
        cites.append(
            {
                "source": d.metadata.get("source"),
                "page": d.metadata.get("page"),
                "filetype": d.metadata.get("filetype"),
            }
        )
    uniq = []
    seen = set()
    for c in cites:
        key = (c["source"], c["page"])
        if key not in seen:
            seen.add(key)
            uniq.append(c)
    return uniq

def answer_query(
    question: str,
    task: str = "qa",
    file: Optional[str] = None,
    top_k: int = 6,
    prompt_key: Optional[str] = None,
    custom_prompt: Optional[str] = None,
    model: str = "gpt-4o-mini",  # ✅ now configurable
) -> Dict[str, Any]:
    """
    Returns: {"answer": str, "sources": [{"source": "...", "page": 3}, ...]}
    """
    template = _resolve_prompt(task, prompt_key, custom_prompt)
    retriever = get_retriever(k=top_k, file_filter=file)
    docs = retriever.get_relevant_documents(question)
    context = _format_context(docs)

    llm = ChatOpenAI(model=model, temperature=0.2)
    prompt = _make_prompt(template)
    chain = prompt | llm | StrOutputParser()
    answer = chain.invoke({"question": question, "context": context})

    sources = _extract_citations(docs)
    return {"answer": answer, "sources": sources}





