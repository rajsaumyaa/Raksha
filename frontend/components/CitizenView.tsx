'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  PhoneCall, 
  CreditCard, 
  UserX, 
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

const PRESETS = [
  {
    title: "Preset 1: Customs & FedEx Drug Parcel Threat",
    authority: "Mumbai Customs Legal Cell",
    text: "Caller: Hello, I am Senior Inspector Rajesh Verma calling from Mumbai Customs Clearance Division. We have confiscated a FedEx parcel shipped under your Aadhaar number containing 14 fake passports, 5 bank passbooks, and 150 grams of MDMA synthetic drugs. You are facing immediate criminal charges under NDPS Act. Connect on WhatsApp video immediately for digital arrest procedure. Transfer emergency clearance fee to mumbai.customs@icici."
  },
  {
    title: "Preset 2: CBI HQ 42-Crore Digital Arrest Warrant",
    authority: "CBI Cyber Crime Division Delhi",
    text: "Caller: This is Officer Sharma, Central Bureau of Investigation (CBI) Cyber Crime Cell HQ Delhi. Your name and Aadhaar details have emerged as the primary controller of a Rs 42 Crore illegal money laundering network operated through Canara Bank Mumbai. A Supreme Court Digital Arrest warrant is active against you. Move into an isolated room, lock doors, keep Skype video live 24/7, and transfer your bank balance to RBI escrow account cbi.cyber.dept@statebank."
  },
  {
    title: "Preset 3: ED Supreme Court Non-Bailable Arrest Threat",
    authority: "Enforcement Directorate (ED)",
    text: "Caller: Enforcement Directorate (ED) Investigation Unit. Special Notice under PMLA Act 2002. Your PAN card details are linked to 5 shell companies involved in offshore tax evasion. Supreme Court Non-bailable arrest warrant active. Join video call immediately for ED judicial interrogation. Transfer financial audit deposit to supreme.court.escrow@hdfc."
  }
];

export default function CitizenView() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (presetText: string) => {
    setTranscript(presetText);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setError(null);

    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

    try {
      const res = await fetch(`${apiBase}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      if (!res.ok) {
        throw new Error('Analysis request failed. Please check backend connection.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Real-Time Digital Arrest & Impersonation Shield</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Is Someone Demanding Money or Video Custody?
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Paste call audio transcript, WhatsApp text message, or video call claims below. 
          Raksha AI inspects scam indicators in real-time and provides a second opinion scammers cannot block.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Call / Message Transcript</span>
              </label>
              {transcript && (
                <button
                  onClick={() => { setTranscript(''); setResult(null); }}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            <textarea
              rows={8}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste suspicious call conversation, SMS warning, or video call statement here... (e.g. 'I am CBI Officer Sharma, your Aadhaar is linked to money laundering...')"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none"
            />

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Demo Scenario Presets:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(p.text)}
                    className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 hover:bg-slate-900 text-xs transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-200 group-hover:text-red-400 transition-colors">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Claimed: {p.authority}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !transcript.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing with Groq AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Analyze Call for Scam Indicators</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {!result && !loading && (
            <div className="glass-panel rounded-2xl p-8 border border-slate-800/80 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-slate-200">Awaiting Call Input</h3>
                <p className="text-xs text-slate-400">
                  Select a preset on the left or paste your own call transcript to receive immediate risk verification and safety guide.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
                <Lock className="w-6 h-6 text-red-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm font-semibold text-slate-300 animate-pulse">
                Evaluating Scam Indicators & Government Impersonation Vectors...
              </p>
            </div>
          )}

          {result && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    Risk Verdict
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                      result.risk_level === 'high' 
                        ? 'bg-red-950/80 text-red-400 border-red-800'
                        : result.risk_level === 'medium'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                    }`}>
                      {result.risk_level} RISK DETECTED
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-white font-mono">
                      {result.risk_score}<span className="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Risk Score</div>
                  </div>
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r="22" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                      <circle 
                        cx="28" 
                        cy="28" 
                        r="22" 
                        stroke={result.risk_level === 'high' ? '#ef4444' : result.risk_level === 'medium' ? '#f59e0b' : '#10b981'}
                        strokeWidth="4" 
                        fill="transparent"
                        strokeDasharray={138}
                        strokeDashoffset={138 - (138 * result.risk_score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {result.claimed_authority && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                  <UserX className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Claimed Authority / Entity</div>
                    <div className="text-sm font-bold text-slate-200">{result.claimed_authority}</div>
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-xl border ${
                result.risk_level === 'high'
                  ? 'bg-red-950/40 border-red-800/60 text-red-200'
                  : result.risk_level === 'medium'
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">Protective Action Guide</h4>
                    <p className="text-xs sm:text-sm leading-relaxed">{result.warning_message}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Detected Fraud Indicators ({result.indicators?.length || 0}):
                </span>
                <div className="space-y-2">
                  {result.indicators?.map((ind: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                    <span>Extracted Phone Numbers</span>
                  </div>
                  {result.phone_numbers?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {result.phone_numbers.map((p: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[11px] font-mono border border-blue-800/50">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">None extracted</div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Extracted UPI IDs</span>
                  </div>
                  {result.upi_ids?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {result.upi_ids.map((u: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[11px] font-mono border border-amber-800/50">
                          {u}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">None extracted</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
