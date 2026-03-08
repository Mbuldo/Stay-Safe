import { AIResponse, AssessmentCategory, AssessmentQuestion } from '@stay-safe/shared';

interface RiskScoreResult {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskSignals: string[];
  criticalSignals: string[];
}

interface DeterministicGuidance {
  analysis: string;
  recommendations: string[];
  resources: AIResponse['resources'];
}

const QUESTION_BANK: AssessmentQuestion[] = [
  {
    id: 'cont-1',
    category: 'contraception',
    text: 'Which contraception method are you currently relying on most often?',
    type: 'single-choice',
    options: ['Condoms', 'Pill/patch/ring/injection', 'IUD/implant', 'No regular method'],
    required: true,
    weight: 6,
  },
  {
    id: 'cont-2',
    category: 'contraception',
    text: 'How consistently have you used your chosen contraception over the past 4 weeks?',
    type: 'single-choice',
    options: ['Always', 'Most of the time', 'Sometimes', 'Rarely'],
    required: true,
    weight: 7,
  },
  {
    id: 'cont-3',
    category: 'contraception',
    text: 'Did you have unprotected sex in the last 2 weeks?',
    type: 'yes-no',
    required: true,
    weight: 8,
  },
  {
    id: 'cont-4',
    category: 'contraception',
    text: 'Do you know where to get emergency contraception quickly if needed?',
    type: 'yes-no',
    required: true,
    weight: 5,
  },
  {
    id: 'cont-5',
    category: 'contraception',
    text: 'Have side effects from your method made adherence difficult recently?',
    type: 'yes-no',
    required: true,
    weight: 5,
  },
  {
    id: 'cont-6',
    category: 'contraception',
    text: 'How confident are you in using your contraception correctly?',
    type: 'scale',
    min: 1,
    max: 5,
    step: 1,
    required: true,
    weight: 4,
  },
  {
    id: 'gen-1',
    category: 'general-wellness',
    text: 'Do you currently have severe symptoms such as heavy bleeding, severe pain, fever, or fainting?',
    type: 'yes-no',
    required: true,
    weight: 10,
    helpText: 'Select yes if urgent symptoms are present right now.',
  },
  {
    id: 'gen-2',
    category: 'general-wellness',
    text: 'How confident are you in accessing trusted SRH care when needed?',
    type: 'scale',
    min: 1,
    max: 5,
    step: 1,
    required: true,
    weight: 4,
  },
  {
    id: 'gen-3',
    category: 'general-wellness',
    text: 'How many days in the past week did stress significantly affect your daily routine?',
    type: 'number',
    min: 0,
    max: 7,
    step: 1,
    required: true,
    weight: 5,
  },
  {
    id: 'gen-4',
    category: 'general-wellness',
    text: 'How often do you use alcohol or substances before sexual activity?',
    type: 'single-choice',
    options: ['Never', 'Rarely', 'Sometimes', 'Often'],
    required: true,
    weight: 6,
  },
  {
    id: 'gen-5',
    category: 'general-wellness',
    text: 'Do you feel physically safe in your current relationship(s)?',
    type: 'yes-no',
    required: true,
    weight: 9,
  },
  {
    id: 'gen-6',
    category: 'general-wellness',
    text: 'How regularly do you attend preventive health checkups?',
    type: 'single-choice',
    options: ['Every year', 'Every 1-2 years', 'Only when needed', 'Rarely/Never'],
    required: true,
    weight: 4,
  },
  {
    id: 'sti-1',
    category: 'sti-risk',
    text: 'In the last 3 months, have you had unprotected sex?',
    type: 'yes-no',
    required: true,
    weight: 8,
  },
  {
    id: 'sti-2',
    category: 'sti-risk',
    text: 'Are you currently experiencing STI-related symptoms (discharge, sores, painful urination)?',
    type: 'yes-no',
    required: true,
    weight: 9,
  },
  {
    id: 'sti-3',
    category: 'sti-risk',
    text: 'How many sexual partners have you had in the last 3 months?',
    type: 'single-choice',
    options: ['0-1', '2-3', '4 or more'],
    required: true,
    weight: 6,
  },
  {
    id: 'sti-4',
    category: 'sti-risk',
    text: 'Have you had STI testing in the last 12 months?',
    type: 'single-choice',
    options: ['Yes, within 3 months', 'Yes, within 12 months', 'No'],
    required: true,
    weight: 6,
  },
  {
    id: 'sti-5',
    category: 'sti-risk',
    text: 'Do you and your partner(s) discuss STI status before sex?',
    type: 'single-choice',
    options: ['Always', 'Sometimes', 'Rarely'],
    required: true,
    weight: 5,
  },
  {
    id: 'sti-6',
    category: 'sti-risk',
    text: 'Have you had a known exposure to an STI recently?',
    type: 'yes-no',
    required: true,
    weight: 9,
  },
  {
    id: 'preg-1',
    category: 'pregnancy',
    text: 'Is there a possibility you are pregnant based on recent sexual activity and missed period?',
    type: 'yes-no',
    required: true,
    weight: 8,
  },
  {
    id: 'preg-2',
    category: 'pregnancy',
    text: 'Have you done a pregnancy test in the last 7 days?',
    type: 'single-choice',
    options: ['Yes, negative', 'Yes, positive', 'No'],
    required: true,
    weight: 6,
  },
  {
    id: 'preg-3',
    category: 'pregnancy',
    text: 'How many days late is your current or most recent period?',
    type: 'number',
    min: 0,
    max: 60,
    step: 1,
    required: true,
    weight: 7,
  },
  {
    id: 'preg-4',
    category: 'pregnancy',
    text: 'Are you experiencing nausea, breast tenderness, or unusual fatigue?',
    type: 'yes-no',
    required: true,
    weight: 6,
  },
  {
    id: 'preg-5',
    category: 'pregnancy',
    text: 'Did you use emergency contraception after recent unprotected intercourse?',
    type: 'single-choice',
    options: ['Yes', 'No', 'Not applicable'],
    required: true,
    weight: 5,
  },
  {
    id: 'preg-6',
    category: 'pregnancy',
    text: 'Do you currently have severe lower abdominal pain or heavy bleeding?',
    type: 'yes-no',
    required: true,
    weight: 10,
  },
  {
    id: 'mens-1',
    category: 'menstrual-health',
    text: 'How severe is your period pain right now?',
    type: 'scale',
    min: 0,
    max: 10,
    step: 1,
    required: true,
    weight: 7,
  },
  {
    id: 'mens-2',
    category: 'menstrual-health',
    text: 'How many pads/tampons do you fully soak in a day during your heaviest flow?',
    type: 'single-choice',
    options: ['0-3', '4-6', '7 or more'],
    required: true,
    weight: 8,
  },
  {
    id: 'mens-3',
    category: 'menstrual-health',
    text: 'How irregular have your cycles been in the last 6 months?',
    type: 'single-choice',
    options: ['Mostly regular', 'Occasionally irregular', 'Frequently irregular'],
    required: true,
    weight: 6,
  },
  {
    id: 'mens-4',
    category: 'menstrual-health',
    text: 'Have you passed large clots or had dizziness during menstruation?',
    type: 'yes-no',
    required: true,
    weight: 8,
  },
  {
    id: 'mens-5',
    category: 'menstrual-health',
    text: 'Do period symptoms cause you to miss classes or work?',
    type: 'single-choice',
    options: ['Never', 'Sometimes', 'Often'],
    required: true,
    weight: 5,
  },
  {
    id: 'mens-6',
    category: 'menstrual-health',
    text: 'Have you discussed persistent menstrual symptoms with a clinician?',
    type: 'single-choice',
    options: ['Yes, recently', 'Yes, over a year ago', 'No'],
    required: true,
    weight: 4,
  },
  {
    id: 'sex-1',
    category: 'sexual-health',
    text: 'Do you and your partner(s) consistently discuss boundaries and protection?',
    type: 'single-choice',
    options: ['Always', 'Sometimes', 'Rarely'],
    required: true,
    weight: 5,
  },
  {
    id: 'sex-2',
    category: 'sexual-health',
    text: 'How comfortable are you communicating consent and boundaries?',
    type: 'scale',
    min: 1,
    max: 5,
    step: 1,
    required: true,
    weight: 5,
  },
  {
    id: 'sex-3',
    category: 'sexual-health',
    text: 'Have you had pain during or after sex recently?',
    type: 'yes-no',
    required: true,
    weight: 7,
  },
  {
    id: 'sex-4',
    category: 'sexual-health',
    text: 'Do you use barrier protection consistently?',
    type: 'single-choice',
    options: ['Always', 'Most of the time', 'Sometimes', 'Rarely'],
    required: true,
    weight: 7,
  },
  {
    id: 'sex-5',
    category: 'sexual-health',
    text: 'Have you experienced coercion or pressure in sexual situations?',
    type: 'yes-no',
    required: true,
    weight: 10,
  },
  {
    id: 'sex-6',
    category: 'sexual-health',
    text: 'How satisfied are you with your current sexual wellbeing?',
    type: 'scale',
    min: 1,
    max: 5,
    step: 1,
    required: true,
    weight: 3,
  },
  {
    id: 'mental-1',
    category: 'mental-health',
    text: 'How often has stress or anxiety disrupted your sleep or daily functioning in the past 2 weeks?',
    type: 'single-choice',
    options: ['Rarely', 'Sometimes', 'Often'],
    required: true,
    weight: 6,
  },
  {
    id: 'mental-2',
    category: 'mental-health',
    text: 'How often have you felt persistently low or hopeless in the past 2 weeks?',
    type: 'single-choice',
    options: ['Rarely', 'Sometimes', 'Often'],
    required: true,
    weight: 7,
  },
  {
    id: 'mental-3',
    category: 'mental-health',
    text: 'How would you rate your sleep quality over the past week?',
    type: 'scale',
    min: 1,
    max: 5,
    step: 1,
    required: true,
    weight: 4,
  },
  {
    id: 'mental-4',
    category: 'mental-health',
    text: 'Do intrusive thoughts or worry interfere with concentration?',
    type: 'yes-no',
    required: true,
    weight: 6,
  },
  {
    id: 'mental-5',
    category: 'mental-health',
    text: 'Do you currently have access to emotional support from trusted people?',
    type: 'single-choice',
    options: ['Strong support', 'Some support', 'Minimal support'],
    required: true,
    weight: 5,
  },
  {
    id: 'mental-6',
    category: 'mental-health',
    text: 'Have you had thoughts of harming yourself recently?',
    type: 'yes-no',
    required: true,
    weight: 10,
  },
];

export function getAssessmentQuestions(
  category?: AssessmentCategory
): AssessmentQuestion[] {
  if (!category) {
    return QUESTION_BANK;
  }

  const scoped = QUESTION_BANK.filter(question => question.category === category);
  if (scoped.length > 0) {
    return scoped;
  }

  return QUESTION_BANK.filter(question => question.category === 'general-wellness');
}

export function calculateRiskScore(
  _category: AssessmentCategory,
  responses: Array<{ question: string; answer: unknown }>
): RiskScoreResult {
  let score = 12;
  const riskSignals: string[] = [];
  const criticalSignals: string[] = [];

  for (const response of responses) {
    const question = response.question.toLowerCase();
    const answer = normalizeAnswer(response.answer);

    if (isAffirmative(answer)) {
      if (question.includes('severe symptoms') || question.includes('heavy bleeding')) {
        score += 45;
        criticalSignals.push('Reported severe acute symptoms');
      } else if (question.includes('unprotected sex')) {
        score += 20;
        riskSignals.push('Recent unprotected sexual activity');
      } else if (question.includes('sti-related symptoms')) {
        score += 30;
        riskSignals.push('Possible STI symptoms reported');
      } else if (question.includes('possibility you are pregnant')) {
        score += 22;
        riskSignals.push('Possible unintended pregnancy risk');
      } else {
        score += 10;
      }
    }

    if (question.includes('pregnancy test')) {
      if (answer.includes('positive')) {
        score += 25;
        riskSignals.push('Positive pregnancy test noted');
      } else if (answer === 'no') {
        score += 8;
        riskSignals.push('Pregnancy uncertainty without recent testing');
      }
    }

    if (question.includes('period pain')) {
      const numeric = Number.parseFloat(answer);
      if (!Number.isNaN(numeric)) {
        if (numeric >= 8) {
          score += 24;
          riskSignals.push('Severe menstrual pain');
        } else if (numeric >= 5) {
          score += 12;
          riskSignals.push('Moderate menstrual pain');
        }
      }
    }

    if (question.includes('stress or anxiety')) {
      if (answer.includes('often')) {
        score += 18;
        riskSignals.push('Frequent stress or anxiety impact');
      } else if (answer.includes('sometimes')) {
        score += 9;
        riskSignals.push('Intermittent stress burden');
      }
    }

    if (question.includes('boundaries and protection')) {
      if (answer.includes('rarely')) {
        score += 14;
        riskSignals.push('Low consistency in protection planning');
      } else if (answer.includes('sometimes')) {
        score += 7;
      }
    }
  }

  score = Math.max(0, Math.min(100, score));
  const riskLevel =
    criticalSignals.length > 0 || score >= 85
      ? 'critical'
      : score >= 65
        ? 'high'
        : score >= 35
          ? 'moderate'
          : 'low';

  return { score, riskLevel, riskSignals, criticalSignals };
}

export function buildDeterministicGuidance(
  category: AssessmentCategory,
  scoreResult: RiskScoreResult
): DeterministicGuidance {
  const analysis =
    scoreResult.riskLevel === 'critical'
      ? 'Your responses include urgent warning signs. Seek immediate in-person clinical care.'
      : scoreResult.riskLevel === 'high'
        ? 'Your responses show high-priority risks that need prompt follow-up with a clinician.'
        : scoreResult.riskLevel === 'moderate'
          ? 'Your responses suggest moderate risk. A near-term check-in with a healthcare provider is recommended.'
          : 'Your responses suggest lower immediate risk. Continue prevention and routine screening.';

  const baseRecommendations = recommendationsForCategory(category);
  const urgencyRecommendations =
    scoreResult.riskLevel === 'critical'
      ? [
          'Go to the nearest emergency department or urgent care now.',
          'Do not delay care if symptoms are worsening.',
        ]
      : scoreResult.riskLevel === 'high'
        ? [
            'Book a clinic appointment within 24-72 hours.',
            'Avoid high-risk activity until reviewed by a clinician.',
          ]
        : [
            'Continue preventive care and periodic screening.',
            'Track symptoms so you can share patterns with a provider.',
          ];

  return {
    analysis,
    recommendations: [...urgencyRecommendations, ...baseRecommendations].slice(0, 8),
    resources: [
      {
        title: 'Campus Health Center',
        description: 'Local student-friendly primary care and SRH services.',
        type: 'service',
      },
      {
        title: 'WHO Sexual Health Overview',
        description: 'Evidence-based sexual and reproductive health guidance.',
        url: 'https://www.who.int/health-topics/sexual-health',
        type: 'article',
      },
    ],
  };
}

function recommendationsForCategory(category: AssessmentCategory): string[] {
  switch (category) {
    case 'sti-risk':
      return [
        'Request comprehensive STI screening and follow-up based on exposure timing.',
        'Use condoms or barriers consistently while awaiting results.',
      ];
    case 'pregnancy':
      return [
        'Take or repeat a pregnancy test using first-morning urine if status is unclear.',
        'Discuss options and timelines promptly with a qualified clinician.',
      ];
    case 'menstrual-health':
      return [
        'Monitor cycle timing, pain severity, and bleeding volume for trend review.',
        'Seek clinical evaluation for heavy bleeding, severe pain, or fainting.',
      ];
    case 'mental-health':
      return [
        'Use campus counseling or mental-health support if stress affects function.',
        'Prioritize sleep, hydration, and social support during symptom spikes.',
      ];
    case 'sexual-health':
      return [
        'Discuss consent, boundaries, and protection plans before sexual activity.',
        'Choose prevention methods you can use consistently.',
      ];
    case 'contraception':
      return [
        'Review contraception options with a provider based on your routine and goals.',
        'Keep a backup method and emergency contraception plan available.',
      ];
    default:
      return [
        'Schedule routine preventive SRH checkups.',
        'Return for care early if new symptoms emerge.',
      ];
  }
}

function normalizeAnswer(answer: unknown): string {
  if (typeof answer === 'string') {
    return answer.trim().toLowerCase();
  }
  if (typeof answer === 'number' || typeof answer === 'boolean') {
    return String(answer).toLowerCase();
  }
  if (Array.isArray(answer)) {
    return answer
      .map(item => normalizeAnswer(item))
      .join(' ')
      .trim();
  }
  return '';
}

function isAffirmative(value: string): boolean {
  return value === 'true' || value === 'yes' || value.includes('yes');
}
