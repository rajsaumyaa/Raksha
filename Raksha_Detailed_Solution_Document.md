# RAKSHA — Detailed Solution Document
## AI-Powered Digital Public Safety Platform for Real-Time Scam Detection & Fraud Network Clustering

**Submission for ET AI Hackathon 2026**  
**Problem Statement 6:** *AI for Digital Public Safety: Defeating Counterfeiting, Fraud & Digital Arrest Scams*

---

## 1. Executive Summary

Digital arrest scams — in which organized fraud syndicates impersonate high-ranking officials from the Central Bureau of Investigation (CBI), Enforcement Directorate (ED), Mumbai Customs, or State Police over live video calls — represent one of the fastest-growing cyber threat vectors in India. Between January and September 2024 alone, Indian citizens lost over **Rs 1,776 crore** to these coercive scams.

The fundamental breakdown in public safety occurs at two levels:
1. **At the Citizen Level:** Scammers isolate victims on continuous video calls (Skype, WhatsApp) using fear and threat language, depriving them of an objective second opinion before transferring their life savings.
2. **At the Law Enforcement Level:** Cybercrime units receive complaints as isolated, fragmented PDFs or entries, missing the underlying entity overlaps (phone numbers, UPI IDs, claimed authorities) that reveal organized crime syndicates.

**Raksha** solves both problems through a single, unified AI engine powering two frontends:
- **RakshaCall (Citizen Protection View - `/shield`):** A real-time transcript analyzer powered by Groq's `llama-3.3-70b-versatile` LLM operating in structured JSON mode. It assigns an instant risk score (0–100), detects impersonated government authorities, extracts fraud vectors (phone numbers, UPI IDs), and provides plain-language protective advice that breaks victim isolation.
- **RakshaGraph (Investigator Dashboard - `/graph`):** A graph intelligence engine powered by Python `NetworkX`. It clusters isolated citizen complaints into interactive, color-coded **Fraud Ring Syndicates** based on shared entity overlaps, enabling law enforcement to identify and dismantle entire criminal networks.

---

## 2. Problem Alignment & Context

### 2.1 The Mechanics of a Digital Arrest Scam
1. **Initial Contact & Threat Creation:** Fraudsters call victims claiming a FedEx/Customs parcel containing illegal drugs (e.g., 150g MDMA, fake passports) or an Aadhaar card linked to a Rs 42 crore money-laundering case.
2. **Coercive Digital Isolation:** Scammers demand that the victim remain on a continuous video call in a closed room, prohibiting them from contacting family, lawyers, or local police under threat of immediate physical arrest.
3. **Financial Extortion:** Victims are coerced into transferring their complete bank savings or liquidating fixed deposits into "RBI Judicial Verification Accounts" or "Escrow Accounts" via UPI.

### 2.2 Why Existing Solutions Fail
- **Static Blacklists:** Phone numbers and UPI IDs are rotated rapidly by scammers, rendering static blocklists ineffective.
- **Post-Facto Reporting:** Current reporting portals (e.g., 1930) act *after* the financial transaction has taken place.
- **Siloed Incident Data:** Investigative agencies analyze cases individually without automated cross-incident entity matching.

---

## 3. System Architecture & Technical Design

### 3.1 High-Level Architecture
Raksha uses a modern, decoupled architecture designed for same-day hackathon deployment and seamless cloud scaling.

```
+-----------------------------------------------------------------------+
|                       FRONTEND LAYER (Next.js 15)                      |
|                                                                       |
|   +---------------------------------+ +---------------------------+   |
|   |  RakshaCall Citizen View        | |  RakshaGraph Investigator |   |
|   |  (/shield)                      | |  (/graph - vis-network)   |   |
|   +---------------------------------+ +---------------------------+   |
+-----------------------------------+-----------------------------------+
                                    |
                                    v REST API (HTTP/JSON)
+-----------------------------------+-----------------------------------+
|                        BACKEND LAYER (FastAPI)                        |
|                                                                       |
|  +----------------------------+     +------------------------------+  |
|  |  Groq AI Detection Engine  |     |  NetworkX Graph Engine       |  |
|  |  (Llama-3.3-70b JSON Mode) |     |  (Disjoint Set Clustering)   |  |
|  +----------------------------+     +------------------------------+  |
+-------------------+-------------------------------+-------------------+
                    |                               |
                    v                               v
+-------------------+-------------------------------+-------------------+
|                     PERSISTENCE LAYER (SQLite DB)                     |
|            Incident Vault (Transcripts, Indicators, Phone, UPI)       |
+-----------------------------------------------------------------------+
```

---

## 4. Key Components & Implementation Details

### 4.1 Groq LLM Scam Interception Engine (`backend/analyzer.py`)
- **LLM Endpoint:** Groq API using OpenAI SDK compatibility (`https://api.groq.com/openai/v1`).
- **Model:** `llama-3.3-70b-versatile` with JSON output mode (`response_format={"type": "json_object"}`).
- **Detection System Prompt:** Engineered specifically to identify 5 core scam pillars:
  1. Government / Law Enforcement Authority Impersonation (CBI, ED, Customs, TRAI).
  2. Urgent Threat Language (warrants, passport cancellation, asset freezing).
  3. Video Call Isolation Tactics (Skype/WhatsApp stay-on-camera demands).
  4. Extortion Financial Demands (RBI verification UPI accounts, safe custody transfers).
  5. Personal Credential Requests (OTP, Aadhaar, PAN, mobile banking app screen sharing).
- **Extracted Schema:**
  ```json
  {
    "risk_score": 96,
    "risk_level": "high",
    "indicators": ["Impersonation of Customs", "Digital Arrest Tactic", "UPI Demand"],
    "claimed_authority": "Mumbai Customs Legal Cell",
    "warning_message": "CRITICAL SCAM ALERT: Real government agencies never mandate video call arrests.",
    "phone_numbers": ["+919876543210"],
    "upi_ids": ["mumbai.customs@icici"]
  }
  ```
- **Heuristic Fallback Engine:** Integrated regex and rule-based parser ensures zero downtime even during network glitches or API key limits.

### 4.2 NetworkX Fraud Ring Clustering Engine (`backend/clustering.py`)
- **Graph Construction:** Builds a graph $G = (V, E)$ where nodes $V$ represent flagged citizen incidents (Medium & High risk).
- **Edge Formation Rules ($E$):** An undirected edge is drawn between Incident $A$ and Incident $B$ if:
  1. $\text{Phone}(A) \cap \text{Phone}(B) \neq \emptyset$ (Shared phone number).
  2. $\text{UPI}(A) \cap \text{UPI}(B) \neq \emptyset$ (Shared UPI account).
  3. $\text{Authority}(A) = \text{Authority}(B) \neq \text{Null}$ (Exact claimed authority match).
  4. $|\text{Indicators}(A) \cap \text{Indicators}(B)| \ge 2$ (2+ matching scam indicators).
- **Cluster Discovery:** Applies NetworkX connected components algorithm (`nx.connected_components(G)`) to extract disjoint subgraphs representing organized criminal syndicates.

### 4.3 Interactive Frontend (`frontend/`)
- **Framework:** Next.js 15 (App Router), Tailwind CSS, Lucide React icons.
- **Network Visualizer:** `vis-network` interactive force-directed graph with drag-and-drop nodes, zooming, ring filters, and side panel detail inspection.

---

## 5. Hackathon Impact & Future Roadmap

1. **Pre-Transaction Prevention:** Intercepts victims *during* the call, stopping money transfers before they occur.
2. **National Cybercrime Portal Integration:** Can feed extracted phone numbers and UPI IDs directly to the 1930 portal and bank freeze lists.
3. **Scalability:** Can transition seamlessly from SQLite to PostgreSQL + Neo4j for enterprise production deployment.
