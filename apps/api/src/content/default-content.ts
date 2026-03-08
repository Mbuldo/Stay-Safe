import { Article } from '../services/articles.service';
import { CampusResource } from '../services/resources.service';

export const defaultArticles: Array<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'Contraception Basics for Students',
    slug: 'contraception-basics-for-students',
    category: 'contraception',
    summary:
      'A practical overview of common birth control options, effectiveness, and where students can access support.',
    content: `# Contraception Basics for Students

Choosing contraception is personal. The most effective method is one you can access and use consistently.

## Common options
- Condoms (pregnancy + STI protection)
- Pills, patch, ring, or injection
- Long-acting methods such as IUDs and implants

## Student checklist
1. Match the method to your routine.
2. Understand side effects and warning signs.
3. Keep emergency contraception information available.`,
    author: 'Stay-Safe Editorial Team',
    readTime: 6,
    tags: ['contraception', 'student-health', 'prevention'],
    featured: true,
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
  },
  {
    title: 'STI Testing: What to Expect',
    slug: 'sti-testing-what-to-expect',
    category: 'sti-prevention',
    summary:
      'Testing is routine sexual healthcare. Learn when to test, what tests involve, and what to do after results.',
    content: `# STI Testing: What to Expect

Routine testing helps you make informed decisions and start treatment early if needed.

## Consider testing
- Before a new partner
- After unprotected sex
- If symptoms appear

## After results
- Follow treatment instructions
- Inform recent partners when appropriate
- Repeat testing if your clinician advises it`,
    author: 'Stay-Safe Editorial Team',
    readTime: 5,
    tags: ['sti', 'testing', 'sexual-health'],
    featured: true,
    imageUrl:
      'https://images.unsplash.com/photo-1579165466741-7f35e4755187?w=1200&q=80',
  },
  {
    title: 'Managing Period Health on Campus',
    slug: 'managing-period-health-on-campus',
    category: 'menstrual-health',
    summary:
      'Simple habits, symptom tracking, and warning signs to support menstrual wellbeing while balancing classes.',
    content: `# Managing Period Health on Campus

Changes in stress, sleep, and diet can affect cycle regularity.

## Helpful habits
- Track your cycle
- Keep emergency supplies in your bag
- Hydration, rest, and heat for cramps

## Seek medical advice if
- Pain is severe
- Bleeding is unusually heavy
- Cycles become unpredictably irregular`,
    author: 'Stay-Safe Editorial Team',
    readTime: 5,
    tags: ['menstrual-health', 'self-care', 'students'],
    featured: false,
    imageUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80',
  },
];

export const nairobiResources: Array<
  Omit<CampusResource, 'id' | 'createdAt' | 'updatedAt'>
> = [
  {
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
    freeServices: ['Initial nurse consultation', 'Condoms'],
    verified: true,
  },
  {
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
];
