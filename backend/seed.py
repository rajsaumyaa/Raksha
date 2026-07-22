# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from models import Incident
from database import SessionLocal, engine, Base
import random

SEED_DATA = [
    {
        "transcript": "Caller: Hello, I am Senior Inspector Rajesh Verma calling from Mumbai Customs Clearance Division. We have confiscated a FedEx parcel shipped under your Aadhaar number containing 14 fake passports, 5 bank passbooks, and 150 grams of MDMA synthetic drugs. You are facing immediate criminal charges under NDPS Act. Connect on WhatsApp video immediately for digital arrest procedure.",
        "risk_score": 96,
        "risk_level": "high",
        "indicators": [
            "Impersonation of Customs Authority",
            "Illegal Parcel / Drug Smuggling Threat",
            "Mandatory Video Call Digital Arrest Tactic",
            "Aadhaar Number Identity Misuse Threat"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "CRITICAL SCAM ALERT: Customs officials never mandate video call arrests or demand instant remote verification. Disconnect and report to 1930.",
        "phone_numbers": ["+919876543210", "+919812345678"],
        "upi_ids": ["mumbai.customs@icici"]
    },
    {
        "transcript": "Caller: FedEx Customer Care notice. Package ID #FX-9921 tracked from Taiwan to Mumbai. Customs Officer Mr. Deshmukh has taken custody due to illegal contraband inside. You must pay an emergency clearance escrow fee to RBI verified UPI address mumbai.customs@icici within 15 minutes or arrest warrant will be activated.",
        "risk_score": 92,
        "risk_level": "high",
        "indicators": [
            "FedEx Brand Impersonation",
            "Urgency / 15-minute Threat Window",
            "Coercive UPI Money Demand to Fake Clearance Account"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "HIGH RISK FRAUD: Logistics companies cannot issue arrest warrants or demand payment to personal/unverified UPI IDs.",
        "phone_numbers": ["+919876543210"],
        "upi_ids": ["mumbai.customs@icici", "verify.clearance@axisbank"]
    },
    {
        "transcript": "Caller: This is Officer Kulkarni, Mumbai Customs Airport Cargo Unit. A parcel sent to your name in Malaysia has been detained for money laundering documents. Keep your camera on via Skype and do not contact any family member until verification complete. Deposit funds to verify.clearance@axisbank.",
        "risk_score": 94,
        "risk_level": "high",
        "indicators": [
            "Impersonation of Airport Customs Cargo",
            "Secrecy & Victim Isolation Directive",
            "Digital Arrest Video Interrogation",
            "Coercive Financial Demand"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "CRITICAL DIGITAL ARREST FRAUD: Scammers isolate victims over video calls to prevent them from seeking real help.",
        "phone_numbers": ["+919876543211"],
        "upi_ids": ["verify.clearance@axisbank"]
    },
    {
        "transcript": "Caller: Urgent warning from Customs Legal Desk. Your Aadhaar card has been flagged in 3 international contraband parcels. Contact +919876543210 immediately to speak with investigating officer before local police arrive at your residence.",
        "risk_score": 88,
        "risk_level": "high",
        "indicators": [
            "False Police Arrival Threat",
            "Aadhaar Identity Flag Scam",
            "Urgency Tactic"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "SCAM WARNING: Law enforcement does not send pre-arrest phone warnings with private numbers.",
        "phone_numbers": ["+919876543210"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: Hello Sir, FedEx Mumbai Hub. Your consignment #FDX-881 contains suspicious financial papers and credit cards. We are transferring call to Customs Clearance Inspector. Transfer refund audit amount to mumbai.customs@icici.",
        "risk_score": 89,
        "risk_level": "high",
        "indicators": [
            "FedEx - Customs Call Transfer Scam",
            "Fake Refund Audit Demand"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "FRAUD DETECTED: Courier services cannot transfer live calls directly to law enforcement.",
        "phone_numbers": ["+919812345678"],
        "upi_ids": ["mumbai.customs@icici"]
    },
    {
        "transcript": "Caller: Mumbai International Airport Customs Desk. We found 10 fake credit cards under your PAN details in an outgoing parcel. To stop digital arrest mandate, pay verification deposit now.",
        "risk_score": 85,
        "risk_level": "high",
        "indicators": [
            "PAN Card Misuse Threat",
            "Digital Arrest Mandate Threat"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "SUSPICIOUS THREAT: Never send money to avoid arrest. Real police follow physical legal summons.",
        "phone_numbers": ["+919876543211"],
        "upi_ids": ["verify.clearance@axisbank"]
    },
    {
        "transcript": "Caller: Warning: Customs Department notification. Unclaimed international parcel registered under Aadhaar ending in 8812. Failure to join video verification link will result in non-bailable warrant.",
        "risk_score": 90,
        "risk_level": "high",
        "indicators": [
            "Non-bailable Warrant Threat",
            "Video Verification Trap"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "DO NOT CLICK OR PAY: High risk digital arrest phishing attempt.",
        "phone_numbers": ["+919876543210"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: FedEx Mumbai Operations. Package held by Narcotic Control Bureau officer Mr. Deshmukh. Immediate call transfer initiated. Pay security deposit to verify.clearance@axisbank.",
        "risk_score": 91,
        "risk_level": "high",
        "indicators": [
            "NCB Officer Impersonation",
            "Security Deposit Coercion"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "FRAUD RISK: NCB does not ask for UPI security deposits.",
        "phone_numbers": ["+919812345678"],
        "upi_ids": ["verify.clearance@axisbank"]
    },
    {
        "transcript": "Caller: Customs Inspector calling regarding suspicious parcel to Cambodia containing stolen ATM cards. Put your phone on speaker and show your face on video call for digital lockup check.",
        "risk_score": 95,
        "risk_level": "high",
        "indicators": [
            "Digital Lockup Tactic",
            "Foreign Parcel Crime Threat"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "CRITICAL FRAUD ALERT: 'Digital Lockup' is a pure scam construct used by criminal networks.",
        "phone_numbers": ["+919876543211"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: Final reminder from Customs Desk. Transfer Rs 85,000 clearance verification to mumbai.customs@icici to erase criminal file entry from central server.",
        "risk_score": 93,
        "risk_level": "high",
        "indicators": [
            "Bribe / Criminal File Erase Demand",
            "Fake RBI Verification Account"
        ],
        "claimed_authority": "Mumbai Customs Legal Cell",
        "warning_message": "CRITICAL SCAM: Government central databases cannot be modified via UPI payments.",
        "phone_numbers": ["+919876543210"],
        "upi_ids": ["mumbai.customs@icici"]
    },
    {
        "transcript": "Caller: This is Officer Sharma, Central Bureau of Investigation (CBI) Cyber Crime Cell HQ Delhi. Your name and Aadhaar details have emerged as the primary controller of a Rs 42 Crore illegal money laundering network operated through Canara Bank Mumbai. A Supreme Court Digital Arrest warrant #CBI-2026-981 is active against you.",
        "risk_score": 98,
        "risk_level": "high",
        "indicators": [
            "Impersonation of CBI HQ Officer",
            "Fake Supreme Court Digital Arrest Warrant",
            "42 Crore Money Laundering Allegation",
            "Aadhaar Identity Theft Coercion"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "CRITICAL CBI IMPERSONATION: CBI officers never contact citizens over video call or issue 'digital arrest warrants'. Disconnect and block caller.",
        "phone_numbers": ["+919988776655", "+919911223344"],
        "upi_ids": ["cbi.cyber.dept@statebank"]
    },
    {
        "transcript": "Caller: CBI Officer Sharma on line. You must move to a closed room, close all doors, and keep your Skype video stream live 24/7 during this CBI digital custody period. Do not speak to family or lawyer. Transfer all savings to RBI escrow account cbi.cyber.dept@statebank for asset verification.",
        "risk_score": 99,
        "risk_level": "high",
        "indicators": [
            "CBI Digital Custody Directive",
            "Complete Victim Isolation In Room",
            "Demand to Transfer Entire Bank Savings",
            "Fake RBI Escrow Account Trap"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "SEVERE SCAM EXTREME RISK: Criminals are trying to drain your entire life savings through extreme isolation.",
        "phone_numbers": ["+919988776655"],
        "upi_ids": ["cbi.cyber.dept@statebank", "rbi.escrow.verify@ybl"]
    },
    {
        "transcript": "Caller: Assistant Director CBI Cyber Wing. We have frozen your bank accounts under Section 302/420. To prevent immediate SWAT team dispatch to your home, wire funds to rbi.escrow.verify@ybl within 30 minutes.",
        "risk_score": 96,
        "risk_level": "high",
        "indicators": [
            "CBI SWAT Dispatch Threat",
            "Section 420 Coercion",
            "Fake Escrow UPI Wire Demand"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "HIGH DANGER SCAM: Real police do not demand UPI money to withhold police dispatch.",
        "phone_numbers": ["+919988776656"],
        "upi_ids": ["rbi.escrow.verify@ybl"]
    },
    {
        "transcript": "Caller: CBI Headquarters Delhi Desk 4. Official notice regarding illegal hawala transactions linked to phone +919988776655. Stay on WhatsApp video call for live interrogation.",
        "risk_score": 94,
        "risk_level": "high",
        "indicators": [
            "Illegal Hawala Accusation",
            "Live Video Interrogation Trap"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "SCAM WARNING: CBI does not hold video call interrogations via messaging apps.",
        "phone_numbers": ["+919988776655"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: CBI Investigating Officer Verma. Your bank account in Naresh Goyal Jet Airways laundering case is flagged. Deposit audit balance to cbi.cyber.dept@statebank right now.",
        "risk_score": 95,
        "risk_level": "high",
        "indicators": [
            "High Profile Money Laundering Scam",
            "Audit Balance Deposit Demand"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "FRAUD: No government agency requests security deposits via UPI.",
        "phone_numbers": ["+919911223344"],
        "upi_ids": ["cbi.cyber.dept@statebank"]
    },
    {
        "transcript": "Caller: CBI Special Cyber Division. Your phone number is being disconnected by TRAI order in 2 hours due to cyber crime investigation. Transfer fee to rbi.escrow.verify@ybl to appeal.",
        "risk_score": 91,
        "risk_level": "high",
        "indicators": [
            "TRAI Disconnection Threat",
            "CBI Joint Investigation Lie"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "FALSE DISCONNECTION WARNING: TRAI never calls citizens threatening SIM blockage within hours.",
        "phone_numbers": ["+919988776656"],
        "upi_ids": ["rbi.escrow.verify@ybl"]
    },
    {
        "transcript": "Caller: CBI Officer Sharma. Show your bank mobile app screen over video call to verify balance against money laundering list.",
        "risk_score": 97,
        "risk_level": "high",
        "indicators": [
            "Screen Sharing Credentials Theft",
            "Video Call Surveillance"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "CRITICAL RISK: Never share your phone screen or open banking apps on video calls!",
        "phone_numbers": ["+919988776655"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: Notice from CBI Delhi Unit. You are put on Digital Arrest list #771. Do not disconnect line +919911223344 or local police station will be notified for physical arrest.",
        "risk_score": 93,
        "risk_level": "high",
        "indicators": [
            "Digital Arrest List Lie",
            "Line Disconnect Threat"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "SCAM ALERT: Disconnect call immediately. Real police visit in person with official documentation.",
        "phone_numbers": ["+919911223344"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: CBI Financial Crimes Unit. Pay clearance bond to cbi.cyber.dept@statebank to receive NOC certificate for bank account unfreezing.",
        "risk_score": 89,
        "risk_level": "high",
        "indicators": [
            "Fake Clearance Bond Demand",
            "Unverified NOC Scam"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "DO NOT TRANSFER: CBI does not issue NOCs via UPI transfers.",
        "phone_numbers": ["+919988776656"],
        "upi_ids": ["cbi.cyber.dept@statebank"]
    },
    {
        "transcript": "Caller: CBI Senior Counsel. Emergency Supreme Court clearance required for your Aadhaar card. Transfer total liquidated fixed deposit to rbi.escrow.verify@ybl.",
        "risk_score": 97,
        "risk_level": "high",
        "indicators": [
            "Fixed Deposit Liquidation Demand",
            "Supreme Court Impersonation"
        ],
        "claimed_authority": "CBI Cyber Crime Division Delhi",
        "warning_message": "CRITICAL SCAM ALERT: Scammers coerce victims into breaking FDs. Contact your real bank branch immediately.",
        "phone_numbers": ["+919988776655"],
        "upi_ids": ["rbi.escrow.verify@ybl"]
    },
    {
        "transcript": "Caller: Enforcement Directorate (ED) Investigation Unit. Special Notice under PMLA Act 2002. Your PAN card details are linked to 5 shell companies involved in offshore tax evasion. Supreme Court Non-bailable arrest warrant active. Join video call immediately for ED judicial interrogation.",
        "risk_score": 97,
        "risk_level": "high",
        "indicators": [
            "Enforcement Directorate (ED) Impersonation",
            "PMLA Act Tax Evasion Coercion",
            "Supreme Court Non-bailable Warrant",
            "ED Judicial Video Interrogation"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "CRITICAL ED IMPERSONATION SCAM: ED never conducts online video interrogations or issues arrest warrants over messaging apps.",
        "phone_numbers": ["+919765432100"],
        "upi_ids": ["ed.escrow.audit@sbi"]
    },
    {
        "transcript": "Caller: ED Officer Verma speaking. To avoid immediate property attachment and digital arrest lockup, send financial audit verification payment to ed.escrow.audit@sbi.",
        "risk_score": 95,
        "risk_level": "high",
        "indicators": [
            "Property Attachment Threat",
            "Audit Payment Demand to Fake ED Escrow"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "HIGH RISK SCAM: Property attachment follows official court proceedings, not instant UPI payments.",
        "phone_numbers": ["+919765432100", "+919765432101"],
        "upi_ids": ["ed.escrow.audit@sbi"]
    },
    {
        "transcript": "Caller: Enforcement Directorate Cyber Cell. Your bank account holds illegal proceeds of crime. Deposit full balance into Supreme Court judicial account supreme.court.escrow@hdfc for 24-hour verification.",
        "risk_score": 96,
        "risk_level": "high",
        "indicators": [
            "Supreme Court Escrow Impersonation",
            "Proceeds of Crime Allegation"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "CRITICAL FRAUD: The Supreme Court does not maintain UPI escrow accounts.",
        "phone_numbers": ["+919765432101"],
        "upi_ids": ["supreme.court.escrow@hdfc"]
    },
    {
        "transcript": "Caller: ED Joint Commissioner office calling +919765432100. Stay logged into video link for PMLA compliance check. Do not inform family members.",
        "risk_score": 93,
        "risk_level": "high",
        "indicators": [
            "PMLA Compliance Video Check",
            "Victim Secrecy Order"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "SCAM WARNING: Isolating victims from family is the primary tactic of digital arrest syndicates.",
        "phone_numbers": ["+919765432100"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: ED Financial Fraud Branch. Supreme Court directive requires immediate asset verification. Wire funds to ed.escrow.audit@sbi or face 7 years imprisonment.",
        "risk_score": 94,
        "risk_level": "high",
        "indicators": [
            "Imprisonment Threat",
            "ED Asset Verification Wire Scam"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "HIGH DANGER: Threatening imprisonment to demand immediate transfers is extortion.",
        "phone_numbers": ["+919765432101"],
        "upi_ids": ["ed.escrow.audit@sbi"]
    },
    {
        "transcript": "Caller: ED Legal Desk. Your Aadhaar card was used to register 12 luxury vehicles in scam operation. Transfer verification fee to supreme.court.escrow@hdfc.",
        "risk_score": 90,
        "risk_level": "high",
        "indicators": [
            "Aadhaar Identity Fraud Coercion",
            "Fake Verification Fee"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "SCAM DETECTED: Report this fraud immediately to National Cyber Crime Reporting Portal (1930).",
        "phone_numbers": ["+919765432100"],
        "upi_ids": ["supreme.court.escrow@hdfc"]
    },
    {
        "transcript": "Caller: Emergency call from ED Inspector Verma. Non-bailable arrest warrant has been uploaded to central crime database. Call +919765432101 immediately for digital bail application.",
        "risk_score": 92,
        "risk_level": "high",
        "indicators": [
            "Digital Bail Scam",
            "Central Database Warrant Lie"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "CRITICAL SCAM: 'Digital bail' does not exist in Indian legal framework.",
        "phone_numbers": ["+919765432101"],
        "upi_ids": []
    },
    {
        "transcript": "Caller: ED Money Laundering Task Force. Your bank accounts are placed under temporary freezing order. Transfer test transaction to ed.escrow.audit@sbi to restore mobile banking.",
        "risk_score": 91,
        "risk_level": "high",
        "indicators": [
            "Test Transaction Scam",
            "Bank Account Freezing Threat"
        ],
        "claimed_authority": "Enforcement Directorate (ED) Investigation Unit",
        "warning_message": "DO NOT TRANSFER: 'Test transactions' are used to drain funds.",
        "phone_numbers": ["+919765432100"],
        "upi_ids": ["ed.escrow.audit@sbi"]
    }
]

def seed_database(db: Session):
    existing_count = db.query(Incident).count()
    if existing_count >= 15:
        return
        
    for item in SEED_DATA:
        inc = Incident(
            transcript=item["transcript"],
            risk_score=item["risk_score"],
            risk_level=item["risk_level"],
            indicators=item["indicators"],
            claimed_authority=item["claimed_authority"],
            warning_message=item["warning_message"],
            phone_numbers=item["phone_numbers"],
            upi_ids=item["upi_ids"]
        )
        db.add(inc)
    db.commit()
