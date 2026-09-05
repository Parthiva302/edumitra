import { 
  TeacherPersona, 
  LessonPlan, 
  LearningPath, 
  UploadedMaterial, 
  AssessmentQuestion,
  LearningReportData,
  StudentProfile,
  UserDataBundle
} from '../types';

export const TEACHER_PERSONAS: TeacherPersona[] = [
  {
    id: 'priya',
    name: 'Dr. Priya Sharma',
    role: 'Senior Professor of Physics & AI',
    specialty: 'Conceptual Physics, STEM & Applied AI',
    languages: ['English', 'Hindi', 'Hinglish', 'Telugu'],
    bio: '12+ years of teaching experience. Specializes in intuitive analogies, visual breakdowns, and patient step-by-step guidance.',
    avatarImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    accentColor: '#4f46e5',
    voiceType: 'female'
  },
  {
    id: 'marcus',
    name: 'Prof. Marcus Reed',
    role: 'Faculty of Computer Science',
    specialty: 'Machine Learning, Algorithms & Systems',
    languages: ['English', 'Spanish', 'German'],
    bio: 'Former ML researcher at MIT. Passionate about hands-on coding, architectural diagrams, and first-principles reasoning.',
    avatarImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    accentColor: '#0284c7',
    voiceType: 'male'
  },
  {
    id: 'aditi',
    name: 'Dr. Aditi Rao',
    role: 'Associate Professor of Biosciences',
    specialty: 'Biology, Biochemistry & Bioengineering',
    languages: ['English', 'Hindi', 'Tamil'],
    bio: 'Award-winning educator known for high-clarity 3D biological pathways and interactive conceptual questioning.',
    avatarImage: 'https://images.unsplash.com/photo-1580894732484-90a612543d3b?auto=format&fit=crop&w=600&q=80',
    accentColor: '#059669',
    voiceType: 'female'
  },
  {
    id: 'david',
    name: 'Prof. David Chen',
    role: 'Professor of Applied Mathematics',
    specialty: 'Calculus, Linear Algebra & Quantitative Analysis',
    languages: ['English', 'Mandarin', 'French'],
    bio: 'Dedicated to demystifying complex formulas through dynamic graphing, step derivations, and zero-jargon intuition.',
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    accentColor: '#d97706',
    voiceType: 'male'
  }
];

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  name: 'Aryan Verma',
  email: 'aryan.verma@edumitra.ai',
  level: 'beginner',
  preferredLanguage: 'hinglish',
  selectedAvatar: 'priya',
  overallMastery: 84,
  completedLessons: 18,
  learningTimeHours: 14.5,
  masteredConceptsCount: 42,
  recentLessons: [
    {
      id: 'rec_1',
      title: 'Electricity & Ohm’s Law',
      subject: 'Physics',
      score: 82,
      duration: '20 min',
      date: 'Today',
      status: 'Ready for Review'
    },
    {
      id: 'rec_2',
      title: 'Newton’s Laws of Motion',
      subject: 'Physics',
      score: 95,
      duration: '25 min',
      date: 'Yesterday',
      status: 'Mastered'
    },
    {
      id: 'rec_3',
      title: 'Python Functions & Scope',
      subject: 'Computer Science',
      score: 88,
      duration: '15 min',
      date: '3 days ago',
      status: 'Mastered'
    }
  ],
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  captionsEnabled: true,
  reducedMotion: false,
  fontSize: 'normal',
  volume: 85,
  soundEnabled: true
};

export const DEFAULT_STUDENT_PROFILE = DEMO_STUDENT_PROFILE;

export const DEMO_ELECTRICITY_LESSON: LessonPlan = {
  id: 'lesson_physics_electricity_01',
  title: 'Electricity & Ohm’s Law',
  subject: 'Physics — Chapter 4',
  category: 'Physics & Electrical Circuits',
  sourceType: 'topic',
  sourceName: 'Physics — Electricity — Chapter 4',
  level: 'beginner',
  goal: 'understand_concept',
  language: 'hinglish',
  duration: '20m',
  style: 'simple_visual',
  totalEstimatedMinutes: 20,
  createdAt: '2026-09-01',
  steps: [
    {
      id: 'step_1_current',
      stepNumber: '01',
      title: 'Current (I) — Flow of Charge',
      concept: 'Electric Current',
      estimatedMinutes: 3,
      teacherDialogue: "Welcome to today's session! Let's understand Electric Current. Imagine a river where water molecules flow. In a wire, Electric Current is simply the rate of flow of electric charges (electrons) through any cross-section per second. It is measured in Amperes (A), where 1 Ampere equals 1 Coulomb of charge flowing per second.",
      dialogueTranslations: {
        en: "Welcome! Let's understand Electric Current. Electric current is the rate of flow of electric charges (electrons) through a conductor per unit time, measured in Amperes (A).",
        hi: "नमस्ते! आज हम विद्युत धारा (Electric Current) समझेंगे। विद्युत धारा किसी चालक में प्रति सेकंड प्रवाहित होने वाले आवेश की दर है, जिसे एम्पीयर (A) में मापा जाता है।",
        hinglish: "Namaste! Aaj hum Electric Current samjhenge. Jaise river mein paani flow karta hai, waise hi conductor wire ke andar charges (electrons) ka flow hona Electric Current kehlata hai. Iski unit Amperes (A) hoti hai.",
        te: "స్వాగతం! ఈ రోజు మనం విద్యుత్ ప్రవాహం (Electric Current) గురించి నేర్చుకుందాం. ఒక వాహకం గుండా ప్రతి సెకనుకు ప్రవహించే ఆవేశాల రేటును కరెంట్ అంటారు."
      },
      subtitles: [
        { text: "Welcome! Today we will master Electric Current and Ohm's Law.", start: 0, end: 3.5 },
        { text: "Electric current is the continuous flow of charges (electrons) through a wire.", start: 3.6, end: 7.2 },
        { text: "It is measured in Amperes (A) where I = Q / t (Coulombs per second).", start: 7.3, end: 11.0 }
      ],
      visualType: 'concept_card',
      visualData: {
        title: "Electric Current (I)",
        formula: "I = \\frac{Q}{t}",
        unit: "Amperes (A) = Coulombs / second",
        points: [
          "Direction of conventional current is positive to negative terminal.",
          "Actual electron flow is from negative to positive.",
          "1 Ampere = 6.24 × 10¹⁸ electrons passing through a cross-section per second."
        ],
        particleCount: 18,
        chargeType: "negative"
      }
    },
    {
      id: 'step_2_voltage',
      stepNumber: '02',
      title: 'Voltage (V) — Electrical Potential Difference',
      concept: 'Voltage & Potential',
      estimatedMinutes: 3,
      teacherDialogue: "Now, why do electrons move at all? Because of Voltage! Think of Voltage as the electrical 'pressure' or push provided by a battery. It is the work done to move a unit positive charge between two points in a circuit. Without voltage, electrons just jiggle randomly without net flow.",
      dialogueTranslations: {
        en: "Why do charges flow? Because of Voltage (Electric Potential Difference). It acts as the electrical pressure pushing electrons through the circuit, measured in Volts (V).",
        hi: "आवेश प्रवाहित क्यों होते हैं? वोल्टेज के कारण! वोल्टेज वह विद्युत दबाव (Electrical Pressure) है जो इलेक्ट्रॉनों को परिपथ में धकेलता है। इसे वोल्ट (V) में मापा जाता है।",
        hinglish: "Charges flow kyun karte hain? Voltage ki wajah se! Battery ek electrical 'pressure' ya pump ki tarah kaam karti hai jo electrons ko aage dhakelti hai. Isko Volts (V) mein measure karte hain.",
        te: "ఛార్జీలు ఎందుకు ప్రవహిస్తాయి? వోల్టేజ్ వల్ల! వోల్టేజ్ అనేది ఎలక్ట్రాన్లను నెట్టే విద్యుత్ పీడనం."
      },
      subtitles: [
        { text: "Why do charges flow? Because of Voltage (Potential Difference).", start: 0, end: 3.2 },
        { text: "Voltage is the electrical pressure created by a battery or power source.", start: 3.3, end: 7.0 },
        { text: "Formula: V = W / Q (Joules per Coulomb = Volts).", start: 7.1, end: 10.5 }
      ],
      visualType: 'concept_card',
      visualData: {
        title: "Voltage / Potential Difference (V)",
        formula: "V = \\frac{W}{Q}",
        unit: "Volts (V) = Joules / Coulomb",
        points: [
          "Creates the electric field inside conductors.",
          "Supplied by batteries, generators, or power supplies.",
          "Higher voltage creates a stronger push on electrons."
        ],
        batteryVoltage: 9
      }
    },
    {
      id: 'step_3_resistance',
      stepNumber: '03',
      title: 'Resistance (R) — Opposition to Flow',
      concept: 'Electrical Resistance',
      estimatedMinutes: 3,
      teacherDialogue: "Every conductor isn't completely open. As electrons travel, they bump into metal atoms! This obstruction or opposition to current flow is called Resistance (R). It is measured in Ohms (Ω). High resistance means it is harder for current to pass.",
      dialogueTranslations: {
        en: "As electrons travel, they collide with atoms. This opposition to current flow is Resistance (R), measured in Ohms (Ω).",
        hi: "जब इलेक्ट्रॉन तार में चलते हैं, तो वे परमाणुओं से टकराते हैं। धारा के मार्ग में आने वाली इस रुकावट को प्रतिरोध (Resistance) कहते हैं, जिसे ओम (Ω) में मापा जाता है।",
        hinglish: "Jaise electrons wire mein chalte hain, wo metal atoms se takrate hain. Is friction ya rukawat ko Resistance (R) kehte hain, aur iska unit Ohms (Ω) hota hai.",
        te: "ఎలక్ట్రాన్లు ప్రయాణించేటప్పుడు పరమాణువులతో ఢీకొంటాయి. ఈ ఆటంకాన్ని నిరోధం (Resistance) అంటారు."
      },
      subtitles: [
        { text: "As electrons move, they collide with atomic lattice ions.", start: 0, end: 3.5 },
        { text: "This opposition to current is called Electrical Resistance (R).", start: 3.6, end: 7.2 },
        { text: "Measured in Ohms (Ω). Higher resistance reduces electron flow.", start: 7.3, end: 11.0 }
      ],
      visualType: 'concept_card',
      visualData: {
        title: "Resistance (R)",
        formula: "R = \\rho \\frac{L}{A}",
        unit: "Ohms (\\Omega)",
        points: [
          "Proportional to length (L) of the wire.",
          "Inversely proportional to cross-sectional area (A).",
          "Depends on the resistivity (ρ) and temperature of the material."
        ]
      }
    },
    {
      id: 'step_4_ohms_law',
      stepNumber: '04',
      title: 'Ohm’s Law — Connecting V, I, and R',
      concept: 'Ohm’s Law Formula',
      estimatedMinutes: 4,
      teacherDialogue: "Now let's bring all three together in Georg Ohm's monumental law: V = I × R. At a constant temperature, Current (I) through a conductor is directly proportional to Voltage (V) and inversely proportional to Resistance (R). Let's experiment with our interactive circuit simulation on the right!",
      dialogueTranslations: {
        en: "Georg Ohm's law connects all three: V = I × R. Current is directly proportional to Voltage and inversely proportional to Resistance. Adjust the controls to see it in action!",
        hi: "जॉर्ज ओम का नियम इन तीनों को जोड़ता है: V = I × R। धारा वोल्टेज के समानुपाती और प्रतिरोध के व्युत्क्रमानुपाती होती है।",
        hinglish: "Georg Ohm ne in teeno ko relate kiya: V = I × R ya I = V / R. Agar voltage badhaoge toh current badhega, par agar resistance badhaoge toh current ghatega. Right side ke circuit mein sliders adjust karke dekho!",
        te: "ఓమ్ నియమం ప్రకారం: V = I × R. కరెంట్ అనేది వోల్టేజ్‌కు అనులోమానుపాతంలోను, నిరోధానికి విలోమానుపాతంలోను ఉంటుంది."
      },
      subtitles: [
        { text: "Georg Ohm proved the mathematical relation: V = I × R.", start: 0, end: 3.8 },
        { text: "Therefore: Current I = V / R, and Resistance R = V / I.", start: 3.9, end: 7.5 },
        { text: "Use the live interactive circuit controls on the right to test different values.", start: 7.6, end: 12.0 }
      ],
      visualType: 'circuit_simulation',
      visualData: {
        initialVoltage: 9,
        initialResistance: 15,
        bulbMaxResistance: 50,
        showCurrentFlow: true
      }
    },
    {
      id: 'step_5_quick_check',
      stepNumber: '05',
      title: 'Interactive Quick Check & Adaptation',
      concept: 'Understanding Check',
      estimatedMinutes: 3,
      teacherDialogue: "Let's pause here for a quick conceptual check! Look at the question on your screen: If resistance increases while voltage remains constant, what happens to the current?",
      dialogueTranslations: {
        en: "Let's pause for a quick check: If resistance increases while voltage remains constant, what happens to the current?",
        hi: "आइए एक त्वरित प्रश्न हल करें: यदि वोल्टेज स्थिर रहे और प्रतिरोध बढ़ जाए, तो विद्युत धारा (Current) पर क्या प्रभाव पड़ेगा?",
        hinglish: "Chalo ek quick check karte hain: Agar voltage constant rahe aur resistance badha di jaye, toh current ka kya hoga?",
        te: "ఒక ప్రశ్న: వోల్టేజ్ స్థిరంగా ఉండి, నిరోధం పెరిగితే కరెంట్ ఏమవుతుంది?"
      },
      subtitles: [
        { text: "Let's test your understanding with a quick conceptual check.", start: 0, end: 3.5 },
        { text: "Select your answer on screen. I'll evaluate and guide you accordingly.", start: 3.6, end: 7.2 }
      ],
      visualType: 'circuit_simulation',
      visualData: {
        initialVoltage: 12,
        initialResistance: 20
      },
      quickCheck: {
        id: 'qc_ohms_01',
        question: "If resistance increases while voltage remains constant, what happens to current?",
        options: [
          {
            id: 'opt_1',
            text: "It increases",
            isCorrect: false,
            misconceptionExplanation: "Misconception detected: You may be thinking current and resistance are directly proportional (increasing together), whereas resistance represents an obstruction that impedes flow."
          },
          {
            id: 'opt_2',
            text: "It decreases",
            isCorrect: true
          },
          {
            id: 'opt_3',
            text: "It stays the same",
            isCorrect: false,
            misconceptionExplanation: "Misconception: Resistance directly alters the ease of electron flow. Constant voltage with more obstruction must change the current."
          },
          {
            id: 'opt_4',
            text: "I'm not sure",
            isCorrect: false,
            misconceptionExplanation: "No worries! Let's build the intuition with a simple real-world analogy."
          }
        ],
        remediationMisconceptionIdentified: "Student thought Current and Resistance are directly proportional or independent.",
        remediationAnalogy: "Think of current like water flowing through a pipe. Voltage is the water pump pressure. Resistance is like a valve tightening or sand clogging the pipe. If the pump pressure (voltage) stays constant, but the pipe gets narrower and harder to flow through (higher resistance), less water (current) passes through per second!",
        remediationDialogue: "You're close! Let's look at this differently with our Water Pipe Analogy. Imagine water being pumped through a hose. Voltage is the pump pressure, current is the water flow rate, and resistance is like squeezing the pipe. If you squeeze the pipe tighter (more resistance), naturally less water flows through! That's why I = V / R means higher resistance reduces current.",
        remediationVisualType: 'water_pipe_analogy',
        remediationVisualData: {
          pipeWidth: "narrow",
          pumpPressure: "constant (12V)",
          valveTightness: "high (40Ω)",
          flowRate: "low (0.3A)"
        },
        remediationRetryQuestion: {
          question: "Now, using our pipe analogy: If a 12V battery is connected and we DOUBLE the resistance from 10Ω to 20Ω, the current will:",
          options: [
            { id: 'retry_1', text: "Be cut in half (Decrease by 50%)", isCorrect: true },
            { id: 'retry_2', text: "Double (Increase by 100%)", isCorrect: false },
            { id: 'retry_3', text: "Remain unchanged", isCorrect: false }
          ]
        }
      }
    },
    {
      id: 'step_6_applications',
      stepNumber: '06',
      title: 'Real-World Applications of Ohm’s Law',
      concept: 'Practical Application',
      estimatedMinutes: 2,
      teacherDialogue: "Ohm's Law powers modern electronics! For example, when you turn a light dimmer knob, you are changing a variable resistor (potentiometer), which changes the current and controls bulb brightness. Fuses in your house use high resistance thin wires that melt safely if current exceeds safety limits.",
      dialogueTranslations: {
        en: "Ohm's Law powers everyday devices: dimmer switches, toaster heating elements, fuses, and smartphone charging circuits.",
        hi: "ओम का नियम हमारे दैनिक उपकरणों में काम करता है: डिमर स्विच, हीटर, फ्यूज और मोबाइल चार्जर।",
        hinglish: "Ohm's Law everyday devices mein use hota hai jaise fan regulator, light dimmer, toaster ke heating coils aur fuse wires.",
        te: "ఓమ్ నియమం ఫ్యాన్ రెగ్యులేటర్లు, హీటర్లు మరియు స్మార్ట్‌ఫోన్ ఛార్జర్లలో ఉపయోగించబడుతుంది."
      },
      subtitles: [
        { text: "Everyday applications: Light dimmers, fan speed regulators, and electric heaters.", start: 0, end: 4.0 },
        { text: "Fuses use calibrated resistance to protect circuits from high current spikes.", start: 4.1, end: 8.0 }
      ],
      visualType: 'concept_card',
      visualData: {
        title: "Real-World Engineering Examples",
        points: [
          "💡 Light Dimmer (Potentiometer): Increases resistance → reduces current → dims the lamp.",
          "🔥 Electric Toaster (Nichrome wire): High resistance generates heat (P = I²R).",
          "🛡️ Safety Fuse: Protects home appliances from high current overloads."
        ]
      }
    },
    {
      id: 'step_7_summary',
      stepNumber: '07',
      title: 'Lesson Recap & Transition to Assessment',
      concept: 'Mastery Summary',
      estimatedMinutes: 2,
      teacherDialogue: "Fantastic effort! You've learned how Current (I), Voltage (V), and Resistance (R) interact through V = I × R, and how to troubleshoot electrical circuits. You are now ready for the final assessment!",
      dialogueTranslations: {
        en: "Excellent work! You have mastered the relationship V = I × R. Let's move to your personalized assessment to evaluate your score.",
        hi: "शानदार काम! आपने V = I × R का संबंध पूरी तरह समझ लिया है। अब आइए आपका मूल्यांकन (Assessment) शुरू करें।",
        hinglish: "Shabaash! Aapne Current, Voltage aur Resistance ka relationship V = I × R ache se samajh liya. Chalo ab final assessment start karte hain!",
        te: "చాలా బాగుంది! మీరు V = I × R సంబంధాన్ని నేర్చుకున్నారు. ఇప్పుడు అసెస్‌మెంట్‌ను ప్రారంభిద్దాం."
      },
      subtitles: [
        { text: "Congratulations on completing the core teaching modules!", start: 0, end: 3.5 },
        { text: "Click 'Start Assessment' when ready to test your mastery.", start: 3.6, end: 7.0 }
      ],
      visualType: 'concept_card',
      visualData: {
        title: "Core Takeaways",
        points: [
          "Current (I) = Flow rate of charges in Amperes (A)",
          "Voltage (V) = Electrical push/potential difference in Volts (V)",
          "Resistance (R) = Obstruction to charge flow in Ohms (Ω)",
          "Formula: V = I × R,  I = V / R,  R = V / I"
        ]
      }
    }
  ]
};

export const DEMO_LESSON_PLAN = DEMO_ELECTRICITY_LESSON;

export const DEMO_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    type: 'mcq',
    question: "According to Ohm's Law, what is the mathematical formula connecting Voltage (V), Current (I), and Resistance (R)?",
    options: ["V = I × R", "V = I / R", "I = V × R", "R = V × I"],
    correctAnswer: "V = I × R",
    explanation: "Ohm's Law states that Voltage equals Current multiplied by Resistance (V = I × R).",
    conceptTested: "Ohm's Law"
  },
  {
    id: 'q2',
    type: 'problem_solving',
    question: "A 12V automotive battery is connected across a headlamp with a resistance of 4 Ohms. What is the current flowing through the circuit?",
    options: ["48 Amperes", "3 Amperes", "8 Amperes", "0.33 Amperes"],
    correctAnswer: "3 Amperes",
    explanation: "Using I = V / R = 12V / 4Ω = 3 Amperes.",
    conceptTested: "Current"
  },
  {
    id: 'q3',
    type: 'conceptual',
    question: "If a circuit's resistance is doubled while the supply voltage remains strictly constant, what happens to the electrical current?",
    options: [
      "Current doubles",
      "Current is halved",
      "Current stays unchanged",
      "Current drops to zero"
    ],
    correctAnswer: "Current is halved",
    explanation: "Since I = V / R, doubling R in the denominator cuts current I in half.",
    conceptTested: "Resistance"
  },
  {
    id: 'q4',
    type: 'application',
    question: "How does a rotational light dimmer switch physically decrease the brightness of a bulb?",
    options: [
      "By increasing resistance, which decreases current to the bulb filament",
      "By reversing the battery polarity",
      "By decreasing resistance to maximum value",
      "By removing voltage entirely"
    ],
    correctAnswer: "By increasing resistance, which decreases current to the bulb filament",
    explanation: "Dimmer potentiometers increase circuit resistance, reducing electron flow and diminishing filament glow.",
    conceptTested: "Ohm's Law"
  },
  {
    id: 'q5',
    type: 'conceptual',
    question: "What physical quantity does 1 Volt actually measure in terms of energy and electric charge?",
    options: [
      "1 Joule of work done per Coulomb of charge",
      "1 Newton of force per second",
      "1 Coulomb of charge per second",
      "1 Watt of power per Ohm"
    ],
    correctAnswer: "1 Joule of work done per Coulomb of charge",
    explanation: "1 Volt = 1 Joule / 1 Coulomb (Work done per unit charge).",
    conceptTested: "Voltage"
  }
];

export const DEMO_LEARNING_REPORT: LearningReportData = {
  lessonId: 'lesson_physics_electricity_01',
  lessonTitle: 'Electricity & Ohm’s Law',
  subject: 'Physics — Chapter 4',
  overallScore: 82,
  conceptMastery: [
    { concept: 'Current (I)', score: 95 },
    { concept: 'Voltage (V)', score: 90 },
    { concept: 'Resistance (R)', score: 62 },
    { concept: 'Ohm’s Law Formula', score: 80 }
  ],
  strongAreas: ['Current (I)', 'Voltage (V)'],
  needsImprovement: ['Resistance (R)', 'Ohm’s Law Application'],
  teacherFeedback: 'You demonstrated strong intuitive comprehension of Current and Voltage. Your primary area for improvement was the inverse relationship of Resistance with Current, which we corrected using the water pipe analogy. You solved the follow-up question accurately!',
  recommendedNextSteps: [
    'Review Resistance & Resistivity factors (Length and Cross-sectional area)',
    'Practice 3 numerical circuit problems',
    'Continue to Electrical Power & Energy (P = V × I = I²R)'
  ],
  date: '2026-09-01'
};

export const DEMO_UPLOADED_MATERIALS: UploadedMaterial[] = [
  {
    id: 'mat_1',
    name: 'NCERT_Physics_Class_10_Chapter_12_Electricity.pdf',
    type: 'PDF',
    size: '4.2 MB',
    pages: 28,
    uploadedAt: 'Sep 1, 2026',
    status: 'indexed',
    keyConceptsExtracted: ['Electric Current', 'Potential Difference', "Ohm's Law", 'Resistors in Series & Parallel', 'Heating Effect'],
    summary: 'Comprehensive high school physics chapter covering electrostatic potential, circuit diagrams, resistance factors, and Joule heating.'
  },
  {
    id: 'mat_2',
    name: 'CS229_Machine_Learning_Supervised_Notes.pdf',
    type: 'PDF',
    size: '8.7 MB',
    pages: 42,
    uploadedAt: 'Aug 28, 2026',
    status: 'indexed',
    keyConceptsExtracted: ['Linear Regression', 'Cost Function', 'Gradient Descent', 'Logistic Regression', 'Overfitting'],
    summary: 'Foundational lecture notes on supervised machine learning, cost minimization algorithms, and loss functions.'
  },
  {
    id: 'mat_3',
    name: 'Operating_Systems_Concurrency_Semaphores.docx',
    type: 'DOCX',
    size: '1.8 MB',
    pages: 14,
    uploadedAt: 'Aug 24, 2026',
    status: 'indexed',
    keyConceptsExtracted: ['Process Synchronization', 'Critical Section', 'Semaphores', 'Deadlock Detection', 'Mutex Locks'],
    summary: 'Detailed study document examining concurrency bugs, race conditions, atomic operations, and banker’s algorithm.'
  },
  {
    id: 'mat_4',
    name: 'Attention_Is_All_You_Need_Transformer_Architecture.paper',
    type: 'PAPER',
    size: '2.3 MB',
    pages: 15,
    uploadedAt: 'Aug 19, 2026',
    status: 'ready',
    keyConceptsExtracted: ['Self-Attention', 'Multi-Head Attention', 'Positional Encoding', 'Encoder-Decoder', 'Feedforward Layers'],
    summary: 'Seminal research paper introducing the Transformer architecture replacing recurrent and convolutional networks.'
  }
];

export const DEMO_LEARNING_PATH: LearningPath = {
  id: 'path_ai_physics',
  title: 'Artificial Intelligence & Machine Learning Track',
  category: 'Computer Science & AI',
  description: 'A master curriculum taking you from foundational mathematics to Transformer architectures and deep neural nets.',
  nodes: [
    {
      id: 'node_1',
      title: 'Python Fundamentals & Data Structures',
      status: 'completed',
      estimatedHours: 4,
      description: 'Variables, loops, list comprehensions, functions, and algorithmic complexity.',
      subTopics: ['Lists & Dicts', 'Recursion', 'Time Complexity']
    },
    {
      id: 'node_2',
      title: 'Linear Algebra & Calculus for ML',
      status: 'completed',
      estimatedHours: 6,
      description: 'Vector spaces, matrix multiplication, partial derivatives, and gradient vectors.',
      subTopics: ['Matrix Operations', 'Gradients', 'Dot Products']
    },
    {
      id: 'node_3',
      title: 'Supervised Learning & Regression',
      status: 'in_progress',
      estimatedHours: 8,
      description: 'Cost function optimization, gradient descent, logistic classification, and regularization.',
      subTopics: ['Linear Regression', 'Cost Function', 'Gradient Descent']
    },
    {
      id: 'node_4',
      title: 'Neural Networks & Backpropagation',
      status: 'locked',
      estimatedHours: 10,
      description: 'Multi-layer perceptrons, activation functions (ReLU, Sigmoid), and chain rule backprop.',
      subTopics: ['Perceptrons', 'Backprop', 'Loss Functions']
    },
    {
      id: 'node_5',
      title: 'Transformers & Large Language Models',
      status: 'locked',
      estimatedHours: 12,
      description: 'Self-attention, query-key-value projections, positional encodings, and modern generative AI.',
      subTopics: ['Self-Attention', 'QKV Matrices', 'Decoder Models']
    }
  ]
};

export const DEMO_USER_DATA: UserDataBundle = {
  profile: DEMO_STUDENT_PROFILE,
  inProgressLesson: {
    id: DEMO_ELECTRICITY_LESSON.id,
    title: DEMO_ELECTRICITY_LESSON.title,
    subject: DEMO_ELECTRICITY_LESSON.subject,
    category: DEMO_ELECTRICITY_LESSON.category,
    level: DEMO_ELECTRICITY_LESSON.level,
    language: DEMO_ELECTRICITY_LESSON.language,
    duration: DEMO_ELECTRICITY_LESSON.duration,
    currentStepIndex: 3,
    totalSteps: DEMO_ELECTRICITY_LESSON.steps.length,
    currentConcept: 'Ohm’s Law Formula',
    progressPercentage: 57,
    lastPosition: 'Step 4 of 7',
    steps: DEMO_ELECTRICITY_LESSON.steps,
    updatedAt: '2026-09-01'
  },
  documents: DEMO_UPLOADED_MATERIALS,
  assessments: [DEMO_LEARNING_REPORT],
  conceptMastery: [
    { concept: 'Electric Current', score: 95, status: 'Mastered' },
    { concept: 'Voltage & Potential', score: 90, status: 'Mastered' },
    { concept: 'Electrical Resistance', score: 62, status: 'Learning' },
    { concept: 'Ohm’s Law Formula', score: 80, status: 'Mastered' },
    { concept: 'Series & Parallel', score: 45, status: 'Review Needed' }
  ],
  learningPath: DEMO_LEARNING_PATH,
  learningHistory: [
    {
      id: 'hist_1',
      lessonTitle: 'Electricity & Ohm’s Law',
      subject: 'Physics',
      score: 82,
      activityType: 'completed_lesson',
      timestamp: '2026-09-01T14:30:00Z',
      date: 'Today'
    },
    {
      id: 'hist_2',
      lessonTitle: 'Newton’s Laws of Motion',
      subject: 'Physics',
      score: 95,
      activityType: 'quiz_attempt',
      timestamp: '2026-08-31T11:20:00Z',
      date: 'Yesterday'
    }
  ]
};
