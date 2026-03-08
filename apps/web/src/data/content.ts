export interface ArticleContent {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampusResourceContent {
  id: string;
  name: string;
  type: string;
  category: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  services: string[];
  costInfo?: string;
  studentFriendly: boolean;
  freeServices?: string[];
  latitude?: number;
  longitude?: number;
  verified: boolean;
}

const NOW = new Date().toISOString();

export const fallbackArticles: ArticleContent[] = [
  {
    id: 'fallback-article-1',
    title: 'Contraception Basics for Students',
    slug: 'contraception-basics-for-students',
    category: 'contraception',
    summary:
      'A practical overview of common birth control options, how effective they are, and where students can access them.',
    content: `
# Contraception Basics for Students

Choosing contraception is personal. The best method is one you can access, use consistently, and feel comfortable with.

## Common Options

### Condoms
- Prevent pregnancy and reduce STI risk.
- Available without prescription.
- Useful as a core method or backup.

### Pills, Patch, Ring, or Shot
- Hormonal options that are effective with consistent use.
- Require regular timing or clinic follow-up.

### IUDs and Implants
- Long-acting and highly effective.
- Great for people who want a low-maintenance option.

## How to Choose
1. Consider your lifestyle and schedule.
2. Think about side effects and comfort.
3. Check cost and insurance coverage.
4. Talk to a healthcare provider for personalized guidance.

## Student Tip
Keep emergency contraception information saved on your phone before you need it.
    `,
    author: 'Stay-Safe Editorial Team',
    readTime: 6,
    tags: ['contraception', 'birth control', 'student health'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'fallback-article-2',
    title: 'Understanding Consent in Real Situations',
    slug: 'understanding-consent-in-real-situations',
    category: 'relationships',
    summary:
      'Consent is more than a one-time yes. Learn how to communicate boundaries and respect changes in comfort.',
    content: `
# Understanding Consent in Real Situations

Consent should be clear, ongoing, and freely given.

## Core Principles
- It can be withdrawn at any time.
- Past consent does not mean future consent.
- Pressure, fear, or manipulation are not consent.

## Helpful Language
- "Is this okay with you?"
- "Do you want to continue?"
- "We can stop any time."

## If You Feel Unsure
Pause, check in, and prioritize safety over assumptions.
    `,
    author: 'Stay-Safe Editorial Team',
    readTime: 5,
    tags: ['consent', 'relationships', 'boundaries'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=1200&q=80',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'fallback-article-3',
    title: 'STI Testing: When and Why It Matters',
    slug: 'sti-testing-when-and-why-it-matters',
    category: 'sti-prevention',
    summary: 'Testing is routine care. This guide covers timing, what to expect, and how to reduce anxiety.',
    content: `
# STI Testing: When and Why It Matters

Regular STI testing is a normal part of sexual health.

## When to Test
- Before new sexual partners.
- After unprotected sex.
- At regular intervals if sexually active.

## What Testing Looks Like
- Urine sample, blood test, or swab, depending on the STI.
- Many tests are fast and confidential.

## After Results
- Positive results are manageable with treatment and follow-up.
- Informing partners helps protect everyone.
    `,
    author: 'Stay-Safe Editorial Team',
    readTime: 6,
    tags: ['sti', 'testing', 'prevention'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755187?w=1200&q=80',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'fallback-article-4',
    title: 'Pleasure and Safety Can Coexist',
    slug: 'pleasure-and-safety-can-coexist',
    category: 'sexual-health',
    summary:
      'A positive, shame-free approach to sexual wellbeing that includes communication, comfort, and protection.',
    content: `
# Pleasure and Safety Can Coexist

Sexual health is not just risk avoidance. It also includes comfort, confidence, and communication.

## Build a Better Experience
- Talk about boundaries before intimacy.
- Use protection and lubrication when needed.
- Check in with yourself and your partner.

## Normalize Conversations
Open communication reduces confusion, pressure, and preventable harm.
    `,
    author: 'Stay-Safe Editorial Team',
    readTime: 4,
    tags: ['sexual health', 'communication', 'wellbeing'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1526244434298-88fcbcb066b5?w=1200&q=80',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'fallback-article-5',
    title: 'Managing Period Health on Campus',
    slug: 'managing-period-health-on-campus',
    category: 'menstrual-health',
    summary: 'Simple routines and warning signs to help students manage menstrual health with confidence.',
    content: `
# Managing Period Health on Campus

Period health can shift with stress, sleep, diet, and schedule changes.

## Helpful Habits
- Track your cycle.
- Keep emergency supplies in your bag.
- Use heat, hydration, and rest for cramp support.

## When to Seek Care
If pain is severe, bleeding is unusually heavy, or cycles become unpredictable, consult a provider.
    `,
    author: 'Stay-Safe Editorial Team',
    readTime: 5,
    tags: ['menstrual health', 'periods', 'self-care'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'fallback-article-6',
    title: 'Mental Health and Intimacy',
    slug: 'mental-health-and-intimacy',
    category: 'mental-health',
    summary: 'Understand how stress, anxiety, and mood can affect intimacy and how to ask for support.',
    content: `
# Mental Health and Intimacy

Mental health and sexual wellbeing are deeply connected.

## Common Impacts
- Stress can reduce desire and focus.
- Anxiety can increase fear around intimacy.
- Depression may affect energy and communication.

## Support Strategies
- Talk to someone you trust.
- Use campus counseling services.
- Ask healthcare providers about treatment options.
    `,
    author: 'Stay-Safe Editorial Team',
    readTime: 5,
    tags: ['mental health', 'intimacy', 'wellness'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=1200&q=80',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const fallbackResources: CampusResourceContent[] = [
  {
    id: 'fallback-resource-1',
    name: 'Campus Health Center',
    type: 'on-campus',
    category: 'general',
    address: 'Main Student Building, 1st Floor',
    city: 'Nairobi',
    phone: '+254-20-400-1000',
    website: 'https://www.uonbi.ac.ke',
    hours: 'Mon-Fri 8:00 AM - 5:00 PM',
    services: ['General consultation', 'STI screening', 'Contraception counseling'],
    costInfo: 'Free or low-cost for students',
    studentFriendly: true,
    freeServices: ['Condoms', 'Initial nurse consultation'],
    verified: true,
  },
  {
    id: 'fallback-resource-2',
    name: 'Student Counseling Unit',
    type: 'counseling',
    category: 'counseling',
    address: 'Student Wellness Office, Block B',
    city: 'Nairobi',
    phone: '+254-20-400-1222',
    email: 'counseling@campus.edu',
    hours: 'Mon-Fri 9:00 AM - 5:00 PM',
    services: ['Individual counseling', 'Trauma support', 'Relationship counseling'],
    costInfo: 'Free for enrolled students',
    studentFriendly: true,
    verified: true,
  },
  {
    id: 'fallback-resource-3',
    name: 'City Reproductive Health Clinic',
    type: 'clinic',
    category: 'reproductive-health',
    address: 'Westlands Avenue, Suite 3',
    city: 'Nairobi',
    phone: '+254-20-555-0101',
    website: 'https://www.mariestopes.or.ke',
    hours: 'Mon-Sat 8:00 AM - 6:00 PM',
    services: ['Family planning', 'Pregnancy testing', 'STI treatment'],
    costInfo: 'Sliding scale, student discounts',
    studentFriendly: true,
    freeServices: ['Contraception counseling'],
    verified: true,
  },
  {
    id: 'fallback-resource-4',
    name: '24/7 Emergency Response Desk',
    type: 'clinic',
    category: 'emergency',
    address: 'City Hospital Emergency Wing',
    city: 'Nairobi',
    phone: '+254-700-000-111',
    hours: 'Open 24/7',
    services: ['Emergency care', 'Sexual assault response', 'Post-exposure support'],
    costInfo: 'Insurance and emergency support options available',
    studentFriendly: true,
    verified: true,
  },
  {
    id: 'fallback-resource-5',
    name: 'Community Pharmacy',
    type: 'pharmacy',
    category: 'contraception',
    address: 'Madaraka Plaza, Ground Floor',
    city: 'Nairobi',
    phone: '+254-709-690000',
    website: 'https://www.goodlife.co.ke',
    hours: 'Daily 7:00 AM - 10:00 PM',
    services: ['Emergency contraception', 'Pregnancy tests', 'OTC care products'],
    costInfo: 'Standard pharmacy pricing',
    studentFriendly: true,
    verified: true,
  },
];