# Raksha System Architecture

## Overview

Raksha addresses the fundamental gap in digital arrest scam prevention:
1. **Citizens are isolated** during live video call scams with no objective second opinion.
2. **Law enforcement sees isolated complaints** rather than organized syndicates.

Raksha bridges this with **two frontends sharing a single detection and clustering engine**.

```
                       +-----------------------------------+
                       |    Raksha Web Frontend (Next.js)   |
                       |  /shield (Citizen) | /graph (Law) |
                       +-----------------+-----------------+
                                         |
                                         v  REST API
                       +-----------------------------------+
                       |         FastAPI Backend           |
                       +--------+-----------------+--------+
                                |                 |
                                v                 v
                     +--------------------+  +--------------------+
                     |  Groq LLM Engine   |  | NetworkX Graph Engine|
                     | Llama-3.3-70b-v    |  | Component Clustering|
                     +--------------------+  +--------------------+
                                |                 |
                                +--------+--------+
                                         |
                                         v
                                +-----------------+
                                | SQLite DB       |
                                | (SQLAlchemy)    |
                                +-----------------+
```

---

## Component Architecture

### 1. Detection Engine (`backend/analyzer.py`)
- **Model**: Groq `llama-3.3-70b-versatile` via OpenAI-compatible completion endpoint (`https://api.groq.com/openai/v1`).
- **Structured JSON Mode**: `response_format={"type": "json_object"}`.
- **System Prompt Strategy**:
  - Impersonation of government authorities (CBI, ED, Customs, TRAI).
  - Digital Arrest video custody coercion (Skype/WhatsApp stay-on-camera demands).
  - Victim isolation tactics ("Do not inform family/lawyer").
  - Fabricated criminal threat language (NDPS, PMLA, non-bailable warrants).
  - Coercive financial demands ("RBI verification accounts", UPI transfers).
- **Extracted Metadata**: Risk score (0-100), risk level (`high`, `medium`, `low`), indicators array, claimed authority, protective warning, extracted phone numbers, and UPI IDs.
- **Fail-Safe Heuristic Engine**: Integrated fallback pattern extractor ensures system operates seamlessly even during network isolation or unconfigured API keys.

### 2. Database & Entity Persistence (`backend/database.py` & `backend/models.py`)
- **Database**: Zero-config SQLite (`raksha.db`) via SQLAlchemy ORM.
- **Privacy Focus**: Stores extracted fraud indicators, phone numbers, and UPI IDs without storing raw personal PII.

### 3. Fraud Ring Clustering Engine (`backend/clustering.py`)
- **Engine**: Python `NetworkX`.
- **Graph Topology**:
  - **Nodes**: Flagged incidents (Medium & High risk).
  - **Edges**: Formed between incidents sharing entity attributes:
    1. Exact phone number match (`+91...`).
    2. Exact UPI account match (`...@bank`).
    3. Claimed authority string overlap.
    4. Scam indicator / keyword overlap (>= 2 matching indicators).
- **Syndicate Discovery**: Runs `nx.connected_components()` to extract disjoint subgraphs representing organized **Fraud Rings**.
- **Ring Intelligence**: Aggregates total complaints, shared phone numbers, shared UPI accounts, and primary claimed authorities per cluster.

### 4. Interactive Frontend (`frontend/`)
- **Next.js 15 App Router**: Unified application shell with top navbar view toggle between `/shield` (RakshaCall) and `/graph` (RakshaGraph).
- **Citizen Shield**: Real-time transcript analyzer with animated risk meter, scam indicator badges, pre-filled scenario presets, and plain-language safety guides.
- **Investigator Graph**: Interactive force-directed network topology (`vis-network`), syndicate color coding, ring filters, and side-panel incident inspector.
