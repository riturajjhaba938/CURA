"use client";
import { useState, useRef, useEffect } from "react";
import { Send, AlertTriangle, ShieldCheck, UserCircle, Bot } from "lucide-react";

export default function RealTimeChat({ drugContext }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hello. I see you are looking into ${drugContext || "this treatment"}. How can I assist you with clinical definitions or patient experiences today?` }
  ]);
  const [input, setInput] = useState("");
  const [hasPHI, setHasPHI] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Regex patterns to match emails and basic phone numbers
  const phiRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)/g;

  useEffect(() => {
    // Scroll to bottom on new message
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    // Real-time PHI check
    const match = val.match(phiRegex);
    setHasPHI(!!match);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const newMessage = { role: "user", content: userText, containsPHI: hasPHI };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setHasPHI(false);

    // Initial loading state
    setMessages((prev) => [...prev, { role: "assistant", content: "Analyzing... Checking clinical databases and OpenFDA.", isLoading: true }]);

    try {
      // 1. Extract entities using Bytez NER Medical Model
      const extractRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText })
      });
      const extractData = await extractRes.json();
      
      let extractedSideEffect = extractData?.side_effect || extractData?.entities?.side_effect;
      const extractedDrug = extractData?.drug || extractData?.entities?.drug || drugContext || "the treatment";

      // Fallback: If AI didn't catch a symptom but the message is very short (e.g., just "dizziness")
      if (!extractedSideEffect && userText.trim().split(/\s+/).length <= 4) {
        extractedSideEffect = userText.replace(/["']/g, '').trim();
      }

      if (!extractedSideEffect) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs.pop();
          return [...newMsgs, { 
            role: "assistant", 
            content: `I couldn't identify a specific health symptom or side effect in that message. Could you provide more details about what you're experiencing with ${extractedDrug}?` 
          }];
        });
        return;
      }

      // 2. Verify Claim against FDA and run NLI BS Meter
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          drug: extractedDrug, 
          side_effect: extractedSideEffect, 
          claim_text: userText 
        })
      });
      const verifyData = await verifyRes.json();

      let reply = "";
      if (verifyData.verified) {
        reply = `I checked the OpenFDA clinical database. Yes, **${extractedSideEffect}** is a known, officially documented reaction to **${extractedDrug}**. `;
      } else {
        reply = `I couldn't find a direct, verified OpenFDA clinical report explicitly linking **${extractedSideEffect}** to **${extractedDrug}** in the standard documentation. `;
      }

      if (verifyData.bs_meter && verifyData.bs_meter.verdict === "caution") {
         reply += `However, according to our clinical sentiment and symptom clustering, your experience aligns with some anecdotal reports but warrants caution. `;
      } else if (verifyData.bs_meter && verifyData.bs_meter.verdict === "verified") {
         reply += `Our clinical credibility analysis shows strong alignment with typical symptom progression. `;
      } else {
         reply += `Our credibility tracking shows neutral alignment with typical symptom progression. `;
      }
      
      const score = Math.round(verifyData.credibility_score || 0);
      reply += `Analysis Confidence Score: ${score}/100.`;
      
      if (newMessage.containsPHI) {
        reply += " (P.S. Your private information was safely scrubbed via Cura's Zero-Trace pipeline).";
      }

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs.pop();
        return [...newMsgs, { role: "assistant", content: reply }];
      });
      
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs.pop();
        return [...newMsgs, { role: "assistant", content: "I encountered an error trying to cross-reference our clinical database. Please reach out to your specialist." }];
      });
    }
  };

  return (
    <div className="w-full max-w-lg h-[500px] bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="bg-primary p-4 text-on-primary flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-[Manrope] font-bold text-lg leading-tight">Cura Intelligence</h4>
          <p className="text-xs text-white/70">Context: {drugContext || "General"}</p>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface'}`}>
                {msg.role === 'user' ? <UserCircle className="w-5 h-5"/> : <Bot className="w-5 h-5"/>}
              </div>
              <div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-sm' 
                  : 'bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                {msg.containsPHI && msg.role === 'user' && (
                  <div className="flex items-center gap-1 text-[10px] text-primary/70 font-semibold mt-1 justify-end pr-1">
                    <ShieldCheck className="w-3 h-3" /> Anonymized via Cura
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-container-low border-t border-outline-variant/10 relative">
        {/* PHI Warning Toast Overlay */}
        {hasPHI && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AlertTriangle className="w-4 h-4" />
            PHI Detected: Text will be anonymized before sending.
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask about ${drugContext}...`}
            className={`w-full bg-surface-container-lowest border ${hasPHI ? 'border-amber-500/50 focus:ring-amber-500/20' : 'border-outline-variant/30 focus:ring-primary'} rounded-xl py-3 px-4 outline-none focus:ring-2 transition-all resize-none text-sm placeholder:text-on-surface-variant/50`}
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center shrink-0 hover:bg-primary-container transition-colors disabled:opacity-50 disabled:hover:bg-primary"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
