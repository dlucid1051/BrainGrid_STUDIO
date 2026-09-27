import React, { useState, useRef, useEffect } from 'react';
import { Deck, Flashcard } from '../types';
import { cardsToCSV, downloadFile, parseCSVToCards, storage } from '../lib/io';
import { sounds } from '../lib/sound';
import { 
  X, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  FileText, 
  Edit3, 
  Check, 
  Sparkles, 
  BookOpen, 
  FolderOpen,
  Save,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface DeckManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onCreateDeck: (newDeck: Deck) => void;
  onUpdateDeck: (updatedDeck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export const DeckManagerModal: React.FC<DeckManagerModalProps> = ({
  isOpen,
  onClose,
  decks,
  selectedDeckId,
  onSelectDeck,
  onCreateDeck,
  onUpdateDeck,
  onDeleteDeck,
}) => {
  const [activeTab, setActiveTab] = useState<'decks' | 'import-csv' | 'new-deck'>('decks');
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  
  // New Deck / Import Form State
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [csvContent, setCsvContent] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartEditDeck = (deck: Deck) => {
    sounds.playPop();
    setEditingDeckId(deck.id);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setCsvContent(cardsToCSV(deck.cards));
    setImportFeedback(null);
    setActiveTab('import-csv');
  };

  const handleStartNewDeck = () => {
    sounds.playPop();
    setEditingDeckId(null);
    setDeckTitle('');
    setDeckDescription('');
    setCsvContent('');
    setImportFeedback(null);
    setActiveTab('import-csv');
  };

  const handleCancelForm = () => {
    sounds.playPop();
    setEditingDeckId(null);
    setDeckTitle('');
    setDeckDescription('');
    setCsvContent('');
    setImportFeedback(null);
    setActiveTab('decks');
  };

  useEffect(() => {
    if (!isOpen) {
      setEditingDeckId(null);
      setDeckToDelete(null);
      setActiveTab('decks');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deckToDelete) {
          setDeckToDelete(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, deckToDelete, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvContent(text);
        if (!deckTitle) {
          setDeckTitle(file.name.replace(/\.csv$/i, '').replace(/[-_]/g, ' '));
        }
        sounds.playPop();
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle.trim()) {
      setImportFeedback('Please provide a title for your deck.');
      return;
    }

    const cards = parseCSVToCards(csvContent);
    if (cards.length === 0) {
      setImportFeedback('Could not find valid flashcard rows in this CSV. Please check formatting.');
      return;
    }

    if (editingDeckId) {
      const existingDeck = decks.find((d) => d.id === editingDeckId);
      const updatedDeck: Deck = {
        id: editingDeckId,
        title: deckTitle.trim(),
        description: deckDescription.trim() || `Deck with ${cards.length} cards`,
        icon: existingDeck?.icon || 'BookOpen',
        cards,
        isCustom: true,
        createdAt: existingDeck?.createdAt || Date.now(),
      };

      sounds.playCorrect();
      onUpdateDeck(updatedDeck);
      onSelectDeck(updatedDeck.id);
      setEditingDeckId(null);
      setDeckTitle('');
      setDeckDescription('');
      setCsvContent('');
      setImportFeedback(null);
      setActiveTab('decks');
    } else {
      const newDeck: Deck = {
        id: `deck-custom-${Date.now()}`,
        title: deckTitle.trim(),
        description: deckDescription.trim() || `Custom deck with ${cards.length} cards`,
        icon: 'BookOpen',
        cards,
        isCustom: true,
        createdAt: Date.now(),
      };

      sounds.playCorrect();
      onCreateDeck(newDeck);
      onSelectDeck(newDeck.id);
      setDeckTitle('');
      setDeckDescription('');
      setCsvContent('');
      setImportFeedback(null);
      setActiveTab('decks');
    }
  };

  const handleExportActiveDeck = (deck: Deck) => {
    sounds.playPop();
    const csvData = cardsToCSV(deck.cards);
    const filename = `${deck.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_cards.csv`;
    downloadFile(csvData, filename, 'text/csv');
  };

  const loadSampleCSV = () => {
    const sample = `Term,Definition,Category
Gravity,The invisible force pulling objects toward each other,Physics
Photosynthesis,Process where green plants transform light into food energy,Biology
Mitosis,Cell division resulting in two genetically identical cells,Biology
Atmosphere,Layers of gases enveloping a planet,Earth Science`;
    setCsvContent(sample);
    if (!deckTitle) setDeckTitle('Science Lab Flashcards');
    sounds.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xs flex items-center justify-center text-white shrink-0">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight leading-none bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                StudyPack
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60 leading-none">
                STUDIO
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('decks');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'decks'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Decks ({decks.length})
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setEditingDeckId(null);
              setDeckTitle('');
              setDeckDescription('');
              setCsvContent('');
              setImportFeedback(null);
              setActiveTab('import-csv');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'import-csv'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import/Edit CSV</span>
            {editingDeckId && (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/60">
                Editing
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40 dark:bg-slate-900/40">
          {activeTab === 'decks' ? (
            <div className="space-y-3">
              {decks.map((deck) => {
                const isSelected = selectedDeckId === deck.id;
                return (
                  <div
                    key={deck.id}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      onClick={() => {
                        sounds.playPop();
                        onSelectDeck(deck.id);
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                          {deck.title}
                        </h4>
                        {deck.isCustom && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-bold">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{deck.description}</p>
                      <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                        {deck.cards.length} Flashcards
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditDeck(deck);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                        title="Edit deck in Import/Edit CSV tab"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportActiveDeck(deck);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Download deck as CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {deck.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playPop();
                            setDeckToDelete(deck);
                          }}
                          className="p-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/80 transition-colors"
                          title="Delete custom deck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {isSelected && (
                        <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleStartNewDeck}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Import or Create New Deck</span>
              </button>
            </div>
          ) : (
            /* IMPORT / EDIT CSV FORM */
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                      {editingDeckId ? 'Edit Flashcards via CSV' : 'Import Flashcards via CSV'}
                    </h4>
                    {editingDeckId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-bold">
                        Editing Deck
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingDeckId
                      ? 'Modify title, description, or CSV rows below and click Save.'
                      : 'Upload a file or paste terms & definitions below.'}
                  </p>
                </div>
                {editingDeckId ? (
                  <button
                    type="button"
                    onClick={handleStartNewDeck}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Create New Deck Instead
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={loadSampleCSV}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Load Example CSV
                  </button>
                )}
              </div>

              {/* Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Deck Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    placeholder="e.g. French Food Words, Chemistry Elements"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Short Description (optional)
                  </label>
                  <input
                    type="text"
                    value={deckDescription}
                    onChange={(e) => setDeckDescription(e.target.value)}
                    placeholder="e.g. Unit 3 exam review"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* File Upload Button (Visible only when in Import mode) */}
              {!editingDeckId && (
                <div>
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/40 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Click to choose a .csv file from your computer</span>
                  </button>
                </div>
              )}

              {/* Paste CSV text area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {editingDeckId ? (
                    <>
                      Deck Flashcard Data (Format: <code className="text-indigo-600 dark:text-indigo-400 font-mono px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60">Term,Definition,Category</code>)
                    </>
                  ) : (
                    <>
                      Or Paste CSV Data (Format: <code className="text-indigo-600 dark:text-indigo-400 font-mono px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60">Term,Definition,Category</code>)
                    </>
                  )}
                </label>
                <textarea
                  rows={6}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={`Term,Definition,Category\nMars,The Red Planet,Astronomy\nVenus,The Hottest Planet,Astronomy`}
                  className="w-full p-3 font-mono text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                />
              </div>

              {importFeedback && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  {importFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    {editingDeckId ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Import</span>
                      </>
                    )}
                  </button>
                </div>
            </form>
          )}
        </div>

        {/* In-App Delete Confirmation Dialog Overlay */}
        {deckToDelete && (
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
            onClick={() => setDeckToDelete(null)}
          >
            <div 
              className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setDeckToDelete(null);
                }}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close"
                aria-label="Close delete dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-900/50 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                    Delete Custom Deck?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                    {deckToDelete.title}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-100">"{deckToDelete.title}"</span>? This will permanently remove this deck and its {deckToDelete.cards.length} flashcards.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setDeckToDelete(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    onDeleteDeck(deckToDelete.id);
                    setDeckToDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Deck</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
