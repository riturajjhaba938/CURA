import { useState, useEffect, useCallback } from "react";
import Vapi from "@vapi-ai/web";

export const useVapi = () => {
  const [vapi, setVapi] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("Vapi Public Key is missing from environment variables.");
    }
    
    const vapiInstance = new Vapi(publicKey || "your_public_key");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      console.log("Vapi Call Started");
      setIsListening(true);
    });
    
    vapiInstance.on("call-end", () => {
      console.log("Vapi Call Ended");
      setIsListening(false);
    });

    vapiInstance.on("error", (err) => {
      console.error("Vapi SDK Error:", err);
      setError(err.message || "Voice interaction error");
      setIsListening(false);
    });
    
    vapiInstance.on("message", (message) => {
      // console.log("Vapi Message:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript(prev => prev + " " + message.transcript);
      }
    });

    return () => {
      if (vapiInstance) vapiInstance.stop();
    };
  }, []);

  const start = useCallback(async () => {
    if (!vapi) {
      console.error("Vapi not initialized");
      return;
    }
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      console.error("Vapi Assistant ID is missing");
      setError("Assistant configuration missing");
      return;
    }
    
    try {
      setTranscript("");
      setError(null);
      console.log("Starting Vapi call with assistant:", assistantId);
      await vapi.start(assistantId);
    } catch (err) {
      console.error("Vapi Start Exception:", err);
      setError("Failed to start voice session.");
    }
  }, [vapi]);

  const stop = useCallback(() => {
    if (vapi) {
      console.log("Stopping Vapi call");
      vapi.stop();
    }
  }, [vapi]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { isListening, transcript, error, start, stop, toggle, setTranscript };
};
