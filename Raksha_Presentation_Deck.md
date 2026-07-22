# 🛡️ RAKSHA: AI-Powered Digital Safety & Impersonation Defense
> **Hackathon Presentation Deck & Solution Summary**

---

## 📌 Slide 1: Title & Vision
* **Project Name**: Raksha (रक्षा)
* **Tagline**: Real-Time AI Defense against Digital Arrests & Public Safety Threats
* **Target Audience**: Citizens, Law Enforcement Agencies, Cyber Crime Cells
* **Mission**: Neutralize digital arrest extortion & impersonation scams before citizens fall victim.

---

## 📌 Slide 2: The Escalating Crisis (Problem Statement)
* **Digital Arrest Extortion**: Scammers impersonate Customs, CBI, ED, or Cyber Police via video/audio calls.
* **Psychological Coercion**: Victims are intimidated with fake arrest warrants, frozen accounts, and illegal confinement.
* **Massive Financial Loss**: Over ₹120+ Crores lost in 2024 alone to digital arrest scams across India.
* **Lack of Real-Time Shield**: Citizens have no instant mechanism to verify authority claims while on active scam calls.

---

## 📌 Slide 3: The Solution – Raksha Platform
* **Real-Time Citizen Shield**:
  * Instant scam indicator detection powered by Groq LLM.
  * Extracted phone numbers & UPI IDs for immediate investigation.
  * Actionable protective guidance ("Hang up immediately, report on 1930").
* **Investigator Graph Intelligence (RakshaGraph)**:
  * NetworkX graph clustering connects isolated citizen reports.
  * Uncovers hidden fraud rings, shared UPI accounts, and operational patterns.

---

## 📌 Slide 4: System Architecture
```
┌────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│   Citizen / Frontend   │ ───> │     FastAPI Backend     │ ───> │  Groq AI & NetworkX     │
│   (Next.js / React)    │ <─── │   (REST API + SQLite)   │ <─── │  (NLP + Graph Engine)   │
└────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```
* **Frontend**: Next.js 15, React, Tailwind CSS, Lucide Icons, vis-network for graph visualization.
* **Backend**: FastAPI, SQLAlchemy, SQLite DB.
* **AI & Clustering**: Groq Llama 3 API for indicator extraction, NetworkX for syndicate clustering.

---

## 📌 Slide 5: Key Features & Demo Walkthrough
1. **Citizen View**:
   * Interactive preset scenario analysis (FedEx/Customs, CBI HQ, ED Warrant).
   * Live Risk Score (0-100) & Risk Level indicator (High/Medium/Low).
   * Phone & UPI account extraction.
2. **Investigator View**:
   * Force-directed interactive network topology graph.
   * Cluster breakdown showing syndicate size, shared UPIs, and phone numbers.
   * Syndicate filter controls for focused investigation.

---

## 📌 Slide 6: Future Roadmap & Impact
* **Phase 1 (Current)**: Live NLP analysis & fraud network clustering.
* **Phase 2**: Real-time call audio transcription stream & WhatsApp bot integration.
* **Phase 3**: Automated reporting sync with National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in).

---

## 🛠️ How to Export / Present
- Copy the content into PowerPoint, Google Slides, or Canva.
- Use the included markdown structure for detailed submission documents.
