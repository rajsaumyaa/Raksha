import os
import json
import re
# pyrefly: ignore [missing-import]
from openai import OpenAI

SYSTEM_PROMPT = """You are an expert AI digital safety analyst specializing in Indian scam patterns, particularly 'Digital Arrest' and impersonation scams (CBI, ED, Mumbai Police, Customs, FedEx legal team, TRAI).

Analyze the provided call or message transcript for digital arrest and fraud indicators:
1. Impersonation of government authorities or law enforcement (CBI, Customs, Narcotics Bureau, Enforcement Directorate, TRAI, Supreme Court).
2. Urgency and threat language (passport cancellation, Aadhaar blockage, immediate arrest warrant, asset freezing).
3. Demand to stay on video call (Skype, WhatsApp video) or total isolation (forbidding contacting family/lawyers).
4. Demand for money transfer to 'RBI verification accounts', 'safe custody bank accounts', or UPI IDs.
5. Requests for sensitive OTPs, Aadhaar, PAN, bank details.

Extract any explicit phone numbers (e.g., +91..., 9876543210) and UPI IDs (e.g., officer@upi, cbi.verify@icici) mentioned in the transcript.

Return ONLY a valid JSON object matching this exact schema:
{
  "risk_score": integer (0 to 100),
  "risk_level": string ("low" | "medium" | "high"),
  "indicators_found": list of short indicator strings,
  "claimed_authority": string or null (e.g. "CBI Cyber Cell", "Mumbai Customs", "ED", "FedEx Legal"),
  "warning_message": string (clear plain-language advice for the victim),
  "phone_numbers": list of extracted phone numbers,
  "upi_ids": list of extracted UPI IDs
}
"""

def extract_entities_regex(text: str):
    phones = list(set(re.findall(r'(?:\+91[\s-]?)?[6-9]\d{9}', text)))
    upis = list(set(re.findall(r'[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+', text)))
    return phones, upis

def analyze_transcript(transcript: str) -> dict:
    api_key = os.getenv("GROQ_API_KEY")
    regex_phones, regex_upis = extract_entities_regex(transcript)
    
    if api_key:
        try:
            client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=api_key
            )
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": transcript}
                ],
                temperature=0.1
            )
            raw_content = response.choices[0].message.content
            data = json.loads(raw_content)
            
            p_list = list(set(data.get("phone_numbers", []) + regex_phones))
            u_list = list(set(data.get("upi_ids", []) + regex_upis))
            
            return {
                "risk_score": int(data.get("risk_score", 50)),
                "risk_level": str(data.get("risk_level", "medium")).lower(),
                "indicators": list(data.get("indicators_found", data.get("indicators", []))),
                "claimed_authority": data.get("claimed_authority"),
                "warning_message": str(data.get("warning_message", "")),
                "phone_numbers": p_list,
                "upi_ids": u_list
            }
        except Exception:
            pass

    score = 0
    indicators = []
    claimed_auth = None
    
    lower_t = transcript.lower()
    
    if any(k in lower_t for k in ["cbi", "customs", "enforcement directorate", "ed officer", "police", "trai", "supreme court", "narcotics"]):
        score += 35
        indicators.append("Impersonation of Government / Law Enforcement Authority")
        if "cbi" in lower_t:
            claimed_auth = "CBI Officer"
        elif "customs" in lower_t:
            claimed_auth = "Customs Department"
        elif "ed" in lower_t or "enforcement" in lower_t:
            claimed_auth = "Enforcement Directorate (ED)"
        elif "police" in lower_t:
            claimed_auth = "Cyber Crime Police"
        else:
            claimed_auth = "Government Official"
            
    if any(k in lower_t for k in ["digital arrest", "video call", "skype", "stay on camera", "do not disconnect"]):
        score += 30
        indicators.append("Digital Arrest / Mandatory Video Isolation Tactic")
        
    if any(k in lower_t for k in ["warrant", "illegal parcel", "drugs", "passport blocked", "aadhaar link", "money laundering"]):
        score += 20
        indicators.append("Fabricated Criminal Threat / False Warrant")
        
    if any(k in lower_t for k in ["transfer", "rbi safe account", "verification fee", "deposit", "upi", "pay now"]):
        score += 25
        indicators.append("Coercive Financial Demand / Fake Verification Account")
        
    if any(k in lower_t for k in ["do not inform", "keep confidential", "family", "isolate"]):
        score += 15
        indicators.append("Secrecy & Victim Isolation Directive")

    score = min(99, max(10, score))
    
    if score >= 70:
        level = "high"
        warning = "CRITICAL SCAM ALERT: This call exhibits classic 'Digital Arrest' scam characteristics. Real government agencies (CBI, ED, Police) NEVER conduct digital arrests via video call or demand money transfers. Disconnect immediately!"
    elif score >= 40:
        level = "medium"
        warning = "SUSPICIOUS IMPERSONATION ALERT: High likelihood of a fraudulent call claiming government authority. Do not share financial info or transfer funds."
    else:
        level = "low"
        warning = "Low scam probability detected based on transcript indicators. Always verify unverified callers independently."

    return {
        "risk_score": score,
        "risk_level": level,
        "indicators": indicators if indicators else ["Unverified Request"],
        "claimed_authority": claimed_auth,
        "warning_message": warning,
        "phone_numbers": regex_phones,
        "upi_ids": regex_upis
    }
