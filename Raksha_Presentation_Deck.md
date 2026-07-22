# RAKSHA — 10-Slide Presentation Deck Blueprint
## AI-Powered Digital Public Safety Platform for Real-Time Scam Detection & Fraud Network Clustering

---

## 💻 SLIDE 1: Title Slide & Elevator Pitch

### Slide Title: RAKSHA — Defeating Digital Arrest Scams in Real Time
**Subtitle:** AI-Powered Digital Public Safety Platform for Citizen Protection & Law Enforcement Intelligence  
**Hackathon:** ET AI Hackathon 2026 | Problem Statement 6  
**Tagline:** *"The second opinion scammers can't isolate you from."*

### Visual Layout & Formatting Instructions:
- **Left Side:** Large glowing Red Shield logo + Project Title in bold typography.
- **Right Side:** Key Tech Badges (`Next.js 15`, `FastAPI`, `Groq Llama-3.3-70b`, `NetworkX`, `SQLite`).
- **Footer:** Team Name & Contact Details.

---

## 🚨 SLIDE 2: The Problem — The Digital Arrest Crisis in India

### Slide Header: India's Rs 1,776 Crore Cyber Threat Epidemic

### Key Bullet Points:
- **Massive Financial Losses:** Indian citizens lost over **Rs 1,776 crore** in just 9 months (Jan–Sep 2024) to Digital Arrest scams.
- **Modus Operandi:** Fraudsters impersonate CBI, ED, Customs, or TRAI officers over Skype/WhatsApp video calls, accusing victims of drug trafficking (FedEx parcels) or Rs 42 Cr money laundering.
- **Victim Isolation:** Scammers demand continuous video custody in closed rooms, forbidding contact with family or police.

### Visual Layout & Diagram Suggestion:
- **Big Metric Box:** `Rs 1,776 Crore Lost` (Highlighted in bold red text).
- **Pictorial Threat Flow:**  
  `Scam Call Received` $\rightarrow$ `Impersonation (CBI/ED)` $\rightarrow$ `Video Call Lockup` $\rightarrow$ `Extortion Payment`

---

## 🔍 SLIDE 3: The Gap & Our Solution

### Slide Header: Bridging the Public Safety Gap with Dual Frontends

### Comparison Table (Pictorial Format):

| Challenge | Current Scenario | Raksha Solution |
| :--- | :--- | :--- |
| **Citizen Defense** | Isolated victim on live call with zero second opinion | **RakshaCall (`/shield`):** Instant AI risk score & un-isolatable safety advice |
| **Law Enforcement** | Disconnected individual PDF complaints | **RakshaGraph (`/graph`):** NetworkX clustering of complaints into organized criminal rings |
| **Action Speed** | Post-facto investigation (after money is lost) | Pre-transaction real-time interception |

### Visual Layout Suggestion:
- Split-screen diagram comparing **Current Fractured System** vs **Unified Raksha Platform**.

---

## 🏗️ SLIDE 4: System Architecture & Data Flow

### Slide Header: End-to-End System Architecture

### Visual Diagram Layout (Use Flowchart / Block Diagram):

```
[ CITIZEN INPUT ] ------------> [ RAKSHACALL FRONTEND (/shield) ]
                                            |
                                            v (POST /api/analyze)
                                [ FASTAPI BACKEND ENGINE ]
                                            |
                         +------------------+------------------+
                         v                                     v
             [ GROQ LLM DETECTION ]                [ SQLITE INCIDENT VAULT ]
             (Llama-3.3-70b JSON)                              |
                         |                                     v
                         +------------------------> [ NETWORKX GRAPH ENGINE ]
                                                               |
                                                               v (GET /api/graph)
                                                   [ RAKSHAGRAPH DASHBOARD (/graph) ]
```

### Key Bullet Points:
- Single FastAPI backend powering dual Next.js frontends.
- Zero-PII storage architecture.

---

## 🛡️ SLIDE 5: Citizen Defense — RakshaCall (`/shield`)

### Slide Header: Instant Real-Time Call Analysis & Victim Protection

### Visual Layout Instructions:
- **Place Screenshot 1 Here:** `docs/images/citizen-shield.png` (Screenshot of Citizen Shield UI).
- **Annotated Callouts on Screenshot:**
  - 🟢 *Clickable Demo Presets* (FedEx MDMA Parcel, CBI Money Laundering, ED Warrant).
  - 🔴 *Animated Risk Score Meter* (Score 96/100 - High Risk).
  - 🟡 *Claimed Authority Detector* (Identifies fake "Mumbai Customs Legal Cell").
  - 🔵 *Extracted Fraud Vectors* (Phone numbers & UPI IDs parsed automatically).

---

## 🤖 SLIDE 6: AI Detection & Prompt Engineering

### Slide Header: Powered by Groq Llama-3.3-70b Engine

### Key Bullet Points:
- **Groq Acceleration:** Sub-2-second LLM inference via Groq's OpenAI-compatible completions API.
- **Structured Output:** Enforces strict JSON response mode (`response_format={"type": "json_object"}`).
- **5 Core Indicator Pillars Assessed:**
  1. Authority Impersonation (CBI, ED, Customs, TRAI).
  2. Threat & Urgency Language (warrants, passport cancellation).
  3. Digital Arrest Video Isolation Tactics.
  4. Coercive Financial Demands (RBI verification UPI accounts).
  5. Credential Theft (OTPs, Aadhaar, screen sharing).

---

## 🕸️ SLIDE 7: Investigator Intelligence — RakshaGraph (`/graph`)

### Slide Header: Clustering Isolated Complaints into Fraud Rings

### Visual Layout Instructions:
- **Place Screenshot 2 & 3 Here:** `docs/images/investigator-dashboard.png` and `docs/images/fraud-graph-topology.png`.
- **Annotated Callouts on Screenshot:**
  - 🔴 *31 Flagged Complaints clustered into 3 distinct Fraud Rings*.
  - 🟡 *133 Inter-Incident Overlap Edges*.
  - 🔵 *Interactive Ring Filter Tabs* (Customs Ring, CBI Ring, ED Ring).
  - 🟣 *Side Panel Intelligence* (Shared phone numbers & shared UPI IDs across the ring).

---

## 🧬 SLIDE 8: NetworkX Graph Clustering Engine

### Slide Header: How Disjoint Set Clustering Unveils Crime Syndicates

### Visual Topology Diagram:

```
[ Incident #1 ] -- (Shared Phone: +919876543210) -- [ Incident #2 ]
       |                                                   |
(Shared UPI: mumbai.customs@icici)         (Shared UPI: verify.clearance@axis)
       |                                                   |
[ Incident #5 ] ----------------------------------- [ Incident #8 ]

                        ⬇️ NetworkX connected_components()
            🔴 FRAUD RING 1: Mumbai Customs Syndicate (10 Complaints)
```

### Key Bullet Points:
- Nodes represent medium/high-risk incidents.
- Edges connect incidents sharing phone numbers, UPI accounts, claimed authorities, or 2+ scam indicators.
- Automatically groups 40 individual complaints into actionable criminal syndicates.

---

## 📊 SLIDE 9: Hackathon Value, Impact & Production Roadmap

### Slide Header: Scalable Public Safety Infrastructure

### Key Impact Metrics:
- **Real-Time Prevention:** Stops victims before money is transferred.
- **Investigation Efficiency:** Reduces syndicate identification time from weeks to seconds.
- **Integration Ready:** Easily hooks into 1930 Cybercrime Portal API & NPCI UPI freeze lists.

### Production Roadmap:
- **Phase 1 (Current):** Next.js + FastAPI + Groq LLM + NetworkX.
- **Phase 2:** Live Telecom Operator / Truecaller Integration & Voice-to-Text streaming.
- **Phase 3:** Enterprise scaling via PostgreSQL & Neo4j.

---

## 🎯 SLIDE 10: Conclusion & Demo Links

### Slide Header: Defeating Digital Arrest Scams Together

### Summary Call to Action:
> **"Raksha turns isolated fear into connected intelligence — giving citizens an instant second opinion and law enforcement the full picture."**

### Links & Resources:
- 🌐 **Live Web Prototype:** `http://localhost:3000`
- 📁 **GitHub Repository:** `https://github.com/rajsaumyaa/Raksha`
- 📄 **Detailed Documentation:** `README.md` & `ARCHITECTURE.md`

---
