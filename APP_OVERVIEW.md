# Ross AI - Application Overview

## Introduction
Ross AI is a sophisticated legal assistant web application designed to empower legal professionals with AI-driven tools for research, document analysis, and workflow automation. It leverages advanced Retrieval-Augmented Generation (RAG) to provide accurate, context-aware responses based on uploaded legal documents.

## Key Features

### 1. AI Assistant
The core of the application is a versatile chat interface that serves as a legal co-pilot.
- **Multi-Model Support**: Users can choose between different AI personas/models (e.g., "Lawyer 1", "Lawyer 2") to get varied perspectives or depths of analysis.
- **Task Modes**: Specialized modes for common legal tasks:
    - **QA**: General question answering.
    - **Summarize**: Condensing long documents or texts.
    - **Identify Risks**: Scanning content for potential legal liabilities.
    - **Draft Email**: Generating professional correspondence.
- **Contextual RAG**: Users can upload documents (PDF, DOCX, etc.) directly into the chat to get answers based specifically on those files.
- **Citations**: AI responses include citations to source documents, ensuring trust and verifiability.
- **Prompt Library**: A system to save and reuse custom prompts (Shared vs. Private scopes).

### 2. Legal Vault
A dedicated secure storage and analysis hub for legal documents.
- **Document Management**: Upload, list, and delete files.
- **File-Specific Q&A**: Select a specific document to "chat" with it, isolating the context to that single source.
- **Conversation History**: Persistent chat history linked to individual files for easy reference.

### 3. Workflows
*Note: Inferred from codebase structure*
- **Automation**: Tools to build and execute automated legal workflows, likely streamlining repetitive tasks like contract review or intake processing.

### 4. Analytics Dashboard
A visual dashboard to monitor team and individual performance.
- **Metrics**: Tracks hours, efficiency, and other key performance indicators (KPIs).
- **Views**: Segmented views for Managers, Employees, and Company-wide data.
- **Visualizations**: Interactive charts and graphs for temporal analysis (Weekly, Monthly, Yearly).

### 5. Judge Profiling (Backend Feature)
An advanced feature to generate synthetic profiles for judges.
- **Strategy Insights**: Provides insights on judicial tendencies, leniency, and recommended argumentation styles.
- **Synthetic Data**: Generates plausible profiles even for hypothetical or less-documented judges to aid in strategy formulation.

## Technical Architecture

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS for responsive and modern UI.
- **Animations**: Framer Motion for smooth transitions and interactive elements.
- **Icons**: React Icons (Feather Icons).

### Backend
- **Server**: FastAPI (Python) - High-performance async web framework.
- **AI/ML**:
    - **RAG Pipeline**: Custom implementation using Pinecone (Vector Database) for efficient document retrieval.
    - **LangChain/LlamaIndex** (Likely used in `rag_pipeline.py` or similar, though direct OpenAI calls are visible).

## User Experience (UX)
- **Modern Design**: Clean, professional interface with a focus on readability and ease of use.
- **Efficiency**: Keyboard shortcuts for power users (e.g., quick navigation, new chat).
- **Feedback**: Real-time loading states ("Thinking...") and streaming responses for a responsive feel.
