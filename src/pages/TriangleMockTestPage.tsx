import { useState, useEffect, useCallback } from 'react';
import { triangleQuestions } from '../data/triangleQuiz';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, XCircle, Clock, Award, AlertCircle } from 'lucide-react';

const TOTAL_SECONDS = 30 * 60; // 30 minutes

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function TriangleMockTestPage() {
  const [order, setOrder] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isStarted, setIsStarted] = useState(false);

  // Initialize
  const startTest = useCallback(() => {
    setOrder(shuffleArray(Array.from(Array(triangleQuestions.length).keys())));
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(TOTAL_SECONDS);
    setIsStarted(true);
    window.scrollTo(0, 0);
  }, []);

  // Timer effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isStarted && !submitted && secondsLeft > 0) {
      timerId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            submitTest(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isStarted, submitted, secondsLeft]);

  const submitTest = (auto = false) => {
    if (submitted) return;
    const unanswered = triangleQuestions.length - Object.keys(answers).length;
    if (!auto && unanswered > 0) {
      if (!window.confirm(`${unanswered}টি প্রশ্নের উত্তর দেওয়া হয়নি। আপনি কি এখনই Submit করতে চান?`)) {
        return;
      }
    }
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [current]: optionIndex }));
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isStarted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in">
        <Helmet>
          <title>Triangle Formula Mock Test | Free Career Notice</title>
        </Helmet>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Triangle Formula</h1>
            <p className="text-blue-100 opacity-90">Professional Mock Test</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-bold text-slate-800 dark:text-white">52</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Questions</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-bold text-slate-800 dark:text-white">30 Min</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Duration</div>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> All questions are multiple choice.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Question order is randomized.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> You can navigate between questions.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Test will auto-submit when time is up.</li>
            </ul>

            <button 
              onClick={startTest}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
            >
              Start Mock Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    let correct = 0;
    order.forEach((qi, pos) => {
      if (answers[pos] === triangleQuestions[qi].a) correct++;
    });
    const wrong = Object.keys(answers).filter(k => answers[parseInt(k)] !== triangleQuestions[order[parseInt(k)]].a).length;
    const skipped = triangleQuestions.length - Object.keys(answers).length;
    const usedTime = TOTAL_SECONDS - secondsLeft;
    const percentage = Math.round((correct / triangleQuestions.length) * 100);

    const scoreMessage = (p: number) => {
      if(p>=90) return "Excellent! আপনার সূত্রের প্রস্তুতি খুবই শক্তিশালী।";
      if(p>=75) return "Very Good! সামান্য অনুশীলনে আরও ভালো হবে।";
      if(p>=50) return "Good Attempt! যেসব সূত্র ভুল হয়েছে সেগুলো আবার অনুশীলন করুন।";
      return "Keep Practicing! সূত্রগুলো একবার ভালোভাবে revise করে আবার test দিন।";
    };

    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8 p-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 border-[8px] border-blue-100 dark:border-blue-900/50">
            <Award className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">Your Final Score</h2>
          <div className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">{percentage}%</div>
          <p className="text-lg font-medium text-slate-800 dark:text-white mb-8">{scoreMessage(percentage)}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correct}</div>
              <div className="text-sm text-green-700 dark:text-green-500 font-medium mt-1">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{wrong}</div>
              <div className="text-sm text-red-700 dark:text-red-500 font-medium mt-1">Wrong</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{skipped}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Skipped</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(usedTime)}</div>
              <div className="text-sm text-blue-700 dark:text-blue-500 font-medium mt-1">Time Used</div>
            </div>
          </div>

          <button onClick={startTest} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            Restart Test
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Answer Review</h3>
          <div className="space-y-6">
            {order.map((qi, pos) => {
              const item = triangleQuestions[qi];
              const userAns = answers[pos];
              const isCorrect = userAns === item.a;
              const letters = ['A', 'B', 'C', 'D'];

              return (
                <div key={pos} className={`p-5 rounded-xl border-l-4 border-y border-r ${isCorrect ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800' : 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10 border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800'}`}>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{pos + 1}. {item.q}</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Your answer: {userAns === undefined ? 'Not answered' : <span className={`font-semibold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{letters[userAns]}. {item.o[userAns]}</span>}
                  </div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">
                    <span className="font-semibold text-green-600 dark:text-green-400">Correct answer:</span> {letters[item.a]}. {item.o[item.a]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQIndex = order[current];
  const question = triangleQuestions[currentQIndex];
  const letters = ['A', 'B', 'C', 'D'];
  const progressPercent = ((current + 1) / triangleQuestions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Triangle Formula Mock Test - Running</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Test Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <span>Question {current + 1} of {triangleQuestions.length}</span>
              <span>Answered: {Object.keys(answers).length}/{triangleQuestions.length}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">
              {current + 1}. {question.q}
            </h2>
            <div className="space-y-3">
              {question.o.map((opt, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[current] === idx 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-900/50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name={`q-${current}`} 
                    className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 shrink-0" 
                    checked={answers[current] === idx}
                    onChange={() => handleOptionSelect(idx)}
                  />
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">{letters[idx]}.</span>
                    <span className="text-slate-800 dark:text-slate-200">{opt}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
              disabled={current === 0}
              className="px-6 py-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous
            </button>
            
            {current < triangleQuestions.length - 1 ? (
              <button 
                onClick={() => setCurrent(prev => Math.min(triangleQuestions.length - 1, prev + 1))}
                className="px-8 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Next &rarr;
              </button>
            ) : (
              <button 
                onClick={() => submitTest(false)}
                className="px-8 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg shadow-red-500/30"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> Time Remaining
              </div>
              <div className={`text-4xl font-black py-4 rounded-xl ${secondsLeft <= 60 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : secondsLeft <= 300 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white'}`}>
                {formatTime(secondsLeft)}
              </div>
            </div>

            <div className="mb-4 text-sm font-bold text-slate-800 dark:text-white">Question Navigator</div>
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 mb-6">
              {order.map((_, i) => {
                const isCurrent = i === current;
                const isAnswered = answers[i] !== undefined;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-10 w-full rounded-lg font-semibold text-sm flex items-center justify-center transition-colors border ${
                      isCurrent 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                        : isAnswered 
                          ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' 
                          : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 justify-center">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Current</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-800"></div> Answered</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-600"></div> Unanswered</div>
            </div>

            <button 
              onClick={() => submitTest(false)}
              className="w-full mt-6 py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 font-bold rounded-xl transition-colors"
            >
              End Test Early
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
