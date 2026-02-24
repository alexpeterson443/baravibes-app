import { useState, useCallback } from "react";
import { quizData } from "@shared/data";
import { Button } from "@/components/ui/button";

type Level = "easy" | "medium" | "expert";

const levelConfig: Record<Level, { label: string; emoji: string; color: string; bg: string }> = {
  easy: { label: "easy", emoji: "🌱", color: "text-green-700", bg: "bg-green-100" },
  medium: { label: "medium", emoji: "🔥", color: "text-amber-700", bg: "bg-amber-100" },
  expert: { label: "expert", emoji: "🧠", color: "text-purple-700", bg: "bg-purple-100" },
};

export default function QuizSection() {
  const [level, setLevel] = useState<Level | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const questions = level ? quizData[level] : [];
  const question = questions[currentQ];

  const startQuiz = (l: Level) => {
    setLevel(l);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.answer) {
      setScore((s) => s + 1);
    }
  }, [selected, question]);

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const getResultMessage = () => {
    const pct = score / questions.length;
    if (pct === 1) return "you are a capybara genius. I am genuinely impressed.";
    if (pct >= 0.7) return "pretty solid! you clearly know your capybaras.";
    if (pct >= 0.4) return "not bad but there is room for improvement. study up!";
    return "ok we need to talk. go look at more capybara content and try again.";
  };

  // Level selection
  if (!level) {
    return (
      <section id="quiz" className="py-20 bg-gradient-to-b from-[oklch(0.94_0.03_145/0.3)] to-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">the capybara quiz</h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              how well do you actually know capybaras? pick your difficulty and find out.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {(Object.keys(levelConfig) as Level[]).map((l) => {
              const cfg = levelConfig[l];
              return (
                <button
                  key={l}
                  onClick={() => startQuiz(l)}
                  className={`${cfg.bg} rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:scale-105`}
                >
                  <div className="text-4xl mb-2">{cfg.emoji}</div>
                  <div className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</div>
                  <div className="text-xs text-foreground/60 mt-1">{quizData[l].length} questions</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Finished
  if (finished) {
    return (
      <section id="quiz" className="py-20 bg-gradient-to-b from-[oklch(0.94_0.03_145/0.3)] to-white">
        <div className="container">
          <div className="max-w-lg mx-auto text-center bg-white rounded-2xl shadow-lg p-8">
            <div className="text-5xl mb-4">
              {score === questions.length ? "🏆" : score >= questions.length * 0.7 ? "🎉" : "🐾"}
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">
              {score} / {questions.length}
            </h3>
            <p className="text-foreground/70 mb-6">{getResultMessage()}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => startQuiz(level)} className="rounded-full">
                try again
              </Button>
              <Button variant="outline" onClick={() => setLevel(null)} className="rounded-full">
                pick a different level
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Active quiz
  const cfg = levelConfig[level];
  return (
    <section id="quiz" className="py-20 bg-gradient-to-b from-[oklch(0.94_0.03_145/0.3)] to-white">
      <div className="container">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className={`${cfg.bg} ${cfg.color} text-xs font-bold px-3 py-1 rounded-full`}>
              {cfg.emoji} {cfg.label}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentQ + 1} / {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-5">{question.q}</h3>
            <div className="space-y-3">
              {question.options.map((opt, i) => {
                let classes = "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ";
                if (showResult) {
                  if (i === question.answer) {
                    classes += "border-green-500 bg-green-50 text-green-700";
                  } else if (i === selected && i !== question.answer) {
                    classes += "border-red-400 bg-red-50 text-red-600";
                  } else {
                    classes += "border-border text-foreground/50";
                  }
                } else {
                  classes += "border-border hover:border-primary hover:bg-accent text-foreground";
                }
                return (
                  <button key={i} className={classes} onClick={() => handleAnswer(i)} disabled={showResult}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-5 flex justify-end">
                <Button onClick={nextQuestion} className="rounded-full">
                  {currentQ + 1 < questions.length ? "next question" : "see results"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
