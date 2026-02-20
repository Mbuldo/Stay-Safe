import articlesService from '../services/articles.service';
import resourcesService from '../services/resources.service';

console.log('Seeding database with articles and resources...\n');

// Sample Articles
const articles = [
  {
    title: 'Understanding Contraception Options for Students',
    slug: 'understanding-contraception-options',
    category: 'contraception',
    summary: 'A comprehensive guide to different contraceptive methods available to university students, including effectiveness, cost, and where to access them.',
    content: `
# Understanding Contraception Options for Students

Choosing the right contraceptive method is an important decision for sexually active students. This guide covers the most common options available.

## Barrier Methods

### Condoms
- **Effectiveness**: 98% with perfect use, 87% with typical use
- **Cost**: Free at most campus health centers, or $1-2 per condom
- **Pros**: Also protects against STIs, no prescription needed
- **Cons**: Must use every time, can break

### Internal Condoms
- **Effectiveness**: 95% with perfect use, 79% with typical use
- **Cost**: Slightly more expensive than external condoms
- **Pros**: Can be inserted hours before sex, provides STI protection
- **Cons**: Less widely available, requires practice

## Hormonal Methods

### Birth Control Pills
- **Effectiveness**: 99% with perfect use, 93% with typical use
- **Cost**: Often free with student insurance, or $0-50/month
- **Pros**: Highly effective, can regulate periods
- **Cons**: Must take daily, requires prescription

### IUD (Intrauterine Device)
- **Effectiveness**: Over 99%
- **Cost**: $0-1,300, but often covered by insurance
- **Pros**: Lasts 3-12 years, very low maintenance
- **Cons**: Requires insertion procedure, upfront cost

### Implant
- **Effectiveness**: Over 99%
- **Cost**: $0-1,300, usually covered by insurance
- **Pros**: Lasts up to 5 years, nothing to remember
- **Cons**: Requires insertion/removal procedure

## Emergency Contraception

### Plan B (Morning After Pill)
- **Effectiveness**: Most effective within 72 hours
- **Cost**: $25-50, available over the counter
- **When to use**: After unprotected sex or contraceptive failure

## Where to Access

Most campus health centers offer:
- Free condoms
- Low-cost or free birth control pills
- IUD and implant services
- Emergency contraception

## Making Your Choice

Consider these factors:
1. How often you have sex
2. Your budget
3. Whether you want STI protection
4. Your comfort with hormones
5. How much maintenance you want

**Always consult with a healthcare provider** to discuss which method is best for your individual needs and health history.

## Resources
- Campus Health Center
- Planned Parenthood
- Your primary care doctor
    `,
    author: 'Stay-Safe Health Team',
    readTime: 8,
    tags: ['contraception', 'birth-control', 'student-health', 'prevention'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
  },
  {
    title: 'STI Prevention and Testing: What Students Need to Know',
    slug: 'sti-prevention-testing-guide',
    category: 'sti-prevention',
    summary: 'Essential information about sexually transmitted infections, how to prevent them, and where to get tested on and near campus.',
    content: `
# STI Prevention and Testing: What Students Need to Know

Sexually transmitted infections (STIs) are common among young adults, but most are preventable and treatable.

## Common STIs

### Chlamydia
- Very common, often no symptoms
- Easily treated with antibiotics
- Can cause serious complications if untreated

### Gonorrhea
- Common, may cause discharge or pain
- Treated with antibiotics
- Important to test for alongside chlamydia

### HPV (Human Papillomavirus)
- Most common STI
- Usually clears on its own
- Vaccine available (recommended for students)

### Herpes (HSV)
- Very common, causes sores
- No cure, but manageable with medication
- Can be transmitted even without symptoms

### HIV
- Serious but manageable with treatment
- Prevention methods: PrEP, condoms, regular testing
- Early detection is crucial

## Prevention Strategies

1. **Use condoms consistently** - Most effective STI prevention
2. **Get vaccinated** - HPV vaccine protects against cancer-causing strains
3. **Get tested regularly** - At least annually, or more if you have multiple partners
4. **Communicate** - Talk with partners about STI status
5. **Consider PrEP** - If at high risk for HIV

## Testing Recommendations

- **Sexually active under 25**: Test for chlamydia and gonorrhea annually
- **New partner**: Get tested before having sex
- **Multiple partners**: Test every 3-6 months
- **Unprotected sex**: Get tested 2 weeks after exposure

## Where to Get Tested

**On Campus:**
- Campus Health Center (often free for students)
- Student health insurance usually covers testing

**Off Campus:**
- Planned Parenthood
- Local health departments
- Private clinics

## What to Expect

1. Urine sample (most common)
2. Swab test (for some STIs)
3. Blood test (for HIV, herpes)
4. Results in 1-2 weeks
5. Treatment provided if positive

## If You Test Positive

- Don't panic - most STIs are treatable
- Follow treatment instructions completely
- Inform recent partners
- Abstain from sex until treatment complete
- Get retested after treatment

## Confidentiality

All STI testing and treatment is confidential. Campus health centers cannot share your information without consent.

**Remember:** Getting tested is responsible and caring for yourself and partners.
    `,
    author: 'Stay-Safe Health Team',
    readTime: 10,
    tags: ['sti', 'testing', 'prevention', 'sexual-health'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
  },
  {
    title: 'Consent and Healthy Relationships in University',
    slug: 'consent-healthy-relationships',
    category: 'relationships',
    summary: 'Understanding consent, recognizing healthy vs unhealthy relationship patterns, and building respectful connections.',
    content: `
# Consent and Healthy Relationships in University

Building healthy relationships and understanding consent are essential skills for university life.

## Understanding Consent

### What is Consent?
Consent is an **enthusiastic, clear, and voluntary** agreement to engage in sexual activity.

### Key Principles

**1. Freely Given**
- No pressure, manipulation, or coercion
- Can be withdrawn at any time
- Must be given by someone able to consent

**2. Enthusiastic**
- Should be a clear "yes," not just absence of "no"
- Uncertain or hesitant responses require checking in

**3. Specific**
- Consent to one thing doesn't mean consent to everything
- Previous consent doesn't mean automatic future consent

**4. Informed**
- Person knows what they're agreeing to
- Not based on lies or deception

**5. Sober**
- Cannot consent when intoxicated
- If someone is drunk, they cannot consent

## Asking for Consent

Good examples:
- "Are you comfortable with this?"
- "Do you want to...?"
- "Is this okay?"
- "Can I...?"
- "How do you feel about...?"

## Signs of Healthy Relationships

**Communication**
- Open and honest dialogue
- Active listening
- Expressing needs and boundaries

**Respect**
- Valuing each other's opinions
- Respecting boundaries
- Supporting independence

**Trust**
- Feeling secure
- Being reliable
- Maintaining confidentiality

**Equality**
- Shared decision-making
- Mutual compromise
- Equal effort

## Red Flags to Watch For

**Controlling Behavior**
- Monitoring your phone or social media
- Telling you what to wear
- Isolating you from friends/family

**Jealousy and Possessiveness**
- Excessive jealousy
- Accusations of cheating without cause
- Treating you as property

**Disrespect**
- Insulting or degrading you
- Dismissing your feelings
- Public embarrassment

 **Pressure**
- Pushing you to do things you're uncomfortable with
- Guilt-tripping
- Making you feel obligated

## Setting Boundaries

1. **Know your limits** - What are you comfortable/uncomfortable with?
2. **Communicate clearly** - State boundaries directly
3. **Be consistent** - Don't waffle on important boundaries
4. **Don't apologize** - Your boundaries are valid
5. **Enforce consequences** - If boundaries are violated, take action

## If Something Doesn't Feel Right

Trust your instincts. If a relationship or situation feels wrong:

1. Talk to someone you trust
2. Contact campus resources:
   - Counseling services
   - Title IX coordinator
   - Campus security (if in danger)
3. Create a safety plan if needed

## Resources

- **Campus Counseling**: Confidential support
- **Title IX Office**: Report sexual misconduct
- **Student Health**: Medical care and referrals
- **RAINN National Sexual Assault Hotline**: 1-800-656-4673

**Remember:** You deserve relationships built on respect, trust, and mutual care.
    `,
    author: 'Stay-Safe Health Team',
    readTime: 12,
    tags: ['consent', 'relationships', 'boundaries', 'safety'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  },
  {
    title: 'Managing Menstrual Health in University',
    slug: 'managing-menstrual-health',
    category: 'menstrual-health',
    summary: 'Tips for managing periods, understanding menstrual health, and accessing products and care on campus.',
    content: `
# Managing Menstrual Health in University

Navigating menstrual health while balancing classes, activities, and social life can be challenging. Here's what you need to know.

## Understanding Your Cycle

### Normal Cycle Length
- 21-35 days between periods
- Periods lasting 2-7 days
- Some irregularity is normal, especially in teens/young adults

### What's Normal vs. Concerning

**Normal:**
- Some cramping
- Mood changes before period
- Slight cycle variations
- Flow changes with stress or lifestyle

**See a healthcare provider if:**
- Severe pain that interferes with daily activities
- Very heavy bleeding (soaking through pad/tampon every 1-2 hours)
- Periods lasting longer than 7 days
- Missing periods (if not pregnant)
- Bleeding between periods

## Managing Period Pain

### Natural Remedies
- Heat therapy (heating pad, hot water bottle)
- Gentle exercise (walking, yoga, stretching)
- Staying hydrated
- Adequate sleep
- Reducing caffeine and salt

### Over-the-Counter Options
- Ibuprofen (Advil, Motrin) - most effective for cramps
- Naproxen (Aleve)
- Acetaminophen (Tylenol)

**Tip:** Start pain medication when cramps begin, not after they're severe.

### When to Seek Help
If OTC medications don't help, talk to a healthcare provider about:
- Prescription pain relief
- Hormonal birth control to reduce symptoms
- Checking for underlying conditions (endometriosis, PCOS)

## Period Product Options

### Pads
- **Pros**: Easy to use, no insertion
- **Cons**: Can shift, may feel bulky
- **Cost**: $5-10/month

### Tampons
- **Pros**: Internal, good for swimming
- **Cons**: Must change frequently, TSS risk if left too long
- **Cost**: $5-10/month

### Menstrual Cups
- **Pros**: Reusable, eco-friendly, 12-hour wear
- **Cons**: Learning curve, initial cost
- **Cost**: $20-40 one-time, lasts years

### Period Underwear
- **Pros**: Reusable, comfortable, good for light days
- **Cons**: Upfront cost, need backups
- **Cost**: $15-40/pair

## Free Products on Campus

Many universities now offer free menstrual products:
- Campus health center
- Residence hall bathrooms
- Student union restrooms
- Student emergency funds

Check your campus resources!

## Tracking Your Cycle

Benefits of tracking:
- Predict when periods will come
- Notice patterns
- Identify irregularities
- Share information with healthcare providers

**Apps to try:**
- Clue
- Flo
- Period Tracker

## Period Emergencies

### Unprepared on Campus
- Check bathroom dispensers
- Visit campus health center
- Ask a friend
- Use toilet paper as temporary solution

### Period Stains
- Rinse with cold water ASAP
- Tie sweatshirt around waist
- Keep emergency supplies in backpack

## Birth Control and Periods

Many birth control methods can help with:
- Reducing cramps
- Lighter periods
- More regular cycles
- Some even eliminate periods

Talk to campus health about options.

## When Stress Affects Your Cycle

University stress can impact periods:
- Missed periods
- Irregular timing
- Heavier or lighter flow

**Managing stress helps:**
- Regular sleep schedule
- Healthy eating
- Exercise
- Stress management techniques
- Counseling if needed

## Creating a Period Care Kit

Keep these in your backpack:
- 2-3 tampons or pads
- Panty liners
- Pain reliever
- Small pack of wipes
- Extra underwear
- Dark-colored pants or skirt

**Remember:** Menstrual health is overall health. Don't hesitate to seek help if something doesn't feel right.
    `,
    author: 'Stay-Safe Health Team',
    readTime: 9,
    tags: ['menstrual-health', 'periods', 'womens-health', 'self-care'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
  },
  {
    title: 'Mental Health and Sexual Wellness',
    slug: 'mental-health-sexual-wellness',
    category: 'mental-health',
    summary: 'Understanding the connection between mental health and sexual wellness, and finding support when you need it.',
    content: `
# Mental Health and Sexual Wellness

Mental health and sexual health are deeply connected. Taking care of both is essential for overall wellbeing.

## The Connection

### How Mental Health Affects Sexual Health

**Anxiety and Depression**
- Can decrease libido
- May affect arousal and satisfaction
- Can impact relationship quality
- Might make it harder to communicate about sex

**Stress**
- Reduces sexual desire
- Can cause physical symptoms (pain, dysfunction)
- Affects energy and mood
- Impacts relationships

**Body Image Issues**
- Affects confidence in intimate situations
- May lead to avoiding sexual activity
- Can impact enjoyment

### How Sexual Health Affects Mental Health

**Positive impacts:**
- Intimacy can improve mood
- Physical connection reduces stress
- Builds self-confidence
- Strengthens relationships

**Negative impacts:**
- Sexual concerns can cause anxiety
- STI worries can be stressful
- Relationship issues affect mental health
- Sexual assault trauma needs support

## Common Concerns

### Low Libido

**Causes:**
- Stress, anxiety, depression
- Medications (including some antidepressants)
- Hormonal changes
- Relationship issues
- Lack of sleep

**What helps:**
- Managing stress
- Talking to healthcare provider about medication adjustments
- Couples counseling
- Self-care and rest

### Performance Anxiety

**Symptoms:**
- Worry about sexual ability
- Fear of disappointing partner
- Difficulty with arousal or orgasm
- Avoiding sexual situations

**Strategies:**
- Open communication with partner
- Reduce pressure (focus on intimacy, not performance)
- Relaxation techniques
- Consider counseling

### Sexual Dysfunction

**Types:**
- Erectile dysfunction
- Difficulty with arousal
- Pain during sex
- Inability to orgasm

**When to seek help:**
- If it's causing distress
- If it's affecting your relationships
- If it persists for several months

**Where to get help:**
- Campus health center
- Mental health counseling
- Sexual health specialist

## Trauma and Sexual Health

### Impact of Sexual Assault

Survivors may experience:
- PTSD symptoms
- Anxiety about intimacy
- Difficulty trusting
- Physical pain or discomfort
- Changes in sexual desire

### Healing and Support

**Resources:**
- Campus counseling (specialized trauma therapy)
- Sexual assault support centers
- RAINN Hotline: 1-800-656-4673
- Support groups
- Title IX coordinator

**Remember:** Healing is possible, and it's not your fault.

## Healthy Coping Strategies

### For Stress and Anxiety
1. **Regular exercise** - Reduces stress hormones
2. **Mindfulness/meditation** - Calms anxious thoughts
3. **Adequate sleep** - Improves mood and energy
4. **Social connection** - Reduces isolation
5. **Professional help** - Therapy is effective

### For Body Image
1. **Challenge negative thoughts**
2. **Practice self-compassion**
3. **Focus on what your body can do**
4. **Limit social media**
5. **Surround yourself with positive influences**

### For Relationship Stress
1. **Communicate openly**
2. **Set boundaries**
3. **Make time for connection**
4. **Seek couples counseling if needed**
5. **Maintain independence**

## When to Seek Professional Help

See a mental health professional if you experience:
- Persistent sadness or anxiety
- Loss of interest in activities
- Difficulty functioning in daily life
- Thoughts of self-harm
- Trauma symptoms
- Relationship distress

## Campus Resources

**Counseling Services**
- Individual therapy
- Group therapy
- Crisis support
- Often free for students

**Health Center**
- Medical care for sexual health concerns
- Referrals to specialists
- Prescription management

**Peer Support**
- Student wellness groups
- Mental health awareness organizations
- LGBTQ+ support groups

**Crisis Resources**
- Campus crisis line
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741

## Self-Care for Sexual and Mental Wellness

Daily practices:
- **Sleep hygiene** - Consistent schedule
- **Nutrition** - Balanced meals
- **Movement** - Regular exercise
- **Connection** - Quality time with others
- **Boundaries** - Saying no when needed
- **Joy** - Activities you enjoy

**Remember:** Taking care of your mental health is taking care of your sexual health, and vice versa. Both deserve attention and care.
    `,
    author: 'Stay-Safe Health Team',
    readTime: 11,
    tags: ['mental-health', 'wellness', 'anxiety', 'self-care'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  },
  {
    title: 'Pregnancy Prevention and Options',
    slug: 'pregnancy-prevention-options',
    category: 'pregnancy',
    summary: 'Understanding pregnancy prevention, recognizing early signs, and knowing your options if facing an unplanned pregnancy.',
    content: `
# Pregnancy Prevention and Options

Understanding pregnancy prevention and your options is crucial for making informed decisions about your reproductive health.

## Prevention Methods

### Highly Effective (Over 99%)
- **IUD** (hormonal or copper)
- **Implant**
- **Sterilization**

### Very Effective (91-99%)
- **Birth control shot** (Depo-Provera)
- **Birth control pills** (with perfect use)
- **Patch**
- **Ring**

### Moderately Effective (78-87%)
- **Condoms** (external)
- **Internal condoms**
- **Diaphragm**

### Not Recommended as Sole Method
- Withdrawal
- Fertility awareness (requires extensive training)
- Spermicide alone

## Emergency Contraception

### When to Use
- Unprotected sex
- Condom broke
- Missed birth control pills
- Sexual assault

### Options

**Plan B (Levonorgestrel)**
- Available over the counter
- Most effective within 72 hours
- Cost: $25-50
- Can be used up to 5 days after

**Ella (Ulipristal Acetate)**
- Requires prescription
- Effective up to 5 days
- More effective than Plan B for people over 155 lbs
- Cost: Around $50

**Copper IUD**
- Most effective emergency contraception (over 99%)
- Can be inserted up to 5 days after unprotected sex
- Bonus: Provides ongoing contraception
- Requires appointment

**Where to Get EC:**
- Pharmacy (Plan B)
- Campus health center
- Planned Parenthood
- Doctor's office

## Early Pregnancy Signs

Common symptoms (usually start 2-3 weeks after conception):
- Missed period
- Nausea
- Breast tenderness
- Fatigue
- Frequent urination
- Light spotting

**Important:** The only way to confirm pregnancy is through a test.

## Pregnancy Testing

### When to Test
- At least 1 week after missed period for most accurate results
- Some sensitive tests work earlier

### Where to Get Tests
- Dollar stores (just as accurate as expensive ones!)
- Pharmacy
- Campus health center (often free)
- Planned Parenthood

### How to Test
1. Use first morning urine
2. Follow package directions
3. Wait full time before checking
4. If negative but still no period, test again in a week

## If You're Pregnant

### First Steps
1. **Confirm with healthcare provider** - Get official confirmation
2. **Calculate timing** - When did conception likely occur?
3. **Consider your options** - Take time to think
4. **Seek support** - Talk to trusted people

### Your Options

**Parenting**
- Continuing pregnancy and raising child
- Support available: WIC, childcare assistance, student parent resources

**Adoption**
- Continuing pregnancy and placing for adoption
- Open, semi-open, or closed adoption options
- Adoption agencies provide support

**Abortion**
- Ending the pregnancy
- Legal options vary by state and timing
- Multiple methods available depending on how far along

### Getting Information

**Unbiased counseling:**
- Campus health center
- Planned Parenthood
- All-options pregnancy counseling

**What to know:**
- All options are valid
- You have time to decide
- You can change your mind initially
- Support is available for any choice

## Financial Considerations

### If Continuing Pregnancy
- Health insurance coverage
- WIC program
- Student parent resources
- Housing assistance
- Childcare programs

### If Choosing Abortion
- Cost: $300-950+ depending on method and timing
- Insurance may cover
- Abortion funds available in many states
- Campus resources may help

## Support Resources

**Campus Resources:**
- Student health services
- Counseling services
- Financial aid office (for student parents)
- Academic advising

**Community Resources:**
- Planned Parenthood: 1-800-230-7526
- All-Options Talkline: 1-888-493-0092
- Pregnancy decision support

**For Student Parents:**
- Campus childcare
- Student parent organizations
- Academic accommodations
- Financial assistance programs

## Academic Considerations

**Your Rights:**
- Title IX protects pregnant students
- Entitled to reasonable accommodations
- Cannot be forced to take leave
- Right to make up missed work

**Accommodations May Include:**
- Excused absences for appointments
- Extensions on assignments
- Alternative testing arrangements
- Lactation spaces (if continuing pregnancy)

## Taking Care of Yourself

Regardless of your decision:
- Seek emotional support
- Take care of physical health
- Connect with resources
- Be kind to yourself
- Make decisions that are right for YOU

**Remember:** This is your decision. You deserve accurate information, supportive counseling, and access to whatever option you choose.
    `,
    author: 'Stay-Safe Health Team',
    readTime: 13,
    tags: ['pregnancy', 'contraception', 'options', 'student-support'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
  },
];

// Sample Campus Resources
const resources = [
  {
    name: 'University of Nairobi Health Services',
    type: 'on-campus',
    category: 'general',
    address: 'Main Campus, Harry Thuku Road',
    city: 'Nairobi',
    phone: '+254-20-4913000',
    email: 'health@uonbi.ac.ke',
    website: 'https://www.uonbi.ac.ke',
    hours: 'Monday-Friday: 8:00 AM - 5:00 PM',
    services: ['STI Testing', 'Contraception', 'General Healthcare', 'Counseling Referrals', 'Emergency Care'],
    costInfo: 'Free for registered students',
    studentFriendly: true,
    freeServices: ['Condoms', 'Basic STI Testing', 'Consultations'],
    latitude: -1.2794,
    longitude: 36.8155,
    verified: true,
  },
  {
    name: 'Kenyatta University Health Unit',
    type: 'on-campus',
    category: 'general',
    address: 'Kenyatta University Main Campus',
    city: 'Nairobi',
    phone: '+254-20-8703911',
    website: 'https://www.ku.ac.ke',
    hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM',
    services: ['Medical Consultations', 'STI Testing', 'Family Planning', 'Mental Health Support', 'Vaccinations'],
    costInfo: 'Free for students with valid ID',
    studentFriendly: true,
    freeServices: ['Consultations', 'Condoms', 'Basic medications'],
    latitude: -1.1707,
    longitude: 36.9300,
    verified: true,
  },
  {
    name: 'Strathmore University Wellness Center',
    type: 'on-campus',
    category: 'general',
    address: 'Ole Sangale Road, Madaraka',
    city: 'Nairobi',
    phone: '+254-703-034000',
    email: 'wellness@strathmore.edu',
    website: 'https://www.strathmore.edu',
    hours: 'Monday-Friday: 8:00 AM - 5:00 PM',
    services: ['Health Consultations', 'Mental Health Counseling', 'Reproductive Health', 'Nutrition Advice'],
    costInfo: 'Free for students',
    studentFriendly: true,
    freeServices: ['All services free for students'],
    latitude: -1.3089,
    longitude: 36.8107,
    verified: true,
  },
  {
    name: 'Marie Stopes Kenya - Nairobi Clinic',
    type: 'clinic',
    category: 'reproductive-health',
    address: 'Mara Road, Upper Hill',
    city: 'Nairobi',
    phone: '+254-709-830000',
    email: 'info@mariestopes.or.ke',
    website: 'https://www.mariestopes.or.ke',
    hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM',
    services: ['Family Planning', 'STI Testing & Treatment', 'Pregnancy Testing', 'Counseling', 'Safe Abortion Services'],
    costInfo: 'Sliding scale fees, student discounts available',
    studentFriendly: true,
    freeServices: ['Counseling', 'Some contraceptives'],
    latitude: -1.2921,
    longitude: 36.8219,
    verified: true,
  },
  {
    name: 'LVCT Health - Nairobi',
    type: 'clinic',
    category: 'testing',
    address: 'Jabavu Road, Kilimani',
    city: 'Nairobi',
    phone: '+254-20-2715639',
    email: 'info@lvcthealth.org',
    website: 'https://www.lvcthealth.org',
    hours: 'Monday-Friday: 8:00 AM - 5:00 PM',
    services: ['HIV Testing & Counseling', 'PrEP Services', 'STI Testing', 'Youth-Friendly Services'],
    costInfo: 'Free HIV/STI testing, some services subsidized',
    studentFriendly: true,
    freeServices: ['HIV Testing', 'STI Screening', 'Counseling'],
    latitude: -1.2906,
    longitude: 36.7820,
    verified: true,
  },
  {
    name: 'Nairobi West Hospital',
    type: 'clinic',
    category: 'emergency',
    address: 'Nairobi West, Madaraka Estate',
    city: 'Nairobi',
    phone: '+254-20-6003000',
    website: 'https://www.nairobiwest.hospital.org',
    hours: '24/7 Emergency Services',
    services: ['Emergency Care', 'Sexual Assault Care', 'STI Treatment', 'Reproductive Health', 'Mental Health'],
    costInfo: 'Accepts insurance, cash payments, payment plans available',
    studentFriendly: true,
    latitude: -1.3107,
    longitude: 36.8050,
    verified: true,
  },
  {
    name: 'Goodlife Pharmacy - Westlands',
    type: 'pharmacy',
    category: 'contraception',
    address: 'Woodvale Grove, Westlands',
    city: 'Nairobi',
    phone: '+254-709-690000',
    website: 'https://www.goodlife.co.ke',
    hours: 'Monday-Sunday: 7:00 AM - 10:00 PM',
    services: ['Emergency Contraception', 'Condoms', 'Pregnancy Tests', 'OTC Medications'],
    costInfo: 'Standard pharmacy prices, accepts M-Pesa',
    studentFriendly: true,
    latitude: -1.2630,
    longitude: 36.8063,
    verified: true,
  },
  {
    name: 'Nairobi Women\'s Hospital',
    type: 'clinic',
    category: 'womens-health',
    address: 'Argwings Kodhek Road, Hurlingham',
    city: 'Nairobi',
    phone: '+254-20-7202000',
    email: 'info@nbiwhospital.org',
    website: 'https://www.nairobiwomenshospital.org',
    hours: 'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 8:00 AM - 4:00 PM',
    services: ['Gynecological Care', 'Family Planning', 'STI Testing', 'Pregnancy Care', 'Mental Health'],
    costInfo: 'Accepts insurance, student payment plans available',
    studentFriendly: true,
    latitude: -1.2839,
    longitude: 36.7826,
    verified: true,
  },
  {
    name: 'Ampath Sexual & Reproductive Health Clinic',
    type: 'clinic',
    category: 'reproductive-health',
    address: 'Eldoret Road, Westlands',
    city: 'Nairobi',
    phone: '+254-20-2731300',
    website: 'https://www.ampathkenya.org',
    hours: 'Monday-Friday: 8:00 AM - 5:00 PM',
    services: ['Comprehensive STI Testing', 'HIV Services', 'Family Planning', 'Youth Services', 'Counseling'],
    costInfo: 'Highly subsidized or free services',
    studentFriendly: true,
    freeServices: ['HIV Testing', 'Counseling', 'Some STI tests'],
    latitude: -1.2667,
    longitude: 36.8102,
    verified: true,
  },
  {
    name: 'Gender Violence Recovery Centre',
    type: 'counseling',
    category: 'emergency',
    address: 'Nairobi Hospital, Argwings Kodhek Road',
    city: 'Nairobi',
    phone: '+254-719-638006',
    website: 'https://www.gvrc.or.ke',
    hours: '24/7 Hotline, Clinic: Monday-Friday 8AM-5PM',
    services: ['Sexual Assault Care', 'Trauma Counseling', 'Legal Support', 'Medical Care', 'Crisis Intervention'],
    costInfo: 'Free services for survivors',
    studentFriendly: true,
    freeServices: ['All services free'],
    latitude: -1.2885,
    longitude: 36.8076,
    verified: true,
  },
];

// Seed the database
async function seed() {
  try {
    console.log('Creating articles...');
    for (const article of articles) {
      articlesService.createArticle(article);
      console.log(`   ✓ Created: ${article.title}`);
    }

    console.log('\nCreating campus resources...');
    for (const resource of resources) {
      resourcesService.createResource(resource);
      console.log(`   ✓ Created: ${resource.name}`);
    }

    console.log('\n Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`   - ${articles.length} articles created`);
    console.log(`   - ${resources.length} campus resources created`);
    console.log(`\nYou can now access:`);
    console.log(`   - GET /api/articles`);
    console.log(`   - GET /api/resources`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();