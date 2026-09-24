import { useEffect, useState } from "react";
import { Check, Copy, Download, Eraser, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { CodePanel } from "../components/CodePanel.jsx";
import { ConvertControls } from "../components/ConvertControls.jsx";
import { LanguageSelect } from "../components/LanguageSelect.jsx";
import { SecretWarningDialog } from "../components/SecretWarningDialog.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { MAX_INPUT_CHARS } from "../config/app";
import { getLanguage } from "../config/languages";
import { useConverter } from "../hooks/useConverter";
import { downloadTextFile } from "../utils/download";
import { redactSecrets, scanForSecrets } from "../utils/secretScanner";

function countLines(text) {
  return text ? text.split("\n").length : 0;
}

export default function ConverterPage() {
  const converter = useConverter();
  const { sourceId, targetId, input, output, status, isConverting } = converter;
  const source = getLanguage(sourceId);
  const target = getLanguage(targetId);

  const [secretFindings, setSecretFindings] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  /** Convert button / Ctrl+Enter: check for secrets first, then convert. */
  const requestConvert = () => {
    if (isConverting) return;
    const findings = scanForSecrets(input);
    if (findings.length > 0) {
      setSecretFindings(findings); // opens the dialog; nothing is sent yet
      return;
    }
    converter.convert();
  };

  const convertRedacted = () => {
    const safeCode = redactSecrets(input);
    setSecretFindings([]);
    converter.setInput(safeCode); // the user sees exactly what was sent
    converter.convert(safeCode);
  };

  const convertUnchanged = () => {
    setSecretFindings([]);
    converter.convert();
  };

  // Picking the language already used on the other side swaps the two.
  const changeSource = (id) => {
    if (id === targetId) converter.setTargetId(sourceId);
    converter.setSourceId(id);
  };
  const changeTarget = (id) => {
    if (id === sourceId) converter.setSourceId(targetId);
    converter.setTargetId(id);
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      converter.notify("error", "Couldn't copy. Select the code and press Ctrl+C instead.");
    }
  };

  const downloadOutput = () => downloadTextFile(`converted.${target.extension}`, output);

  // Ctrl+Enter (Cmd+Enter on Mac) converts from anywhere on the page,
  // including inside the editor. Capture phase runs before CodeMirror sees the key.
  const handleShortcut = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.stopPropagation();
      requestConvert();
    }
  };

  const tooLong = input.length > MAX_INPUT_CHARS;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10" onKeyDownCapture={handleShortcut}>
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Translate code between languages</h1>
        <p className="leading-relaxed text-mist">
          Paste your code, pick the language you want, and convert. The AI runs on your own Puter account, so this
          app needs no API keys.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <CodePanel
          labelId="source-heading"
          heading={`Source code (${source.label})`}
          languageId={sourceId}
          value={input}
          onChange={converter.setInput}
          placeholder="Paste the code you want to convert"
          toolbar={{
            start: (
              <LanguageSelect id="source-language" label="From" value={sourceId} onChange={changeSource} disabled={isConverting} />
            ),
            end: (
              <>
                <Button variant="ghost" size="icon" onClick={converter.clearInput} disabled={isConverting || !input} title="Clear input" aria-label="Clear input">
                  <Eraser className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="icon" onClick={converter.reset} disabled={isConverting} title="Reset to the example" aria-label="Reset to the example">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </Button>
              </>
            ),
          }}
          footer={
            <span className={tooLong ? "text-coral" : undefined}>
              {countLines(input)} lines, {input.length.toLocaleString()} of {MAX_INPUT_CHARS.toLocaleString()} characters
            </span>
          }
        />

        <ConvertControls
          isConverting={isConverting}
          canConvert={converter.canConvert}
          onConvert={requestConvert}
          onStop={converter.stop}
          onSwap={converter.swap}
          targetLabel={target.label}
        />

        <CodePanel
          labelId="target-heading"
          heading={`Converted code (${target.label})`}
          languageId={targetId}
          value={output}
          readOnly
          busy={isConverting}
          placeholder={`The ${target.label} version appears here`}
          toolbar={{
            start: (
              <LanguageSelect id="target-language" label="To" value={targetId} onChange={changeTarget} disabled={isConverting} />
            ),
            end: (
              <>
                <Button variant="ghost" size="sm" onClick={copyOutput} disabled={!output || isConverting}>
                  {copied ? <Check className="h-4 w-4 text-mint" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadOutput} disabled={!output || isConverting} title={`Download converted.${target.extension}`} aria-label={`Download converted.${target.extension}`}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                </Button>
              </>
            ),
          }}
          footer={output ? `${countLines(output)} lines of ${target.label}` : "Review AI output before you run it."}
        />
      </div>

      <StatusMessage status={status} />

      <p className="flex items-start gap-2 text-sm text-mist">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
        <span>
          Your code is sent to Puter&apos;s AI service when you convert. It&apos;s checked for keys and passwords
          first, but don&apos;t paste real credentials.{" "}
          <a href="#/privacy" className="text-paper underline decoration-ink-600 underline-offset-4 hover:decoration-marigold">
            Privacy details
          </a>
        </span>
      </p>

      <SecretWarningDialog
        findings={secretFindings}
        onRedact={convertRedacted}
        onSendAnyway={convertUnchanged}
        onCancel={() => setSecretFindings([])}
      />
    </div>
  );
}
