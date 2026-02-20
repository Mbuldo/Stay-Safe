import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const assessmentCategories = [
  { id: 'contraception', name: 'Contraception', description: 'Birth control methods and planning' },
  { id: 'sti-risk', name: 'STI Risk', description: 'Sexually transmitted infection awareness' },
  { id: 'pregnancy', name: 'Pregnancy', description: 'Pregnancy health and planning' },
  { id: 'menstrual-health', name: 'Menstrual Health', description: 'Period health and concerns' },
  { id: 'sexual-health', name: 'Sexual Health', description: 'Overall sexual wellness' },
  { id: 'mental-health', name: 'Mental Health', description: 'Emotional and mental wellness' },
  { id: 'general-wellness', name: 'General Wellness', description: 'Overall health and lifestyle' },
];

const sampleQuestions: Record<string, any[]> = {
  'sti-risk': [
    {
      id: 'q1',
      text: 'Are you currently sexually active?',
      type: 'yes-no',
    },
    {
      id: 'q2',
      text: 'Do you use protection consistently?',
      type: 'yes-no',
    },
    {
      id: 'q3',
      text: 'Have you been tested for STIs in the past 6 months?',
      type: 'yes-no',
    },
    {
      id: 'q4',
      text: 'How many sexual partners have you had in the past year?',
      type: 'number',
    },
  ],
  'contraception': [
    {
      id: 'q1',
      text: 'Are you currently using any form of contraception?',
      type: 'yes-no',
    },
    {
      id: 'q2',
      text: 'Which contraceptive method are you using?',
      type: 'single-choice',
      options: ['Condoms', 'Birth control pills', 'IUD', 'Implant', 'None', 'Other'],
    },
    {
      id: 'q3',
      text: 'How satisfied are you with your current method?',
      type: 'scale',
    },
  ],
  'pregnancy': [
    {
      id: 'q1',
      text: 'Are you currently pregnant?',
      type: 'yes-no',
    },
    {
      id: 'q2',
      text: 'Are you planning to become pregnant in the next year?',
      type: 'yes-no',
    },
    {
      id: 'q3',
      text: 'Have you discussed pregnancy planning with a healthcare provider?',
      type: 'yes-no',
    },
  ],
  'menstrual-health': [
    {
      id: 'q1',
      text: 'Do you experience regular menstrual cycles?',
      type: 'yes-no',
    },
    {
      id: 'q2',
      text: 'How would you rate your menstrual pain?',
      type: 'scale',
    },
    {
      id: 'q3',
      text: 'Do you experience any unusual symptoms during your period?',
      type: 'yes-no',
    },
  ],
  'sexual-health': [
    {
      id: 'q1',
      text: 'Do you have any concerns about your sexual health?',
      type: 'yes-no',
    },
    {
      id: 'q2',
      text: 'Have you experienced any pain during sexual activity?',
      type: 'yes-no',
    },
    {
      id: 'q3',
      text: 'How comfortable are you discussing sexual health with a provider?',
      type: 'scale',
    },
  ],
  'mental-health': [
    {
      id: 'q1',
      text: 'How would you rate your overall mental well-being?',
      type: 'scale',
    },
    {
      id: 'q2',
      text: 'Do you have a support system for emotional concerns?',
      type: 'yes-no',
    },
    {
      id: 'q3',
      text: 'Have you experienced anxiety or depression related to sexual health?',
      type: 'yes-no',
    },
  ],
  'general-wellness': [
    {
      id: 'q1',
      text: 'How would you rate your overall health?',
      type: 'scale',
    },
    {
      id: 'q2',
      text: 'Do you exercise regularly?',
      type: 'yes-no',
    },
    {
      id: 'q3',
      text: 'Do you get annual health check-ups?',
      type: 'yes-no',
    },
  ],
};

export default function RiskAssessment() {
  const [step, setStep] = useState<'category' | 'questions' | 'results'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const questions = selectedCategory ? sampleQuestions[selectedCategory] || [] : [];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setResponses({});
    setCurrentQuestion(0);
    setStep('questions');
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

const handleSubmit = async () => {
  setLoading(true);
  
  try {
    // Format responses for backend
    const formattedResponses = questions.map(q => ({
      questionId: q.id,
      question: q.text,
      answer: responses[q.id],
      category: selectedCategory!,
    }));

    const payload = {
      userId: 'placeholder',
      category: selectedCategory,
      responses: formattedResponses,
    };

    // LOG THE PAYLOAD
    console.log('Submitting assessment:', JSON.stringify(payload, null, 2));

    // Submit to backend
    const assessmentData = await api.submitAssessment(payload);

    // Store results for display
    setAssessmentResult(assessmentData);
    setStep('results');
  } catch (error: any) {
    console.error('Assessment submission failed:', error);
    console.error('Full error:', error);
    alert(`Failed to submit assessment: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (step === 'category') {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-2">Health Assessment</h1>
        <p className="text-muted-foreground mb-8">
          Select a category to begin your personalized health assessment
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessmentCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="p-6 border rounded-lg text-left hover:border-primary hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setStep('category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </button>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-xl font-semibold mb-6">{currentQuestionData?.text}</h2>

          {currentQuestionData?.type === 'yes-no' && (
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer(currentQuestionData.id, 'yes')}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  responses[currentQuestionData.id] === 'yes'
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(currentQuestionData.id, 'no')}
                className={`w-full p-4 border rounded-lg text-left transition-colors ${
                  responses[currentQuestionData.id] === 'no'
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary'
                }`}
              >
                No
              </button>
            </div>
          )}

          {currentQuestionData?.type === 'single-choice' && (
            <div className="space-y-3">
              {currentQuestionData.options?.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(currentQuestionData.id, option)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    responses[currentQuestionData.id] === option
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestionData?.type === 'number' && (
            <input
              type="number"
              min="0"
              value={responses[currentQuestionData.id] || ''}
              onChange={(e) => handleAnswer(currentQuestionData.id, parseInt(e.target.value) || 0)}
              className="w-full p-4 border rounded-lg"
              placeholder="Enter a number"
            />
          )}

          {currentQuestionData?.type === 'scale' && (
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={responses[currentQuestionData.id] || 5}
                onChange={(e) => handleAnswer(currentQuestionData.id, parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 (Low)</span>
                <span className="font-semibold text-foreground">
                  {responses[currentQuestionData.id] || 5}
                </span>
                <span>10 (High)</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!responses[currentQuestionData?.id] && responses[currentQuestionData?.id] !== 0}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {loading ? 'Submitting...' : currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const getRiskColor = (level: string) => {
      switch (level) {
        case 'low': return 'text-green-600';
        case 'moderate': return 'text-yellow-600';
        case 'high': return 'text-orange-600';
        case 'critical': return 'text-red-600';
        default: return 'text-gray-600';
      }
    };

    const hasRealResults = assessmentResult && assessmentResult.aiAnalysis;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
          <p className="text-muted-foreground">Here are your results</p>
        </div>

        <div className="bg-card p-8 rounded-lg border mb-6">
          {hasRealResults ? (
            <>
              {/* Real AI Results */}
              <h2 className="text-xl font-semibold mb-4">
                Risk Level: <span className={getRiskColor(assessmentResult.riskLevel)}>
                  {assessmentResult.riskLevel.charAt(0).toUpperCase() + assessmentResult.riskLevel.slice(1)}
                </span>
              </h2>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className="text-sm font-medium">{assessmentResult.score}/100</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      assessmentResult.score < 30 ? 'bg-green-500' :
                      assessmentResult.score < 60 ? 'bg-yellow-500' :
                      assessmentResult.score < 80 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${assessmentResult.score}%` }}
                  />
                </div>
              </div>

              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm whitespace-pre-wrap">{assessmentResult.aiAnalysis}</p>
              </div>

              <h3 className="font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2 mb-6">
                {assessmentResult.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              {assessmentResult.resources && assessmentResult.resources.length > 0 && (
                <>
                  <h3 className="font-semibold mb-3">Recommended Resources</h3>
                  <div className="space-y-3 mb-6">
                    {assessmentResult.resources.map((resource: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-lg hover:border-primary transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-1">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                            <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                              {resource.type || 'resource'}
                            </span>
                          </div>
                        </div>
                        {resource.url && resource.url !== '' ? (
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline font-medium"
                          >
                            Visit resource →
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            Search online for "{resource.title}" to learn more
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}              
            </>
          ) : (
            <>
              {/* Fallback when AI not available */}
              <h2 className="text-xl font-semibold mb-4">Assessment Submitted</h2>
              <p className="text-muted-foreground mb-6">
                Your assessment has been saved successfully, but AI analysis is currently unavailable.
              </p>

              <h3 className="font-semibold mb-3">General Recommendations</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Continue practicing safe habits</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Schedule regular check-ups with your healthcare provider</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Stay informed about sexual and reproductive health</span>
                </li>
              </ul>
            </>
          )}

            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="block w-full bg-secondary text-secondary-foreground py-3 rounded-lg hover:bg-secondary/90 text-center"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  setStep('category');
                  setSelectedCategory(null);
                  setResponses({});
                  setCurrentQuestion(0);
                  setAssessmentResult(null);
                }}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90"
              >
                Take Another Assessment
              </button>
            </div>
        </div>
      </div>
    );
  }

  return null;
}