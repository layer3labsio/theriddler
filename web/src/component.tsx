import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Trophy,
  RefreshCw,
  Brain,
  Zap,
  Flame,
  Plus,
  Eye,
  EyeOff,
  ChevronDown
} from "lucide-react";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

interface Riddle {
  id: number;
  question: string;
  answers: [string, string, string, string];
  correctIndex: number;
}

interface LeaderboardEntry {
  score: number;
  date: string;
  riddles: number;
}

const RIDDLES: Riddle[] = [
  {
    id: 1,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answers: ["A ghost", "An echo", "A whisper", "A shadow"],
    correctIndex: 1
  },
  {
    id: 2,
    question: "The more you take, the more you leave behind. What am I?",
    answers: ["Footsteps", "Memories", "Time", "Money"],
    correctIndex: 0
  },
  {
    id: 3,
    question: "What has keys but no locks, space but no room, and you can enter but can't go inside?",
    answers: ["A piano", "A keyboard", "A map", "A door"],
    correctIndex: 1
  },
  {
    id: 4,
    question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    answers: ["A tree", "A candle", "A person", "A building"],
    correctIndex: 1
  },
  {
    id: 5,
    question: "What has a head and a tail but no body?",
    answers: ["A snake", "A coin", "A comet", "A river"],
    correctIndex: 1
  },
  {
    id: 6,
    question: "What gets wet while drying?",
    answers: ["A sponge", "A towel", "Rain", "A mop"],
    correctIndex: 1
  },
  {
    id: 7,
    question: "What can travel around the world while staying in a corner?",
    answers: ["A stamp", "A letter", "A map", "A compass"],
    correctIndex: 0
  },
  {
    id: 8,
    question: "What has many teeth but cannot bite?",
    answers: ["A shark", "A comb", "A saw", "A zipper"],
    correctIndex: 1
  },
  {
    id: 9,
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answers: ["The letter M", "Time", "A thought", "A second"],
    correctIndex: 0
  },
  {
    id: 10,
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answers: ["A painting", "A map", "A dream", "A desert"],
    correctIndex: 1
  }
];

const STORAGE_KEY = "riddler-leaderboard";

const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load leaderboard:", e);
    return [];
  }
};

const saveLeaderboard = (entries: LeaderboardEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save leaderboard:", e);
  }
};

export default function TheRiddler() {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    category: "General",
    level: "Medium",
    language: "English"
  });
  const [generatedRiddle, setGeneratedRiddle] = useState<{ question: string, answer: string } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  const currentRiddle = RIDDLES[currentRiddleIndex];

  const handleAnswerClick = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === currentRiddle.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextRiddle = () => {
    if (currentRiddleIndex < RIDDLES.length - 1) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameComplete(true);
      const newEntry: LeaderboardEntry = {
        score,
        date: new Date().toLocaleDateString(),
        riddles: RIDDLES.length
      };
      const updatedLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      setLeaderboard(updatedLeaderboard);
      saveLeaderboard(updatedLeaderboard);
    }
  };

  const handleRestart = () => {
    setCurrentRiddleIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameComplete(false);
  };

  const handleCreateRiddle = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const riddles = {
        "English": [
          { question: "What has to be broken before you can use it?", answer: "An egg" },
          { question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "A candle" },
          { question: "What month of the year has 28 days?", answer: "All of them" }
        ],
        "Spanish": [
          { question: "¿Qué tiene que romperse antes de que puedas usarlo?", answer: "Un huevo" },
          { question: "Soy alto cuando soy joven y corto cuando soy viejo. ¿Qué soy?", answer: "Una vela" },
          { question: "¿Qué mes del año tiene 28 días?", answer: "Todos ellos" }
        ]
      };

      const pool = riddles[createForm.language as keyof typeof riddles] || riddles["English"];
      const random = pool[Math.floor(Math.random() * pool.length)];
      setGeneratedRiddle(random);
      setIsGenerating(false);
      setShowAnswer(false);
    }, 1500);
  };

  const answerLetters = ["A", "B", "C", "D"];

  if (gameComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Brain className="size-10 text-primary" />
            <h1 className="heading-2xl text-primary font-extrabold uppercase tracking-tight">The Riddler</h1>
          </div>
          <p className="text-secondary text-lg">Test your wit and logic!</p>
        </header>

        <section className="bg-surface rounded-3xl border border-default p-10 shadow-xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <h2 className="heading-xl font-bold">🎉 Game Complete!</h2>
            <div className="text-6xl font-black text-success tabular-nums">{score}/{RIDDLES.length}</div>
            <p className="text-secondary text-lg px-4">
              {score === RIDDLES.length ? "Perfect score! You're a master riddler!" :
                score >= RIDDLES.length * 0.7 ? "Great job! You really know your riddles!" :
                  score >= RIDDLES.length * 0.5 ? "Not bad! Keep practicing!" :
                    "Give it another try!"}
            </p>
          </div>

          <Button
            size="lg"
            color="primary"
            block
            onClick={handleRestart}
            className="h-16 text-xl rounded-2xl !bg-[#8B5CF6] !hover:bg-[#7C3AED] !text-white transition-all shadow-lg shadow-purple-500/20"
          >
            <RefreshCw className="mr-2 size-6" />
            Play Again
          </Button>

          <Button
            size="lg"
            variant="outline"
            color="secondary"
            block
            onClick={() => setIsCreateModalOpen(true)}
            className="h-16 text-xl rounded-2xl border-2 border-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#F5F3FF] transition-all"
          >
            <Plus className="mr-2 size-6" />
            Create My Own Riddle
          </Button>
        </section>

        {leaderboard.length > 0 && (
          <section className="bg-surface rounded-3xl border border-default p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-subtle pb-4">
              <Trophy className="size-5 text-warning" />
              <h3 className="heading-md font-bold text-[#8B5CF6]">Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-2xl ${index === 0 ? "bg-[#F5F3FF] border border-[#8B5CF6]/20 shadow-sm" : "bg-default/40"}`}>
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-xl font-extrabold text-[#8B5CF6]">#{index + 1}</span>
                    <div>
                      <div className="font-bold text-lg">{entry.score}/{entry.riddles}</div>
                      <div className="text-xs text-secondary">{entry.date}</div>
                    </div>
                  </div>
                  {index === 0 && <Trophy className="size-6 text-warning fill-warning" />}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Brain className="size-10 text-[#8B5CF6]" />
          <h1 className="heading-2xl text-[#8B5CF6] font-extrabold uppercase tracking-tight">The Riddler</h1>
        </div>
        <p className="text-secondary text-lg">Test your wit and logic!</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-default p-4 text-center space-y-1 shadow-sm">
          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Riddle</div>
          <div className="text-2xl font-black text-[#8B5CF6] tabular-nums">{currentRiddleIndex + 1}/{RIDDLES.length}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-default p-4 text-center space-y-1 shadow-sm">
          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Score</div>
          <div className="text-2xl font-black text-[#8B5CF6] tabular-nums">{score}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-default p-4 text-center space-y-1 shadow-sm items-center justify-center flex flex-col">
          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Streak</div>
          <div className="text-2xl font-black text-[#8B5CF6] flex items-center justify-center">
            {showFeedback && selectedAnswer === currentRiddle.correctIndex ? <Flame className="size-8 text-warning animate-pulse" /> : <span className="text-muted text-lg opacity-20">---</span>}
          </div>
        </div>
      </div>

      <section className="bg-surface rounded-3xl border border-default p-8 shadow-xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-center leading-relaxed text-balance">
          {currentRiddle.question}
        </h2>

        <div className="grid gap-3">
          {currentRiddle.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentRiddle.correctIndex;

            let color = "secondary" as any;
            let variant = "outline" as any;
            let customClasses = "";
            if (showFeedback) {
              if (isCorrect) {
                color = "success";
                variant = "soft";
              } else if (isSelected) {
                color = "error";
                variant = "soft";
              }
            } else if (isSelected) {
              color = "primary";
              customClasses = "!bg-[#8B5CF6] !text-white";
            }

            return (
              <Button
                key={index}
                size="lg"
                color={color}
                variant={variant}
                block
                onClick={() => handleAnswerClick(index)}
                disabled={showFeedback}
                className={`group relative h-16 justify-start text-left pl-16 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${customClasses}`}
              >
                <span className={`absolute left-4 size-8 rounded-lg flex items-center justify-center font-bold transition-colors ${showFeedback && isCorrect ? "bg-success text-white" :
                  showFeedback && isSelected ? "bg-error text-white" :
                    isSelected ? "bg-white text-[#8B5CF6]" :
                      "bg-accent-light text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white"
                  }`}>
                  {showFeedback && isSelected ? (
                    isCorrect ? <Check size={16} /> : <X size={16} />
                  ) : answerLetters[index]}
                </span>
                <span className="text-lg font-semibold">{answer}</span>
              </Button>
            );
          })}
        </div>

        {showFeedback && (
          <Button
            size="lg"
            color="primary"
            block
            onClick={handleNextRiddle}
            className="h-16 text-xl rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg !bg-[#8B5CF6] !hover:bg-[#7C3AED] !text-white"
          >
            {currentRiddleIndex < RIDDLES.length - 1 ? (
              <>Next Riddle <Zap className="ml-2 size-6" /></>
            ) : (
              <>See Results <Trophy className="ml-2 size-6" /></>
            )}
          </Button>
        )}
      </section>

      {leaderboard.length > 0 && (
        <section className="bg-surface rounded-3xl border border-default p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-subtle pb-4">
            <Trophy className="size-5 text-warning" />
            <h3 className="heading-md font-bold text-[#8B5CF6]">Top Scores</h3>
          </div>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-2xl ${index === 0 ? "bg-[#F5F3FF] border border-[#8B5CF6]/20 shadow-sm" : "bg-default/40"}`}>
                <div className="flex items-center gap-4">
                  <span className="w-8 text-xl font-extrabold text-[#8B5CF6]">#{index + 1}</span>
                  <div>
                    <div className="font-bold text-lg">{entry.score}/{entry.riddles}</div>
                    <div className="text-xs text-secondary">{entry.date}</div>
                  </div>
                </div>
                {index === 0 && <Trophy className="size-6 text-warning fill-warning" />}
              </div>
            ))}
          </div>
        </section>
      )}

      <Button
        size="lg"
        variant="outline"
        color="secondary"
        block
        onClick={() => setIsCreateModalOpen(true)}
        className="h-14 rounded-2xl border-2 border-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#F5F3FF] transition-all"
      >
        <Plus className="mr-2 size-5" />
        Create My Own Riddle
      </Button>

      {/* Create Riddle Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-default overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-default flex items-center justify-between bg-[#F5F3FF]/50">
              <h3 className="heading-md font-bold text-[#8B5CF6] flex items-center gap-2">
                <Brain className="size-5" />
                Create My Own Riddle
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setGeneratedRiddle(null);
                }}
                className="p-2 hover:bg-default rounded-full transition-colors"
              >
                <X className="size-5 text-secondary" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {!generatedRiddle ? (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider">Category</label>
                      <div className="relative">
                        <select
                          value={createForm.category}
                          onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                          className="w-full h-12 pl-4 pr-10 bg-default/10 border border-default rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all cursor-pointer"
                        >
                          <option>General</option>
                          <option>Logic</option>
                          <option>Wordplay</option>
                          <option>Math</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-secondary pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Skill Level</label>
                        <div className="relative">
                          <select
                            value={createForm.level}
                            onChange={(e) => setCreateForm({ ...createForm, level: e.target.value })}
                            className="w-full h-12 pl-4 pr-10 bg-default/10 border border-default rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all cursor-pointer"
                          >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-secondary pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Language</label>
                        <div className="relative">
                          <select
                            value={createForm.language}
                            onChange={(e) => setCreateForm({ ...createForm, language: e.target.value })}
                            className="w-full h-12 pl-4 pr-10 bg-default/10 border border-default rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all cursor-pointer"
                          >
                            <option>English</option>
                            <option>Spanish</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-secondary pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    color="primary"
                    block
                    onClick={handleCreateRiddle}
                    disabled={isGenerating}
                    className="h-14 !bg-[#8B5CF6] !hover:bg-[#7C3AED] !text-white rounded-xl shadow-lg shadow-purple-500/20"
                  >
                    {isGenerating ? "Generating..." : "Generate Riddle"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">Generated Riddle</label>
                    <div className="p-6 bg-[#F5F3FF] border border-[#8B5CF6]/20 rounded-2xl text-lg font-bold text-center leading-relaxed">
                      "{generatedRiddle.question}"
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider">Answer</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-16 bg-default/20 border border-default rounded-2xl flex items-center justify-center text-xl font-black tracking-widest overflow-hidden">
                        {showAnswer ? (
                          <span className="text-success animate-in zoom-in duration-300">{generatedRiddle.answer}</span>
                        ) : (
                          <span className="text-secondary/40 font-mono">••••••••</span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className={`size-16 rounded-2xl flex items-center justify-center transition-all ${showAnswer ? "bg-primary text-white shadow-lg" : "bg-default/20 text-secondary hover:bg-default/30"
                          }`}
                      >
                        {showAnswer ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      color="secondary"
                      onClick={() => setGeneratedRiddle(null)}
                      className="h-14 rounded-xl border border-default text-secondary hover:bg-default/10 transition-colors"
                    >
                      New Search
                    </Button>
                    <Button
                      size="lg"
                      color="primary"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setGeneratedRiddle(null);
                      }}
                      className="h-14 !bg-[#8B5CF6] !hover:bg-[#7C3AED] !text-white rounded-xl shadow-lg shadow-purple-500/20"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
