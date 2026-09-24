import { useCallback, useRef, useState } from "react";
import { AI_MODEL, MAX_INPUT_CHARS } from "../config/app";
import { DEFAULT_SOURCE, DEFAULT_TARGET, SAMPLE_CODE, getLanguage } from "../config/languages";
import { buildConversionMessages, cleanModelOutput } from "../services/conversion";
import { describePuterError, isSignedIn, streamChat } from "../services/puter";
import { useAuth } from "./useAuth";

/**
 * All converter state and actions. The page component only renders what
 * this hook returns, so UI and logic stay separate.
 *
 * status.type: "idle" | "converting" | "success" | "stopped" | "error"
 */
export function useConverter() {
  const { ensureSignedIn } = useAuth();

  const [sourceId, setSourceId] = useState(DEFAULT_SOURCE);
  const [targetId, setTargetId] = useState(DEFAULT_TARGET);
  const [input, setInput] = useState(SAMPLE_CODE);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  // Each conversion gets an id. Stopping or starting a new one changes the
  // current id, so chunks from an older request are ignored.
  const currentRun = useRef(0);

  const isConverting = status.type === "converting";

  /** Returns an error message, or null if the input can be sent. */
  const validate = useCallback(
    (code) => {
      if (!code.trim()) return "Paste or type some code to convert.";
      if (code.length > MAX_INPUT_CHARS) {
        return `This code is ${code.length.toLocaleString()} characters. The limit is ${MAX_INPUT_CHARS.toLocaleString()}.`;
      }
      if (sourceId === targetId) return "Choose a target language that's different from the source.";
      return null;
    },
    [sourceId, targetId],
  );

  /**
   * Converts `code` (defaults to the editor contents). Call it directly from
   * a click or key press: the first thing it may do is open Puter's sign-in
   * popup, which browsers only allow in response to a user action.
   */
  const convert = useCallback(
    async (code = input) => {
      const problem = validate(code);
      if (problem) {
        setStatus({ type: "error", message: problem });
        return;
      }

      const runId = ++currentRun.current;
      const targetLabel = getLanguage(targetId).label;

      try {
        const converting = { type: "converting", message: `Converting to ${targetLabel}…` };
        setStatus(isSignedIn() ? converting : { type: "converting", message: "Waiting for Puter sign-in…" });
        await ensureSignedIn();
        if (currentRun.current !== runId) return;

        setOutput("");
        setStatus(converting);

        const messages = buildConversionMessages({ code, sourceId, targetId });
        let raw = "";
        for await (const chunk of streamChat(messages, { model: AI_MODEL })) {
          if (currentRun.current !== runId) return; // stopped or replaced
          raw += chunk;
          setOutput(cleanModelOutput(raw));
        }
        if (currentRun.current !== runId) return;

        const result = cleanModelOutput(raw).replace(/^(\s*\n)+/, "");
        if (!result.trim()) throw new Error("The AI returned an empty response.");

        setOutput(result);
        setStatus({ type: "success", message: `Converted to ${targetLabel}.` });
      } catch (error) {
        if (currentRun.current !== runId) return;
        console.error("Conversion failed:", error);
        setStatus({ type: "error", message: describePuterError(error) });
      }
    },
    [input, sourceId, targetId, validate, ensureSignedIn],
  );

  const stop = useCallback(() => {
    currentRun.current += 1;
    setStatus({ type: "stopped", message: "Stopped. The partial result is kept." });
  }, []);

  const reset = useCallback(() => {
    currentRun.current += 1;
    setInput(SAMPLE_CODE);
    setSourceId(DEFAULT_SOURCE);
    setOutput("");
    setStatus({ type: "idle", message: "" });
  }, []);

  const clearInput = useCallback(() => {
    setInput("");
    setStatus({ type: "idle", message: "" });
  }, []);

  /** Swaps languages and moves the result into the input, to convert back. */
  const swap = useCallback(() => {
    currentRun.current += 1;
    setSourceId(targetId);
    setTargetId(sourceId);
    if (output.trim()) {
      setInput(output);
      setOutput("");
    }
    setStatus({ type: "idle", message: "" });
  }, [sourceId, targetId, output]);

  const notify = useCallback((type, message) => setStatus({ type, message }), []);

  return {
    sourceId,
    targetId,
    input,
    output,
    status,
    isConverting,
    setSourceId,
    setTargetId,
    setInput,
    convert,
    stop,
    reset,
    clearInput,
    swap,
    notify,
    canConvert: !isConverting && validate(input) === null,
  };
}
