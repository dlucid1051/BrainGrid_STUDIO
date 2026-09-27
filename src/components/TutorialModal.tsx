import React, { useState } from 'react';
import { sounds } from '../lib/sound';
import { 
  X, 
  Terminal, 
  GitBranch, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink,
  Laptop,
  Layers,
  Palette,
  ShieldCheck,
  Database,
  Volume2,
  Cpu,
  FileCode2,
  FolderOpen,
  Boxes,
  Smartphone,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'git-bash' | 'ai-prompts' | 'architecture'>('git-bash');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    sounds.playPop();
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-800 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 dark:from-slate-900 dark:via-purple-950/30 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-purple-400/20 dark:ring-purple-500/30">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Co-Developer Tutor Guide
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  Dev Hub
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                VS Code, Git & Bash Setup, Full App Architecture Tour, AI Prompt Engineering & Offline PWA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Guide"
              aria-label="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="shrink-0 min-h-[50px] sm:min-h-[54px] flex items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/80 overflow-x-auto gap-1 sm:gap-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('git-bash');
            }}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'git-bash'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-800/80 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-t-xl'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>Bash & GitHub Setup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('ai-prompts');
            }}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'ai-prompts'
                ? 'border-pink-600 dark:border-pink-400 text-pink-700 dark:text-pink-300 bg-white/80 dark:bg-slate-800/80 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-t-xl'
            }`}
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span>AI Prompt Formulas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setActiveTab('architecture');
            }}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'architecture'
                ? 'border-purple-600 dark:border-purple-400 text-purple-700 dark:text-purple-300 bg-white/80 dark:bg-slate-800/80 rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-t-xl'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Architecture & Engines</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-700 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-950/40">
          
          {/* ================= TAB 1: BASH & GITHUB SETUP TUTORIAL ================= */}
          {activeTab === 'git-bash' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-0.5">
                    Co-Developer Walkthrough (VS Code & Terminal):
                  </span>
                  Here is the step-by-step pipeline to connect your local VS Code workspace (using Bash) to your GitHub repository, manage Git commits, run local build scripts, and automate deployments to GitHub Pages.
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Open your Bash terminal in VS Code
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-8.5">
                  In VS Code, press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[11px] text-slate-800 dark:text-slate-200">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[11px] text-slate-800 dark:text-slate-200">`</kbd> (or open <strong>Terminal &gt; New Terminal</strong>). In the terminal shell selector (top-right of the terminal panel), ensure <strong>bash</strong> is selected.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Initialize Git and set the default branch to main
                  </h4>
                </div>
                <div className="pl-8.5">
                  <div className="relative group bg-slate-950 dark:bg-black text-emerald-400 font-mono text-xs p-3.5 rounded-2xl border border-slate-800">
                    <pre>git init{"\n"}git branch -M main</pre>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('git init\ngit branch -M main', 'c1')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Configure your Git identity (if not already configured)
                  </h4>
                </div>
                <div className="pl-8.5">
                  <div className="relative group bg-slate-950 dark:bg-black text-emerald-400 font-mono text-xs p-3.5 rounded-2xl border border-slate-800">
                    <pre>git config user.name "Your Name"{"\n"}git config user.email "your.email@example.com"</pre>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('git config user.name "Your Name"\ngit config user.email "your.email@example.com"', 'c2')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Stage files and make your initial commit
                  </h4>
                </div>
                <div className="pl-8.5">
                  <div className="relative group bg-slate-950 dark:bg-black text-emerald-400 font-mono text-xs p-3.5 rounded-2xl border border-slate-800">
                    <pre>git add .{"\n"}git commit -m "feat: initial commit for BrainGrid Studio (PWA, StudyCards & StickerBook)"</pre>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('git add .\ngit commit -m "feat: initial commit for BrainGrid Studio (PWA, StudyCards & StickerBook)"', 'c3')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Connect to your GitHub repository and Push
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-8.5 mb-2">
                  Create a new repository on <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">github.com</a> (e.g. <code>braingrid-studio</code>). Then link your remote and push:
                </p>
                <div className="pl-8.5">
                  <div className="relative group bg-slate-950 dark:bg-black text-emerald-400 font-mono text-xs p-3.5 rounded-2xl border border-slate-800">
                    <pre>git remote add origin https://github.com/&lt;your-username&gt;/braingrid-studio.git{"\n"}git push -u origin main</pre>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('git remote add origin https://github.com/<your-username>/braingrid-studio.git\ngit push -u origin main', 'c4')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === 'c4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    6
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Automated GitHub Pages Deployment (Vite 6 + Actions)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-8.5">
                  For Vite apps hosting on GitHub Pages, ensure root-relative pathing in <code>vite.config.ts</code> (or set <code>base: '/&lt;repo-name&gt;/'</code>). In your GitHub repository:
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 pl-12.5 list-disc space-y-1">
                  <li>Navigate to <strong>Settings &gt; Pages</strong> on GitHub</li>
                  <li>Under <strong>Build and deployment &gt; Source</strong>, select <strong>GitHub Actions</strong></li>
                  <li>Select the "Static HTML" or "Vite" GitHub workflow to automatically compile and deploy on every git push</li>
                  <li>The app's offline PWA service worker will cache assets automatically for 100% offline usage</li>
                </ul>
              </div>

              {/* Step 7 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    7
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Local Dev Scripts & Verification
                  </h4>
                </div>
                <div className="pl-8.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                        npm run dev
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Launches Vite dev server on port 3000 with rapid hot reloads.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1">
                        npm run build
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Compiles production bundle into <code>dist/</code> directory.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        npm run lint
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Validates strict TypeScript types across all components.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: AI PROMPT ENGINEERING ================= */}
          {activeTab === 'ai-prompts' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/50 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-pink-900 dark:text-pink-200 block mb-0.5">
                    Co-Developer AI Prompt Engineering Formulas:
                  </span>
                  BrainGrid Studio supports two major generative AI workflows: <strong>StudyPack CSV flashcard generation</strong> for LLMs (Gemini, Claude, ChatGPT) and <strong>StickerBook & Wallpaper prompts</strong> for image models (Imagen, Midjourney, DALL-E). Below are master formulas guaranteed to parse cleanly into the app.
                </div>
              </div>

              {/* Section 1: StudyPack LLM CSV Prompt Formula */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    1. StudyPack STUDIO: Master LLM Flashcard Prompt Formula
                  </h4>
                </div>
                
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                      Universal 3-Column CSV Prompt Template
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `Act as an elite subject matter tutor. Create a 15-flashcard study deck on "[TOPIC]".\n\nCRITICAL SPECIFICATION REQUIREMENTS:\n1. Output strictly raw CSV text. Do NOT wrap in markdown code blocks, backticks, or write conversational intros.\n2. Header row must be exactly:\nTerm,Definition,Category\n3. Term: The core concept, vocabulary, or question.\n4. Definition: Clear, concise explanation or answer. CRITICAL: Wrap the definition in double quotes ("") if it contains commas, semicolons, or quotes.\n5. Category: Sub-domain classification (e.g. Fundamental, Advanced, Clinical, Historical).\n6. Avoid overly dense text; prioritize high-impact clarity and active recall.`,
                          'prompt-csv-master'
                        )
                      }
                      className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold transition-colors border border-indigo-200/50 dark:border-indigo-800/50"
                    >
                      {copiedIndex === 'prompt-csv-master' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 'prompt-csv-master' ? 'Copied!' : 'Copy Master Prompt'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 dark:bg-black p-3.5 rounded-xl font-mono text-xs text-slate-200 border border-slate-800 leading-relaxed whitespace-pre-wrap">
{`Act as an elite subject matter tutor. Create a 15-flashcard study deck on "[TOPIC]".

CRITICAL SPECIFICATION REQUIREMENTS:
1. Output strictly raw CSV text. Do NOT wrap in markdown code blocks or write conversational intros.
2. Header row must be exactly:
Term,Definition,Category
3. Term: The core concept, vocabulary, or question.
4. Definition: Clear, concise explanation or answer. Wrap the definition in double quotes ("") if it contains commas.
5. Category: Sub-domain classification.`}
                  </div>
                </div>
              </div>

              {/* Section 2: StickerBook STUDIO Image Prompts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    2. StickerBook STUDIO: Die-Cut Sticker Prompts (Tested for Imagen, Midjourney & DALL-E)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sticker Prompt 1 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                          Cosmic Voyagers
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              'Single die-cut sticker of a cute smiling cartoon astronaut cat floating in space holding a glowing golden star, vibrant pastel and neon color palette, glossy tactile vinyl texture, thick crisp white sticker contour border, subtle soft drop shadow, isolated on pure white background, playful character design, vector art, 8k resolution, high clarity, no text.',
                              'p1'
                            )
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-purple-600 dark:hover:text-purple-300"
                          title="Copy prompt"
                        >
                          {copiedIndex === 'p1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic">
                        "Single die-cut sticker of a cute smiling cartoon astronaut cat floating in space holding a glowing golden star, glossy tactile vinyl texture, thick crisp white sticker contour border..."
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                      Keywords: die-cut, white contour, glossy vinyl
                    </span>
                  </div>

                  {/* Sticker Prompt 2 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                          Prehistoric Titans
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              'Single die-cut vinyl sticker of a friendly chibi baby Tyrannosaurus Rex hatching from an egg with tiny green leaves, vibrant emerald and amber tones, glossy enamel shine, thick white sticker border outline, isolated on a clean white background, playful doodle illustration, crisp clean vector lines, no text.',
                              'p2'
                            )
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300"
                          title="Copy prompt"
                        >
                          {copiedIndex === 'p2' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic">
                        "Single die-cut vinyl sticker of a friendly chibi baby Tyrannosaurus Rex hatching from an egg, vibrant emerald tones, glossy enamel shine, thick white sticker border outline..."
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                      Keywords: chibi dinosaur, enamel shine
                    </span>
                  </div>

                  {/* Sticker Prompt 3 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                          Pixel Math Arcade
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              'Single 16-bit pixel-art sticker of a glittering gold high-score trophy topped with a pulsing lightning bolt, arcade retro colors, clean isometric view, thick white sticker die-cut contour border, drop shadow, isolated on pure white background, nostalgic arcade gaming asset, high contrast.',
                              'p3'
                            )
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-amber-600 dark:hover:text-amber-300"
                          title="Copy prompt"
                        >
                          {copiedIndex === 'p3' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic">
                        "Single 16-bit pixel-art sticker of a glittering gold high-score trophy topped with a pulsing lightning bolt, arcade retro colors, clean isometric view, thick white sticker contour border..."
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                      Keywords: 16-bit pixel art, isometric, retro trophy
                    </span>
                  </div>

                  {/* Sticker Prompt 4 */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wide">
                          Abyssal Bioluminescence
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              'Single die-cut sticker of a glowing translucent deep-sea jellyfish with neon cyan and magenta tentacles, bio-luminescent dots, glossy gel sticker finish, thick solid white sticker perimeter border, isolated on pure white background, magical underwater aesthetic, vector art.',
                              'p4-jelly'
                            )
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300"
                          title="Copy prompt"
                        >
                          {copiedIndex === 'p4-jelly' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic">
                        "Single die-cut sticker of a glowing translucent deep-sea jellyfish with neon cyan tentacles, bio-luminescent dots, thick solid white sticker perimeter border..."
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                      Keywords: bio-luminescent, glowing jellyfish, gel finish
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: ThemePack STUDIO Wallpaper Formula */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    3. ThemePack STUDIO: 16:9 Canvas Wallpaper Scene Formula
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                      Top-Down Desk & Study Canvas Wallpaper
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          'Pastel aesthetic flat-lay desk surface with open grid-lined notebook, subtle soft washi tape strips in corners, warm morning lighting, soft warm neutrals, cozy educational atmosphere, seamless top-down desktop illustration, ample negative space for placing stickers, 16:9 ratio, high quality.',
                          'p-wallpaper'
                        )
                      }
                      className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold transition-colors border border-purple-200/50 dark:border-purple-800/50"
                    >
                      {copiedIndex === 'p-wallpaper' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 'p-wallpaper' ? 'Copied!' : 'Copy Wallpaper Prompt'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 dark:bg-black p-3.5 rounded-xl font-mono text-xs text-slate-200 border border-slate-800 leading-relaxed">
                    "Pastel aesthetic flat-lay desk surface with open grid-lined notebook, subtle soft washi tape strips in corners, warm morning lighting, soft warm neutrals, cozy educational atmosphere, seamless top-down desktop illustration, ample negative space for placing stickers, 16:9 ratio, high quality."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: ARCHITECTURE & 4-ENGINE TOUR ================= */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-purple-900 dark:text-purple-200 block mb-0.5">
                    Architecture Alignment (Current App Version):
                  </span>
                  BrainGrid Studio is built with modern React 19, TypeScript 5.8, Tailwind CSS v4, and Vite 6. The app is organized into four cleanly isolated engines and three creative studios:
                </div>
              </div>

              {/* 4 Core Engines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Engine 1 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        Study & Memory Engine
                      </h5>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                        src/lib/engine.ts
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Provides Fisher-Yates card shuffling, distractor algorithm for 4-option quizzes without duplicates, and 2x3 (3 pairs), 3x4 (6 pairs), and 4x4 (8 pairs) matching grid board generation.
                  </p>
                </div>

                {/* Engine 2 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        Storage & IndexedDB Engine
                      </h5>
                      <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400">
                        src/lib/io.ts & indexedDBStorage.ts
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Quote-safe RFC 4180 CSV parser & serializer, open <code>.braingrid-vault-pack.json</code> combo/sticker file specs, and IndexedDB keyval caching for multi-megabyte canvas wallpapers and custom images.
                  </p>
                </div>

                {/* Engine 3 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        Procedural Web Audio Engine
                      </h5>
                      <span className="font-mono text-[10px] text-pink-600 dark:text-pink-400">
                        src/lib/sound.ts
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Zero-dependency Web Audio API oscillator synthesis generating tactile click pops, 3D card flips, match chimes, streak multipliers, and celebratory victory fanfares without external audio files.
                  </p>
                </div>

                {/* Engine 4 */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        Security, SVG & Offline PWA
                      </h5>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                        sanitizeSvg.ts & pwa.ts
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    DOMParser-based SVG sanitizer removing scripts/event-handlers from imported stickers, canvas image resizing/compression, and Vite PWA Service Worker caching for complete offline operation.
                  </p>
                </div>
              </div>

              {/* The 3 Studio Hubs */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>The 3 Integrated Studio Hubs</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                    <div className="font-bold text-xs text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>StudyCards STUDIO</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Card Flip with CSS 3D preserve-3d perspective, Matching Grid with streak multiplier, and Speed Quiz.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                    <div className="font-bold text-xs text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>StudyPack STUDIO</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Interactive dynamic prompt builder, 8 curated domain CSV samples, and quote-safe CSV import/export.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                    <div className="font-bold text-xs text-pink-700 dark:text-pink-300 mb-1 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>StickerBook STUDIO</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Freeform 2D sticker placement canvas, rotation, scale, mirror flip, layered scenes, and custom wallpapers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tech Stack Summary Badge Row */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Tech Stack:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    React 19
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    TypeScript 5.8
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    Tailwind CSS v4
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    Vite 6
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    Web Audio API
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    IndexedDB Keyval
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] border border-slate-200 dark:border-slate-600">
                    Vite PWA
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Co-developer reference synced with current app build. Open-spec & 100% offline capable.</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
