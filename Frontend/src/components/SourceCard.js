"use client";
import { useState } from "react";
import { verifySource } from "@/lib/api";
import { ExternalLink, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

export default function SourceCard({ entity, sourceId, sourceType, contextSnippet }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!sourceId) return;
    setIsVerifying(true);
    setError(null);
    try {
      // Fetch the unredacted original text & BS score
      const data = await verifySource(sourceId, sourceType);
      setVerificationData(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify source.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-[Manrope] font-bold text-lg text-on-surface">{entity}</h4>
          <span className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
            {sourceType || "User Forum"}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-xl">forum</span>
        </div>
      </div>

      <p className="text-sm text-on-surface-variant italic mb-4 leading-relaxed">
        "...{contextSnippet}..."
      </p>

      {!verificationData && !isVerifying && !error && (
        <button
          onClick={handleVerify}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-sm font-semibold transition-colors group"
        >
          <ExternalLink className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          Verify Source
        </button>
      )}

      {isVerifying && (
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          Tracing Human Voice...
        </div>
      )}

      {error && (
        <div className="text-xs text-error font-medium flex items-center gap-1 mt-2">
          <ShieldAlert className="w-4 h-4" /> {error}
        </div>
      )}

      {verificationData && (
        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h5 className="font-bold text-sm text-primary">Verified Original Text</h5>
          </div>
          <p className="text-sm text-on-surface leading-relaxed mb-3">
            {verificationData.original_text || verificationData.text}
          </p>
          {verificationData.credibility_score && (
            <div className="flex items-center gap-2 pt-3 border-t border-primary/10 text-xs font-medium text-on-surface-variant">
              <span>Credibility Score:</span>
              <span className={`font-bold ${verificationData.credibility_score > 70 ? 'text-primary' : 'text-amber-500'}`}>
                {verificationData.credibility_score}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
