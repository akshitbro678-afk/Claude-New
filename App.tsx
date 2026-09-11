import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { InputPanel } from "./components/InputPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { TeachItBack } from "./components/TeachItBack";
import { StreakWidget } from "./components/StreakWidget";
import { Disclaimer } from "./components/Disclaimer";
import { Footer } from "./components/Footer";
import { generateStudyResponse } from "./lib/mockEngine";
import { loadProgress, recordSession, recordTeachBack, type ProgressState } from "./lib/streak";
import type { ModeId, StudyResult, Subject } from "./lib/types";

function extractTopicPreview(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const match = trimmed.match(/^[^.?!]{3,120}[.?!]?/);
  let topic = match ? match[0] : trimmed.slice(0, 120);
  topic = topic.replace(/[.?!]+$/, "").trim();
  return topic;
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState<Subject>("Programming");
  const [mode, setMode] = useState<ModeId>("explain");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastTopic, setLastTopic] = useState("");
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const topicPreview = useMemo(() => extractTopicPreview(question || lastTopic), [question, lastTopic]);

  async function handleSubmit() {
    if (question.trim().length < 4 || loading) return;
    setLoading(true);
    setHasSubmitted(true);
    setLastTopic(question);
    try {
      const response = await generateStudyResponse(question, subject, mode);
      setResult(response);
      setProgress(recordSession());
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function handleTeachBackFeedback() {
    setProgress(recordTeachBack());
  }

  return (
    <div className="app-shell min-h-screen bg-transparent font-sans text-ink-900 antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(70rem 40rem at 15% -10%, rgba(251,131,50,0.10), transparent), radial-gradient(60rem 40rem at 110% 10%, rgba(251,131,50,0.08), transparent)",
        }}
      />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-700/45">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          A student-built learning companion
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <InputPanel
              question={question}
              onQuestionChange={setQuestion}
              subject={subject}
              onSubjectChange={setSubject}
              mode={mode}
              onModeChange={setMode}
              onSubmit={handleSubmit}
              loading={loading}
            />

            <div ref={resultsRef}>
              <ResultsPanel
                loading={loading}
                result={result}
                subject={subject}
                mode={mode}
                hasSubmitted={hasSubmitted}
              />
            </div>

            <TeachItBack topic={topicPreview} onFeedback={handleTeachBackFeedback} />
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <StreakWidget progress={progress} />
            <Disclaimer />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
