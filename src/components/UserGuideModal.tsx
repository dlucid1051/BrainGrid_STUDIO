import React, { useState, useEffect } from 'react';
import { sounds } from '../lib/sound';
import {
  X,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  RotateCw,
  HelpCircle,
  Keyboard,
  Award,
  Clock,
  Layers,
  FileText,
  Sliders,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  GraduationCap,
  Package,
  Palette,
  Upload,
  Download,
  Lock,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeckStudio?: () => void;
  onOpenTutorGuide?: () => void;
  onOpenThemeStudio?: () => void;
  initialTab?: TabType;
}

type TabType = 'modes' | 'studypack' | 'themepack' | 'ai-tutorial' | 'templates' | 'builder';
type StudyPackSection = 'all' | 'builder' | 'samples' | 'workflow' | 'rules';

interface PromptSample {
  id: string;
  category: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  prompt: string;
  sampleCsv: string;
}

const PROMPT_SAMPLES: PromptSample[] = [
  {
    id: 'sample-biology',
    category: 'STEM & Medicine',
    badge: 'Academic',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    title: 'Cellular Respiration & Metabolism',
    description: 'Generates high-yield science flashcards with strict quotation around comma-separated definitions.',
    prompt: `Act as a university biology instructor. Create a high-yield study flashcard deck of 15 essential concepts on "Cellular Respiration, Glycolysis, and ATP Synthase".

CRITICAL FORMAT REQUIREMENTS:
1. Output ONLY pure raw CSV lines with NO conversational text, NO preamble, and NO markdown code fences.
2. Use this exact column header on line 1:
Term,Definition,Category
3. For any definition that contains a comma, you MUST enclose the entire definition in double quotes.
4. Keep the "Term" concise (1-3 words) and the "Definition" punchy, accurate, and easy to memorize (1-2 sentences).
5. Categorize each term logically (e.g. Glycolysis, Krebs Cycle, Electron Transport, Chemiosmosis).`,
    sampleCsv: `Term,Definition,Category
Glycolysis,"The anaerobic breakdown of glucose into two pyruvate molecules, yielding a net of 2 ATP and 2 NADH.",Glycolysis
Pyruvate Oxidation,"The conversion of pyruvate into Acetyl-CoA in the mitochondrial matrix, producing NADH and releasing CO2.",Mitochondria
Krebs Cycle,"A series of enzymatic reactions that oxidizes Acetyl-CoA to produce 2 ATP, 6 NADH, 2 FADH2, and CO2.",Metabolism
Electron Transport Chain,"A sequence of membrane proteins that transfer electrons via redox reactions, pumping protons across the inner membrane.",Respiration
ATP Synthase,"A rotary motor enzyme that utilizes the proton electrochemical gradient to phosphorylate ADP into ATP.",Bioenergetics
NADH,"A high-energy electron carrier molecule produced during glycolysis and the citric acid cycle.",Biochemistry
Chemiosmosis,"The movement of hydrogen ions down their electrochemical gradient across a selectively permeable membrane to generate ATP.",Bioenergetics
Fermentation,"An anaerobic metabolic pathway that regenerates NAD+ from NADH by reducing pyruvate into lactate or ethanol.",Anaerobic`,
  },
  {
    id: 'sample-spanish',
    category: 'Language Learning',
    badge: 'Vocabulary',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    title: 'Conversational Spanish: Travel & Emergency',
    description: 'Generates vocabulary with pronunciation, contextual meanings, and bilingual example phrases.',
    prompt: `Act as an expert bilingual language tutor. Generate a deck of 15 practical conversational Spanish vocabulary flashcards for the topic "Airport & Navigating Travel".

CRITICAL FORMAT REQUIREMENTS:
1. Output ONLY raw CSV text. Do not include markdown code block backticks or introductory text.
2. The first line must be:
Term,Definition,Category
3. Structure each row as follows:
- Term: Spanish word or idiom (with proper accents)
- Definition: English translation followed by a short contextual example in parentheses. If this contains a comma, enclose in double quotes.
- Category: Sub-topic (e.g. Airport, Transit, Lodging, Directions)
4. Ensure definitions are natural and conversational.`,
    sampleCsv: `Term,Definition,Category
El mostrador de facturación,"Check-in counter (Example: '¿Dónde está el mostrador de facturación?')",Airport
La tarjeta de embarque,"Boarding pass (Example: 'Tengo mi tarjeta de embarque en el teléfono.')",Airport
El equipaje de mano,"Carry-on luggage (Example: 'Solo llevo equipaje de mano.')",Luggage
La aduana,"Customs checkpoint (Example: 'Tenemos que pasar por la aduana.')",Border
El reclamo de equipaje,"Baggage claim area (Example: 'La maleta sale en el reclamo de equipaje número 3.')",Arrivals
Hacer escala,"To have a layover (Example: 'Hacemos escala de dos horas en Madrid.')",Transit
La puerta de salida,"Departure gate (Example: 'El vuelo embarca por la puerta de salida B12.')",Airport
El retraso,"Flight delay (Example: 'El vuelo sufre un retraso de media hora.')",Status`,
  },
  {
    id: 'sample-javascript',
    category: 'Coding & Tech',
    badge: 'Software Eng',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    title: 'Modern JavaScript (ES6+ & Asynchronous Patterns)',
    description: 'Generates technical concept flashcards for developer interview prep or syntax drills.',
    prompt: `Act as a senior frontend software engineer. Create a technical study deck of 15 flashcards reviewing "Modern JavaScript (ES6+, Promises, Event Loop, and Memory)".

CRITICAL FORMAT REQUIREMENTS:
1. Output strictly raw CSV without any conversational opening or markdown code fences.
2. Header on line 1:
Term,Definition,Category
3. Term: The JavaScript feature, method, or engine mechanism.
4. Definition: Clear, accurate technical explanation. Wrap in double quotes if it contains commas.
5. Category: Subdomain (e.g. Async, Syntax, Runtime, Scope, Arrays).
6. Avoid overly dense paragraphs; prioritize high-impact clarity.`,
    sampleCsv: `Term,Definition,Category
Closure,"A function bundled together with references to its surrounding lexical environment, allowing inner functions access to outer scope.",Scope
Event Loop,"The concurrency mechanism that coordinates synchronous execution stack processing with the asynchronous microtask and macrotask queues.",Runtime
Promise.all,"A combinator that takes an iterable of promises and returns a single promise that fulfills when all input promises fulfill or rejects if any rejects.",Async
Promise.allSettled,"Returns a promise that resolves after all given promises have either fulfilled or rejected, with an array of result objects.",Async
Nullish Coalescing (??),"A logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined.",Operators
Optional Chaining (?.),"Safely accesses nested object properties without throwing a TypeError if an intermediate reference is nullish.",Operators
Microtask Queue,"High-priority job queue for Promise callbacks and queueMicrotask that drains before the next macrotask runs.",Runtime
Temporal Dead Zone,"The period between entering block scope and variable declaration where let/const variables cannot be accessed.",Variables`,
  },
  {
    id: 'sample-history',
    category: 'History & Humanities',
    badge: 'Exam Prep',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    title: 'World History: The Renaissance & Scientific Revolution',
    description: 'Historical figures, treaties, paradigm shifts, and inventions with precise chronological context.',
    prompt: `Act as an AP World History professor. Create a 15-card review deck on "The European Renaissance and Early Scientific Revolution (1400-1700)".

CRITICAL FORMAT REQUIREMENTS:
1. Output strictly valid CSV lines. Do not wrap in markdown or include conversational intro/outro.
2. Required header:
Term,Definition,Category
3. Format:
- Term: Key historical figure, event, philosophical work, or invention
- Definition: Concise historical significance with approximate century/date. Enclose in double quotes if containing commas.
- Category: Specific era or movement (e.g. Humanism, Astronomy, Art, Printing)
4. Ensure historical precision and clarity.`,
    sampleCsv: `Term,Definition,Category
Johannes Gutenberg,"German inventor who introduced movable type printing to Europe circa 1440, revolutionizing information dissemination.",Invention
Niccolò Machiavelli,"Florentine diplomat and author of 'The Prince' (1532), pioneering modern pragmatic political philosophy.",Philosophy
Heliocentric Model,"Astronomical theory formulated by Nicolaus Copernicus asserting that the Sun is the center of the solar system.",Astronomy
Galileo Galilei,"Italian astronomer who pioneered the telescopic observation of celestial bodies and confirmed Jovian moons in 1610.",Science
Humanism,"An intellectual movement centered on the study of classical humanities, human potential, and secular inquiry.",Philosophy
Filippo Brunelleschi,"Florentine architect who engineered the monumental dome of the Florence Cathedral (Santa Maria del Fiore).",Architecture
Sir Isaac Newton,"English polymath whose 'Principia Mathematica' (1687) formulated universal gravitation and the three laws of motion.",Physics
Francis Bacon,"Philosopher who formulated the empirical scientific method, emphasizing inductive reasoning and observation.",Methodology`,
  },
  {
    id: 'sample-medicine',
    category: 'STEM & Medicine',
    badge: 'Clinical',
    badgeColor: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60',
    title: 'Clinical Pharmacology & Autonomic Drugs',
    description: 'Drug mechanisms of action, receptor selectivity, clinical indications, and key adverse effects.',
    prompt: `Act as a clinical pharmacologist and medical board instructor. Create a high-yield 15-card review deck on "Autonomic Nervous System Pharmacology (Sympathetic & Parasympathetic Drugs)".

CRITICAL FORMAT REQUIREMENTS:
1. Output strictly raw CSV without introductory chatter or markdown code blocks.
2. Required header on line 1:
Term,Definition,Category
3. Structure:
- Term: Drug name or pharmacologic mechanism
- Definition: Receptor target, primary indication, and key adverse effect in 1-2 punchy sentences. Enclose in double quotes if containing commas.
- Category: Sub-class (e.g. Beta-Blockers, Cholinergics, Anticholinergics, Adrenergic Agonists)
4. Emphasize high-yield clinical distinctions.`,
    sampleCsv: `Term,Definition,Category
Atropine,"Competitive muscarinic receptor antagonist that increases heart rate in symptomatic bradycardia and reverses organophosphate toxicity.",Anticholinergic
Albuterol,"Selective beta-2 adrenergic agonist causing bronchial smooth muscle relaxation for acute asthma and bronchospasm relief.",Beta-Agonist
Metoprolol,"Cardioselective beta-1 adrenergic antagonist used in hypertension, angina, and post-myocardial infarction cardioprotection.",Beta-Blocker
Pilocarpine,"Direct muscarinic agonist inducing ciliary muscle contraction and pupillary constriction to relieve intraocular pressure in glaucoma.",Cholinergic
Epinephrine,"Non-selective alpha and beta adrenergic agonist employed as the primary first-line treatment for acute anaphylactic shock.",Sympathomimetic
Prazosin,"Selective alpha-1 adrenergic antagonist causing vasodilation, indicated for benign prostatic hyperplasia (BPH) and PTSD nightmares.",Alpha-Blocker
Neostigmine,"Reversible acetylcholinesterase inhibitor that enhances neuromuscular transmission, used to reverse non-depolarizing neuromuscular blockade.",Cholinesterase Inhibitor
Propranolol,"Non-selective beta-1 and beta-2 antagonist used for performance anxiety, essential tremor, and migraine prophylaxis.",Beta-Blocker`,
  },
  {
    id: 'sample-finance',
    category: 'Business & Finance',
    badge: 'Corporate',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    title: 'Corporate Finance & Valuation Metrics',
    description: 'Discounted cash flows, multiples, WACC, capital structure, and investment return formulas.',
    prompt: `Act as a Wall Street investment banking analyst. Generate a technical review flashcard deck of 15 essential concepts on "Corporate Valuation, Discounted Cash Flow (DCF), and Capital Structure".

CRITICAL FORMAT REQUIREMENTS:
1. Output ONLY raw CSV format with NO explanations, NO greeting, and NO code fences.
2. Exact header:
Term,Definition,Category
3. Provide concise definitions with practical valuation application or formula context. Wrap definitions in double quotes if they contain commas.
4. Categorize by core corporate finance domain.`,
    sampleCsv: `Term,Definition,Category
WACC (Weighted Average Cost of Capital),"The blended required rate of return a company must earn on existing assets to satisfy debt and equity holders.",Cost of Capital
EBITDA,"Operating earnings before interest, taxes, depreciation, and amortization, serving as a clean proxy for core operating cash flow.",Profitability
Free Cash Flow to Firm (FCFF),"Cash generated by operating activities minus capital expenditures, available to all capital providers prior to debt payments.",Cash Flow
Terminal Value (DCF),"The estimated lump-sum value of all future cash flows beyond an explicit multi-year forecast horizon.",Valuation
Net Present Value (NPV),"The difference between the present value of cash inflows and the initial capital outlay discounted at the hurdle rate.",Capital Budgeting
Beta (CAPM),"A standardized metric of an asset's systematic risk relative to the broader market portfolio volatility.",Asset Pricing
Enterprise Value (EV),"The theoretical takeover cost of a company, calculated as market equity value plus net debt and minority interest.",Valuation
Internal Rate of Return (IRR),"The discount rate at which the net present value of all cash flows from a project equals exactly zero.",Capital Budgeting`,
  },
  {
    id: 'sample-psychology',
    category: 'Humanities & Social Sciences',
    badge: 'Neuroscience',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    title: 'Cognitive Psychology & Memory Phenomena',
    description: 'Working memory, heuristic biases, cognitive distortions, neuroplasticity, and recall dynamics.',
    prompt: `Act as a professor of cognitive neuroscience. Create a 15-flashcard study deck on "Human Memory Models, Attention, and Cognitive Biases".

CRITICAL FORMAT REQUIREMENTS:
1. Output strictly valid raw CSV without preamble or markdown formatting.
2. Exact line 1 header:
Term,Definition,Category
3. Keep the term concise and the definition grounded in empirical psychological science. Wrap definitions in double quotes if they contain commas.
4. Categories should reflect memory, perception, or heuristic domains.`,
    sampleCsv: `Term,Definition,Category
Working Memory,"The cognitive system responsible for transient holding and manipulation of information, comprising central executive and phonological loop.",Memory
Spacing Effect,"The cognitive phenomenon where learning is greater when study sessions are spaced out over time rather than massed into single cram sessions.",Learning
Hebbian Plasticity,"The neurobiological principle stating that neurons that fire together wire together, strengthening synaptic efficacy.",Neuroscience
Confirmation Bias,"The tendency to search for, interpret, favor, and recall information in a way that confirms preexisting beliefs or hypotheses.",Cognitive Bias
Ebbinghaus Forgetting Curve,"The mathematical model illustrating the exponential rate at which acquired memory traces decay over time without active review.",Memory
Availability Heuristic,"A mental shortcut that relies on immediate examples that come to mind when evaluating a specific topic, concept, or decision.",Heuristics
Long-Term Potentiation (LTP),"A persistent strengthening of synapses based on recent patterns of activity, considered the cellular basis for learning.",Neuroscience
Proactive Interference,"The tendency of previously learned memories to interfere with and hinder the retrieval of newly acquired information.",Memory`,
  },
  {
    id: 'sample-literature',
    category: 'Literature & Arts',
    badge: 'Literary Arts',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    title: 'World Literature & Literary Devices',
    description: 'Rhetorical tropes, narrative techniques, poetic meters, and landmark stylistic traditions.',
    prompt: `Act as a professor of comparative literature. Generate a high-yield study deck of 15 flashcards on "Classical Literary Devices, Narrative Poetics, and Rhetorical Figures".

CRITICAL FORMAT REQUIREMENTS:
1. Output ONLY raw CSV format with NO conversational intro, NO outro, and NO markdown code fences.
2. Required header on line 1:
Term,Definition,Category
3. Definitions must include a clear explanation and an illustrative canonical example. Always wrap definitions in double quotes if they contain commas.
4. Categorize by Poetics, Rhetoric, Narrative Structure, or Style.`,
    sampleCsv: `Term,Definition,Category
Metaphor,"A direct figure of speech asserting that one thing is another, equating distinct subjects without using 'like' or 'as'.",Figurative Language
Dramatic Irony,"A narrative scenario where the audience possesses crucial knowledge that the story's characters remain unaware of.",Narrative
Chiasmus,"A rhetorical device where words, grammatical constructions, or concepts are repeated in reverse order (e.g. 'Never let a fool kiss you or a kiss fool you').",Rhetoric
Synecdoche,"A figure of speech in which a part is made to represent the whole, or vice versa (e.g. 'all hands on deck').",Tropes
Allegory,"A narrative in which characters, events, and settings symbolize deeper moral, philosophical, or political meanings.",Genre
Enjambment,"In poetry, the continuation of a sentence without a pause beyond the end of a line, couplet, or stanza.",Poetics
Bildungsroman,"A literary genre focusing on the psychological and moral growth of the protagonist from youth into adulthood.",Genre
Anaphora,"The deliberate repetition of a word or phrase at the beginning of successive clauses or verses for rhetorical emphasis.",Rhetoric`,
  },
];

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenDeckStudio,
  onOpenTutorGuide,
  onOpenThemeStudio,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'studypack' | 'themepack'>(() => {
    if (initialTab === 'ai-tutorial' || initialTab === 'templates' || initialTab === 'builder' || initialTab === 'studypack') {
      return 'studypack';
    }
    return initialTab === 'themepack' ? 'themepack' : 'modes';
  });
  const [studyPackSection, setStudyPackSection] = useState<StudyPackSection>(() => {
    if (initialTab === 'builder') return 'builder';
    if (initialTab === 'templates') return 'samples';
    if (initialTab === 'ai-tutorial') return 'workflow';
    return 'all';
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(PROMPT_SAMPLES[0].id);
  const [viewAllSamples, setViewAllSamples] = useState<boolean>(false);

  useEffect(() => {
    if (initialTab && isOpen) {
      if (initialTab === 'ai-tutorial' || initialTab === 'templates' || initialTab === 'builder' || initialTab === 'studypack') {
        setActiveTab('studypack');
        if (initialTab === 'builder') setStudyPackSection('builder');
        else if (initialTab === 'templates') setStudyPackSection('samples');
        else if (initialTab === 'ai-tutorial') setStudyPackSection('workflow');
      } else if (initialTab === 'themepack') {
        setActiveTab('themepack');
      } else {
        setActiveTab('modes');
      }
    }
  }, [initialTab, isOpen]);

  // Dynamic Prompt Builder state
  const [topic, setTopic] = useState('World Capital Cities and Geography');
  const [cardCount, setCardCount] = useState<number>(15);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [includeExamples, setIncludeExamples] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    sounds.playPop();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Dynamically constructed AI prompt from the builder
  const generatedPrompt = `Act as an expert educator in ${topic}. Generate a study flashcard deck of exactly ${cardCount} cards on the topic of "${topic}".

TARGET LEVEL: ${difficulty}
${includeExamples ? 'REQUIREMENT: Where helpful, include an illustrative example or context phrase in the definition.' : ''}

CRITICAL FORMATTING INSTRUCTIONS FOR CSV:
1. Provide ONLY raw CSV data. Do NOT include markdown code blocks (\`\`\`csv), do NOT include greeting or summary text.
2. The very first line must be the exact header:
Term,Definition,Category
3. If ANY definition or term contains a comma, wrap that entire field in double quotes. Example: "Photosynthesis is the process by which plants, algae, and cyanobacteria convert sunlight into energy."
4. Term must be concise (1-4 words). Definition must be clear and direct (1-2 sentences).
5. Category should be a logical grouping of 1-2 words.`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden flex flex-col h-[88vh] max-h-[820px] min-h-[500px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-slate-50/80 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                  User Guide & Study Tutor
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  Interactive
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Study modes, keyboard shortcuts, and AI LLM prompt generation for custom decks
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
            title="Close Guide"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 flex items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/80 overflow-x-auto gap-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('modes');
            }}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'modes'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>App Tour & Modes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('studypack');
            }}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'studypack'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div className="flex items-center gap-1.5">
              <span>StudyPack STUDIO</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60 leading-none">
                How It Works
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('themepack');
            }}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'themepack'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="flex items-center gap-1.5">
              <span>ThemePack STUDIO</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/60 leading-none">
                How It Works
              </span>
            </div>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 overscroll-contain">
          {/* ================= TAB 1: MODES & APP OVERVIEW ================= */}
          {activeTab === 'modes' && (
            <div className="space-y-6">
              {/* Quick Summary Card */}
              <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                    Welcome to Your Active Recall Powerhouse
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Designed around spaced repetition and multimodal recall. Switch seamlessly between 4 distinct study styles, track mastery progress, collect reward stickers, and import custom decks from any topic in seconds.
                  </p>
                </div>
              </div>

              {/* 4 Study Modes Grid */}
              <div>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>The 4 Study Modes</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Mode 1 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Classic Card Flip</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Tap the card or press <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-[10px]">Space</kbd> to flip between Term and Definition. Mark cards as <strong className="text-emerald-600 dark:text-emerald-400">Mastered (1)</strong> or <strong className="text-amber-600 dark:text-amber-400">Needs Review (2)</strong>.
                    </p>
                  </div>

                  {/* Mode 2 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-xs">
                        2
                      </span>
                      <span>Multiple Choice Quiz</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Randomized 4-option rapid evaluation. Perfect for test simulation and concept discrimination. Tracks streak multipliers and displays instant explanations for wrong answers.
                    </p>
                  </div>

                  {/* Mode 3 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-xs">
                        3
                      </span>
                      <span>Type-In Active Recall</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Type exact terms or vocabulary words from memory. The highest-fidelity active recall practice with intelligent string normalization, hint reveals, and instant correction verification.
                    </p>
                  </div>

                  {/* Mode 4 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                      <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-xs">
                        4
                      </span>
                      <span>Speed Match Challenge</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      A fast-paced grid matching game. Pair terms to their corresponding definitions under a live countdown timer. Unlocks high-tier sticker trophies for high-speed clears.
                    </p>
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcuts Table */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-indigo-500" />
                  <span>Quick Keyboard Navigation</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Flip Card</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px] font-bold">Space</kbd>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Mastered</span>
                    <kbd className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">1 or →</kbd>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Repeat</span>
                    <kbd className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold">2 or ←</kbd>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Close Modals</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px] font-bold">Esc</kbd>
                  </div>
                </div>
              </div>

              {/* Gamification & StickerBook STUDIO */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-200 dark:border-amber-900/50">
                <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100 block mb-0.5">
                    Earn Rare Collectible Stickers
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    Keep your daily streak alive, clear decks without misses, and ace speed challenges to discover and collect high-tier achievement stickers stored permanently in your StickerBook STUDIO.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: THEMEPACK STUDIO GUIDE & TUTORIAL ================= */}
          {activeTab === 'themepack' && (
            <div className="space-y-6">
              {/* Hero Banner with ThemePack STUDIO Brand Logo */}
              <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-indigo-500/30 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-none bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
                          ThemePack
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-white/15 text-indigo-200 border border-white/20 leading-none">
                          STUDIO
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold">
                        How It Works
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                      The all-in-one creative forge for designing custom study backdrops, minting transparent die-cut stickers, and packaging standalone portable theme bundles.
                    </p>
                  </div>

                  {onOpenThemeStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onClose();
                        onOpenThemeStudio();
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer self-start md:self-center"
                    >
                      <Package className="w-4 h-4" />
                      <span>Launch ThemePack STUDIO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* PART 1: QUICK-START TUTORIAL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Quick-Start Tutorial: Craft Your First ThemePack in 4 Steps</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    Estimated time: 3 mins
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Forge Your Canvas Backdrop</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Select <strong>Canvas Theme Backdrop Studio</strong> in the pack creator. Choose from curated vector SVGs (Isometric Grid, Blueprint, Notebook, Woodgrain, Constellations) or upload your own 16:9 wallpaper.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-medium">Cover & Contain Fit</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-medium">Dimming Slider</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-medium">Atmospheric Blur</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-xs">
                        2
                      </span>
                      <span>Mint & Curate Custom Stickers</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Mint emoji stickers or upload custom image files (PNG, WebP, SVG). Assign rarity tiers (Common, Rare, Epic, or Legendary) to establish achievement value in your collection.
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-100 dark:border-purple-900/40">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Pro-Tip: Use transparent PNGs for authentic die-cut contours!</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-xs">
                        3
                      </span>
                      <span>Study Motivator: Lock & Unlock Engine</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Keep learners excited! Use batch controls (<span className="font-semibold text-amber-700 dark:text-amber-300">Default</span> keeps Common unlocked, Rare/Legendary locked for study rewards; <span className="font-semibold text-amber-700 dark:text-amber-300">Lock All</span> for pure challenge; <span className="font-semibold text-amber-700 dark:text-amber-300">Unlock All</span> for sandbox creativity) or toggle the lock icon on individual sticker cards.
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Only unlocked stickers can be placed on canvases or selected in the drawer!</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-xs">
                        4
                      </span>
                      <span>Test on the Sticker Book Canvas</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Switch to the Canvas to drag, rotate, mirror (horizontal flip), scale, and layer your minted stickers. Selected stickers emit an elevated blue selection aura and ambient drop shadow until dropped.
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-pink-100/70 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 font-medium">Smooth Touch & Drag</span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-100/70 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 font-medium">360° Free Rotation</span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-100/70 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 font-medium">Horizontal Mirror</span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-100/70 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 font-medium">0.5x–2.5x Zoom</span>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs">
                        5
                      </span>
                      <span>1-Click Export, Import & Clean Sync</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Select your custom pack from the <strong>Installed Packs</strong> hub and click <strong>Export Pack</strong>. Downloads a standalone <code className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">.vault-pack.json</code> file with backdrops and reward flags.
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>Backdrops sync to the theme scroller; deleted backdrops & locked stickers auto-clean!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PART 2: STUDIO REFERENCE MANUAL */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>ThemePack STUDIO Reference Manual</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <Package className="w-4 h-4" />
                      <span>The 3 Studio Hubs</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>Installed:</strong> Filter, inspect, lock/unlock, or export active packs.</li>
                      <li><strong>Create/Forge:</strong> Author new themes and mint stickers with live preview.</li>
                      <li><strong>Import:</strong> Drag & drop JSON files to add community packs.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                      <Palette className="w-4 h-4" />
                      <span>Backdrop Atmosphere</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>Dimming (0–80%):</strong> Darkens canvas so stickers stand out clearly.</li>
                      <li><strong>Blur (0–20px):</strong> Softens complex photographic wallpapers.</li>
                      <li><strong>Grids:</strong> Overlay Dot, Line, or Isometric drafting patterns.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Lock className="w-4 h-4" />
                      <span>Lock & Study Motivator</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>Default:</strong> Common unlocked; Rare/Legendary locked for study.</li>
                      <li><strong>Lock/Unlock All:</strong> 1-click batch toggles across pack.</li>
                      <li><strong>Corner Toggle:</strong> Click lock icon on card for granular access.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400">
                      <ImageIcon className="w-4 h-4" />
                      <span>Sticker Asset Guidelines</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>Resolution:</strong> 512x512px square assets recommended.</li>
                      <li><strong>Transparency:</strong> PNG or SVG format ensures contour hug.</li>
                      <li><strong>Rarity Weights:</strong> Common (50%), Rare (28%), Epic (16%), Legendary (6%).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* PART 3: STANDALONE ARCHITECTURE & PORTABILITY NOTE */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                    Engineered for Future Standalone Portability
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    ThemePack STUDIO and StickerBook STUDIO operate on a completely decoupled, modular schema. All scene backdrops, sticker coordinates, and pack metadata are serialized as standard JSON (<code className="font-mono text-[10px] bg-indigo-100 dark:bg-indigo-900 px-1 py-0.5 rounded text-indigo-800 dark:text-indigo-200">VaultPackFile</code>). This ensures your custom themes and collections are 100% portable, making it effortless to share packs or separate StickerBook STUDIO and ThemePack STUDIO into an independent application in the future.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: STUDYPACK STUDIO GUIDE & TUTORIAL ================= */}
          {activeTab === 'studypack' && (
            <div className="space-y-6">
              {/* Hero Banner with StudyPack STUDIO Brand Logo */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-indigo-500/30 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-none bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
                          StudyPack
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-white/15 text-indigo-200 border border-white/20 leading-none">
                          STUDIO
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold">
                        How It Works
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                      The all-in-one forge for flashcard decks: generate high-yield decks with AI LLMs, customize prompt parameters, explore curated domain samples, and import CSVs instantly.
                    </p>
                  </div>

                  {onOpenDeckStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onClose();
                        onOpenDeckStudio();
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer self-start md:self-center"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Launch StudyPack STUDIO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Sub-Section Filter / Jump Navigation */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setStudyPackSection('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    studyPackSection === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Overview & All</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setStudyPackSection('builder');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    studyPackSection === 'builder'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dynamic Prompt Builder</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setStudyPackSection('samples');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    studyPackSection === 'samples'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Curated Prompt Samples (8)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setStudyPackSection('workflow');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    studyPackSection === 'workflow'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>4-Step AI Workflow</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setStudyPackSection('rules');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    studyPackSection === 'rules'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Golden CSV Rules & Manual</span>
                </button>
              </div>

              {/* PART 1: 4-STEP IMPORT WORKFLOW */}
              {(studyPackSection === 'all' || studyPackSection === 'workflow') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Quick-Start Tutorial: The 4-Step AI Deck Workflow</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                      Estimated time: 10 seconds
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Step 1 */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center mb-2">
                          01
                        </div>
                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-1">
                          Copy the Prompt Formula
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Pick from our 8 curated domain samples below or use the Dynamic Builder to tune your topic, card count, and difficulty.
                        </p>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-medium">Custom Topics</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-medium">10–40 Cards</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center mb-2">
                          02
                        </div>
                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-1">
                          Paste into Any AI LLM
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Paste into Gemini, ChatGPT, or Claude. Our strict prompt rules force pure tabular CSV output without markdown fences or banter.
                        </p>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-medium">Gemini</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-medium">ChatGPT</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-medium">Claude</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center mb-2">
                          03
                        </div>
                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-1">
                          Copy the Tabular Output
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Select and copy the generated CSV rows. Comma-separated definitions are enclosed in double quotes for zero-glitch parsing.
                        </p>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">Term,Definition</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">Auto-Quotes</span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center mb-2">
                          04
                        </div>
                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-1">
                          Paste & Import Instantly
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Open <strong>StudyPack STUDIO</strong> → "Import / Edit CSV" tab → Paste your text → Click <strong>Import Cards</strong>. Ready to study!
                        </p>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-medium">Instant Parse</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-medium">Local Storage</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* PART 2: DYNAMIC PROMPT BUILDER */}
            {(studyPackSection === 'all' || studyPackSection === 'builder') && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Interactive Dynamic Prompt Builder</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Live Generator
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 mb-0.5">
                      Interactive Custom Prompt Generator
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Customize your topic and difficulty below. The prompt on the right automatically updates with proven formatting constraints so you can copy and paste directly into Gemini, ChatGPT, or Claude.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column: Form Controls */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Subject / Topic of Study:
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Organic Chemistry, French Cooking, AP US History"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Card Count:
                        </label>
                        <select
                          value={cardCount}
                          onChange={(e) => setCardCount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                        >
                          <option value={10}>10 Cards (Quick)</option>
                          <option value={15}>15 Cards (Standard)</option>
                          <option value={25}>25 Cards (Deep Dive)</option>
                          <option value={40}>40 Cards (Comprehensive)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Difficulty Level:
                        </label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                        >
                          <option value="Beginner / Fundamentals">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced / High-Yield">Advanced</option>
                          <option value="Graduate / Professional Exam">Professional</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeExamples}
                          onChange={(e) => setIncludeExamples(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          Request illustrative example sentences or context in definitions
                        </span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setTopic('Human Anatomy: Skeletal & Muscular Systems');
                          setCardCount(15);
                          setDifficulty('Intermediate');
                          setIncludeExamples(true);
                        }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Reset to Anatomy Example</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Live Prompt Preview */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Dynamic AI Prompt
                      </span>
                      <span className="text-[10px] text-slate-400">Ready to copy</span>
                    </div>

                    <pre className="p-3 bg-slate-950/80 text-indigo-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap break-words leading-relaxed overflow-y-auto max-h-64 border border-slate-800/80">
                      {generatedPrompt}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyText(generatedPrompt, 'builder-prompt')}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedId === 'builder-prompt' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Prompt Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Custom Prompt for AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PART 3: PROMPT TEMPLATES & SAMPLES */}
            {(studyPackSection === 'all' || studyPackSection === 'samples') && (
            <div className="space-y-4">
              {/* Section Header & View Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Curated AI Prompts & Ready CSV Samples</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select a topic option below to view its prompt formula and CSV flashcard output.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setViewAllSamples(!viewAllSamples);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                      viewAllSamples
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {viewAllSamples ? 'Show Single Detail View' : 'Show All Samples'}
                  </button>
                </div>
              </div>

              {/* Sample Section Options / Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {PROMPT_SAMPLES.map((sample) => {
                  const isSelected = selectedSampleId === sample.id && !viewAllSamples;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setSelectedSampleId(sample.id);
                        setViewAllSamples(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200/90 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                      <span>{sample.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Single Detail View Area */}
              {!viewAllSamples && (() => {
                const sample = PROMPT_SAMPLES.find((s) => s.id === selectedSampleId) || PROMPT_SAMPLES[0];
                const isPromptCopied = copiedId === `prompt-${sample.id}`;
                const isCsvCopied = copiedId === `csv-${sample.id}`;

                return (
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-4 shadow-xs">
                    {/* Detail Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}>
                          {sample.badge}
                        </span>
                        <h5 className="font-display font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                          {sample.title}
                        </h5>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {sample.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sample.description}
                    </p>

                    {/* Dual Cards: Prompt Formula & Ready CSV */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                      {/* Left: AI Prompt Formula */}
                      <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-950/80 bg-indigo-50/20 dark:bg-slate-900/50 flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Prompt Formula
                          </span>
                          <button
                            type="button"
                            onClick={() => copyText(sample.prompt, `prompt-${sample.id}`)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-xs active:scale-95"
                          >
                            {isPromptCopied ? (
                              <>
                                <Check className="w-3 h-3 text-white" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap break-words leading-relaxed border border-slate-800 overflow-y-auto max-h-48 flex-1">
                          {sample.prompt}
                        </pre>
                      </div>

                      {/* Right: Generated CSV Output */}
                      <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-950/80 bg-emerald-50/20 dark:bg-slate-900/50 flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            CSV Output (Ready to Import)
                          </span>
                          <button
                            type="button"
                            onClick={() => copyText(sample.sampleCsv, `csv-${sample.id}`)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs active:scale-95"
                          >
                            {isCsvCopied ? (
                              <>
                                <Check className="w-3 h-3 text-white" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy CSV</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono whitespace-pre-wrap break-words leading-relaxed border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-48 flex-1">
                          {sample.sampleCsv}
                        </pre>
                      </div>
                    </div>

                    {/* Direct StudyPack STUDIO action bar */}
                    {onOpenDeckStudio && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-slate-600 dark:text-slate-400">
                          Ready to test? Copy the CSV above, then open the studio:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            onClose();
                            onOpenDeckStudio();
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <span>Open StudyPack STUDIO</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* View All Samples Mode */}
              {viewAllSamples && (
                <div className="space-y-4">
                  {PROMPT_SAMPLES.map((sample) => {
                    const isPromptCopied = copiedId === `prompt-${sample.id}`;
                    const isCsvCopied = copiedId === `csv-${sample.id}`;

                    return (
                      <div 
                        key={sample.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-3.5 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}>
                              {sample.badge}
                            </span>
                            <h5 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                              {sample.title}
                            </h5>
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {sample.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {sample.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Prompt:
                              </span>
                              <button
                                type="button"
                                onClick={() => copyText(sample.prompt, `prompt-${sample.id}`)}
                                className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 flex items-center gap-1"
                              >
                                {isPromptCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{isPromptCopied ? 'Copied' : 'Copy Prompt'}</span>
                              </button>
                            </div>
                            <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono whitespace-pre-wrap break-words leading-relaxed border border-slate-800 overflow-y-auto max-h-36">
                              {sample.prompt}
                            </pre>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                CSV Sample:
                              </span>
                              <button
                                type="button"
                                onClick={() => copyText(sample.sampleCsv, `csv-${sample.id}`)}
                                className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
                              >
                                {isCsvCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{isCsvCopied ? 'Copied' : 'Copy CSV'}</span>
                              </button>
                            </div>
                            <pre className="p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-mono whitespace-pre-wrap break-words leading-relaxed border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-36">
                              {sample.sampleCsv}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

            {/* PART 4: STUDYPACK STUDIO REFERENCE MANUAL & GOLDEN CSV RULES */}
            {(studyPackSection === 'all' || studyPackSection === 'rules') && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>StudyPack STUDIO Reference Manual & Golden CSV Rules</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Formatting Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <FolderOpen className="w-4 h-4" />
                      <span>The 3 Studio Hubs</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>All Decks:</strong> Switch active deck, review card counts, or delete old sets.</li>
                      <li><strong>Create Deck:</strong> Manually author cards with live category tagging.</li>
                      <li><strong>Import/Edit CSV:</strong> Raw text editor with instant bidirectional sync.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Golden Quotation Rules</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>Internal Commas:</strong> Wrap in double quotes (<code className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">"A, B, and C"</code>).</li>
                      <li><strong>Clean Headers:</strong> Line 1 must be <code className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">Term,Definition,Category</code>.</li>
                      <li><strong>No Code Blocks:</strong> Strip <code className="font-mono text-[10px]">```csv</code> backticks before importing.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-4 h-4" />
                      <span>3-Column Data Schema</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>Term (Col 1):</strong> 1–4 words, high-contrast focal concept.</li>
                      <li><strong>Definition (Col 2):</strong> Punchy 1–2 sentence explanation.</li>
                      <li><strong>Category (Col 3):</strong> Topic group for badges and quiz filtering.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Prompting Secrets</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1 list-disc list-inside">
                      <li><strong>No Conversational Fluff:</strong> Ask AI for pure raw CSV lines only.</li>
                      <li><strong>Exact Card Count:</strong> Specify 10, 15, or 25 cards for tight focus.</li>
                      <li><strong>Model Compatibility:</strong> Verified on Gemini, ChatGPT, and Claude.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* PART 5: STANDALONE ARCHITECTURE & PORTABILITY NOTE */}
            {(studyPackSection === 'all' || studyPackSection === 'rules') && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                    Engineered for Future Standalone Portability & Sharing
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    StudyPack STUDIO utilizes standard open-spec CSV and JSON structures (<code className="font-mono text-[10px] bg-indigo-100 dark:bg-indigo-900 px-1 py-0.5 rounded text-indigo-800 dark:text-indigo-200">Deck</code> & <code className="font-mono text-[10px] bg-indigo-100 dark:bg-indigo-900 px-1 py-0.5 rounded text-indigo-800 dark:text-indigo-200">Flashcard</code> models). Your decks are 100% portable: easily export them to study offline, share with peers via CSV, or migrate into any future standalone StudyPack application without proprietary locks.
                  </p>
                </div>
              </div>
            )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
                onOpenTutorGuide?.();
              }}
              className="p-1 -ml-1 rounded-lg text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/60 transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-400 cursor-pointer flex items-center justify-center group"
              title="Open Co-Developer Tutor Guide (Git, Bash, Architecture)"
              aria-label="Open Co-Developer Tutor Guide"
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-125 group-active:scale-90" />
            </button>
            <span>Works seamlessly with Google Gemini, ChatGPT, Claude, and open-source models.</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
