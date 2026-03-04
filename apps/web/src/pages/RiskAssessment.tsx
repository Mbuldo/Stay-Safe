import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, RefreshCcw } from 'lucide-react';
import { AssessmentCategory, AssessmentQuestion } from '@stay-safe/shared';
import api from '../services/api';

const CATEGORY_META: Record<
  AssessmentCategory,
  { name: string; description: string }
> = {
  contraception: {
    name: 'Contraception',
    description: 'Method consistency, emergency planning, and pregnancy prevention.',
  },
  'sti-risk': {
    name: 'STI Risk',
    description: 'Exposure profile, barrier use, symptom signals, and testing behavior.',
  },
  pregnancy: {
    name: 'Pregnancy',
    description: 'Recent exposure, cycle timing, and urgent symptom checks.',
  },
  'menstrual-health': {
    name: 'Menstrual Health',
    description: 'Cycle regularity, pain severity, and heavy bleeding warning signs.',
  },
  'sexual-health': {
    name: 'Sexual Health',
    description: 'Comfort, consent safety, symptoms, and preventive care habits.',
  },
  'mental-health': {
    name: 'Mental Health',
    description: 'Mood, anxiety, support system, sleep quality, and safety signals.',
  },
  'general-wellness': {
    name: 'General Wellness',
    description: 'Stress, prevention habits, substance-linked risk, and safety factors.',
  },
};

type FlowStep = 'category' | 'questions' | 'results';

interface AssessmentResultResource {
  title: string;
  description: string;
  url?: string;
  type: string;
}

interface AssessmentResultData {
  id: string;
  category: AssessmentCategory;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  aiAnalysis: string;
  recommendations: string[];
  resources: AssessmentResultResource[];
  createdAt: string;
}

export default function RiskAssessment() {
  const [step, setStep] = useState<FlowStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResultData | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const loadAiStatus = async () => {
      try {
        const status = (await api.getAIStatus()) as { configured: boolean };
        setAiConfigured(status.configured);
      } catch (_error) {
        setAiConfigured(null);
      }
    };

    loadAiStatus();
  }, []);

  const currentQuestion = questions[questionIndex];
  const progress =
    questions.length > 0 ? ((questionIndex + 1) / questions.length) * 100 : 0;

  const chooseCategory = async (category: AssessmentCategory) => {
    setSelectedCategory(category);
    setResponses({});
    setQuestionIndex(0);
    setAssessmentResult(null);
    setLoadError('');
    setStep('questions');
    setLoadingQuestions(true);

    try {
      const fetched = (await api.getAssessmentQuestions(
        category
      )) as AssessmentQuestion[];
      setQuestions(fetched);
      if (!fetched.length) {
        setLoadError('No questions available for this category right now.');
      }
    } catch (error: any) {
      setLoadError(
        error.message || 'Failed to load assessment questions. Please retry.'
      );
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setResponses(previous => ({ ...previous, [questionId]: answer }));
  };

  const submitAssessment = async () => {
    if (!selectedCategory) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        category: selectedCategory,
        responses: questions.map(question => ({
          questionId: question.id,
          question: question.text,
          answer: responses[question.id],
          category: selectedCategory,
        })),
      };

      const result = (await api.submitAssessment(payload)) as AssessmentResultData;
      setAssessmentResult(result);
      setStep('results');
    } catch (error: any) {
      alert(`Assessment failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(index => index + 1);
      return;
    }
    void submitAssessment();
  };

  const previousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(index => index - 1);
      return;
    }
    setStep('category');
  };

  const answerSelected = useMemo(() => {
    if (!currentQuestion) return false;
    const answer = responses[currentQuestion.id];

    if (currentQuestion.type === 'number') {
      return answer !== undefined && answer !== null && `${answer}`.trim() !== '';
    }

    if (currentQuestion.type === 'text') {
      return typeof answer === 'string' && answer.trim().length > 0;
    }

    return answer !== undefined;
  }, [currentQuestion, responses]);

  return (
    <div className="space-y-8">
      <header className="rounded-[22px] bg-[#1f2d63] px-8 py-9 text-white">
        <p className="text-xs tracking-[0.14em] text-slate-300 uppercase">
          Assessment Flow
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Personalized Risk Assessment
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Structured category-based screening with deterministic scoring and AI-enriched guidance.
        </p>
        {aiConfigured === false ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-amber-300/40 bg-amber-200/20 px-3 py-2 text-xs text-amber-100">
            <AlertTriangle className="h-4 w-4" />
            AI key not detected. You still receive full rule-based scoring and recommendations.
          </div>
        ) : null}
      </header>

      <AnimatePresence mode="wait">
        {step === 'category' ? (
          <motion.section
            key="category"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {Object.entries(CATEGORY_META).map(([id, meta]) => (
              <button
                key={id}
                type="button"
                onClick={() => chooseCategory(id as AssessmentCategory)}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="font-display text-xl font-semibold text-[#111a3d]">
                  {meta.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {meta.description}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-[#1f2d63]">
                  Start track
                </span>
              </button>
            ))}
          </motion.section>
        ) : null}

        {step === 'questions' ? (
          <motion.section
            key="questions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-3xl space-y-5"
          >
            {loadingQuestions ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
                Loading category questions...
              </div>
            ) : null}

            {!loadingQuestions && loadError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                {loadError}
              </div>
            ) : null}

            {!loadingQuestions && !loadError && currentQuestion ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Question {questionIndex + 1} of {questions.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full rounded-full bg-[#1f2d63]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                  <h2 className="font-display text-2xl font-semibold text-[#111a3d]">
                    {currentQuestion.text}
                  </h2>
                  {currentQuestion.helpText ? (
                    <p className="mt-2 text-sm text-slate-600">{currentQuestion.helpText}</p>
                  ) : null}

                  <div className="mt-6 space-y-3">
                    {currentQuestion.type === 'yes-no' ? (
                      <>
                        <AnswerButton
                          active={responses[currentQuestion.id] === 'yes'}
                          label="Yes"
                          onClick={() => handleAnswer(currentQuestion.id, 'yes')}
                        />
                        <AnswerButton
                          active={responses[currentQuestion.id] === 'no'}
                          label="No"
                          onClick={() => handleAnswer(currentQuestion.id, 'no')}
                        />
                      </>
                    ) : null}

                    {currentQuestion.type === 'single-choice'
                      ? currentQuestion.options?.map(option => (
                          <AnswerButton
                            key={option}
                            active={responses[currentQuestion.id] === option}
                            label={option}
                            onClick={() => handleAnswer(currentQuestion.id, option)}
                          />
                        ))
                      : null}

                    {currentQuestion.type === 'number' ? (
                      <input
                        type="number"
                        min={currentQuestion.min ?? 0}
                        max={currentQuestion.max}
                        step={currentQuestion.step ?? 1}
                        value={responses[currentQuestion.id] ?? ''}
                        onChange={event =>
                          handleAnswer(currentQuestion.id, event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
                        placeholder="Enter a number"
                      />
                    ) : null}

                    {currentQuestion.type === 'scale' ? (
                      <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-5">
                        <input
                          type="range"
                          min={currentQuestion.min ?? 1}
                          max={currentQuestion.max ?? 10}
                          step={currentQuestion.step ?? 1}
                          value={responses[currentQuestion.id] ?? 5}
                          onChange={event =>
                            handleAnswer(
                              currentQuestion.id,
                              Number.parseInt(event.target.value, 10)
                            )
                          }
                          className="w-full accent-[#1f2d63]"
                        />
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>{currentQuestion.min ?? 1}</span>
                          <span className="font-semibold text-[#111a3d]">
                            {responses[currentQuestion.id] ?? 5}
                          </span>
                          <span>{currentQuestion.max ?? 10}</span>
                        </div>
                      </div>
                    ) : null}

                    {currentQuestion.type === 'text' ? (
                      <textarea
                        value={responses[currentQuestion.id] ?? ''}
                        onChange={event =>
                          handleAnswer(currentQuestion.id, event.target.value)
                        }
                        rows={4}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#1f2d63]/50 focus:ring-2 focus:ring-[#1f2d63]/15"
                      />
                    ) : null}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={previousQuestion}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!answerSelected || submitting}
                      onClick={nextQuestion}
                      className="ml-auto inline-flex items-center gap-2 rounded-md bg-[#e84874] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d73a65] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? 'Submitting...'
                        : questionIndex === questions.length - 1
                          ? 'Submit'
                          : 'Next'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </motion.section>
        ) : null}

        {step === 'results' ? (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-3xl"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <div className="mb-6 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                <h2 className="mt-4 font-display text-3xl font-semibold text-[#111a3d]">
                  Assessment Complete
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Your personalized guidance is ready.
                </p>
              </div>

              {assessmentResult ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Risk Score</span>
                      <span className="font-semibold text-[#111a3d]">
                        {assessmentResult.score}/100
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          assessmentResult.score < 30
                            ? 'bg-emerald-500'
                            : assessmentResult.score < 60
                              ? 'bg-amber-500'
                              : assessmentResult.score < 80
                                ? 'bg-orange-500'
                                : 'bg-rose-500'
                        }`}
                        style={{ width: `${assessmentResult.score}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-[#111a3d]">
                      Risk Level:{' '}
                      <span className="font-semibold uppercase tracking-wide">
                        {assessmentResult.riskLevel}
                      </span>
                    </p>
                  </div>

                  {assessmentResult.aiAnalysis ? (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-relaxed text-slate-700">
                      <p className="mb-2 font-semibold text-[#111a3d]">
                        Clinical Summary
                      </p>
                      <p>{assessmentResult.aiAnalysis}</p>
                    </div>
                  ) : null}

                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#111a3d]">
                      Recommendations
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {(assessmentResult.recommendations || []).map(item => (
                        <li
                          key={item}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {assessmentResult.resources?.length > 0 ? (
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[#111a3d]">
                        Recommended Resources
                      </h3>
                      <div className="mt-3 grid gap-3">
                        {assessmentResult.resources.map((resource, index) => (
                          <div
                            key={`${resource.title}-${index}`}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <p className="font-semibold text-[#111a3d]">
                              {resource.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {resource.description}
                            </p>
                            {resource.url ? (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex text-sm font-medium text-[#1f2d63]"
                              >
                                Visit resource
                              </a>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep('category');
                    setSelectedCategory(null);
                    setQuestions([]);
                    setResponses({});
                    setQuestionIndex(0);
                    setAssessmentResult(null);
                    setLoadError('');
                  }}
                  className="ml-auto inline-flex items-center gap-2 rounded-md bg-[#e84874] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d73a65]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Take another assessment
                </button>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function AnswerButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
        active
          ? 'border-[#1f2d63]/30 bg-[#f6f0ff] text-[#111a3d]'
          : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );
}
