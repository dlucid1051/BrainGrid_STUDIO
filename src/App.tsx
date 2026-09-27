import React, { useState, useEffect } from 'react';
import { Deck, GridSize, StickerPack, StudyMode, StudySettings, ThemeMode, CanvasScene, PlacedSticker } from './types';
import { STARTER_DECKS } from './data/starterDecks';
import { INITIAL_STICKER_PACKS, CANVAS_SCENES } from './data/stickerPacks';
import { storage } from './lib/io';
import { idbLoadScenes, idbLoadPacks, idbLoadPlacedStickers } from './lib/indexedDBStorage';
import { sounds } from './lib/sound';
import { usePWAInstall } from './lib/pwa';
import { Header } from './components/Header';
import { CardFlipMode } from './components/CardFlipMode';
import { MatchingGridMode } from './components/MatchingGridMode';
import { QuizMode } from './components/QuizMode';
import { StickerVault } from './components/StickerVault';
import { StickerIconRenderer } from './components/StickerIconRenderer';
import { DeckManagerModal } from './components/DeckManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { UserGuideModal } from './components/UserGuideModal';
import confetti from 'canvas-confetti';
import { Sparkles, X } from 'lucide-react';

export default function App() {
  // Decks state: Preloaded starter decks + custom user decks
  const [customDecks, setCustomDecks] = useState<Deck[]>(() => storage.loadCustomDecks());
  // Merge starter decks with custom decks; custom decks override any starter deck with matching id
  const allDecks = [
    ...STARTER_DECKS.filter((s) => !customDecks.some((c) => c.id === s.id)),
    ...customDecks,
  ];

  const [selectedDeckId, setSelectedDeckId] = useState<string>(STARTER_DECKS[0].id);
  const [currentMode, setCurrentMode] = useState<StudyMode>('card-flip');
  const [settings, setSettings] = useState<StudySettings>(() => storage.loadSettings());

  // Sticker Packs & Custom Canvas Scenes
  const [customPacks, setCustomPacks] = useState<StickerPack[]>(() => storage.loadCustomPacks());
  const [customScenes, setCustomScenes] = useState<CanvasScene[]>(() => storage.loadCustomScenes());
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(() => storage.loadPlacedStickers());
  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>(() =>
    storage.loadUnlockedStickers()
  );

  const packs = [
    ...INITIAL_STICKER_PACKS.filter((p) => !customPacks.some((c) => c.id === p.id)),
    ...customPacks,
  ];

  // New Sticker Reward Notification Toast
  const [recentlyUnlockedSticker, setRecentlyUnlockedSticker] = useState<{
    name: string;
    icon: string;
    rarity: string;
  } | null>(null);

  // Modals
  const [isDeckManagerOpen, setIsDeckManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isTutorGuideOpen, setIsTutorGuideOpen] = useState(false);
  const [autoOpenPackStudio, setAutoOpenPackStudio] = useState(false);

  // PWA Install hook
  const { isInstallable, promptInstall } = usePWAInstall();

  // Sync settings sound toggle
  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // One-time self-healing synchronization on mount:
  // 1. Bidirectional sync between custom packs & scenes (leveraging IndexedDB and localStorage):
  //    - Guarantee every custom pack has a canvas backdrop scene
  //    - Guarantee every custom theme/scene (like Christmas) has a corresponding StickerPack in packs
  // 2. Preserve all custom backdrop images, unlocked stickers, and placed stickers securely
  useEffect(() => {
    let isCancelled = false;

    const syncStorage = async () => {
      // 1. Fetch from IndexedDB and localStorage in parallel
      const [idbScenes, idbPacks, idbPlaced] = await Promise.all([
        idbLoadScenes().catch(() => [] as CanvasScene[]),
        idbLoadPacks().catch(() => [] as StickerPack[]),
        idbLoadPlacedStickers().catch(() => [] as PlacedSticker[]),
      ]);

      if (isCancelled) return;

      const localScenes = storage.loadCustomScenes();
      const localPacks = storage.loadCustomPacks();
      const localPlaced = storage.loadPlacedStickers();

      // Merge placed stickers safely across IndexedDB and LocalStorage
      const placedMap = new Map<string, PlacedSticker>();
      for (const p of [...localPlaced, ...idbPlaced]) {
        if (p?.id) placedMap.set(p.id, p);
      }
      const cleanedPlaced = Array.from(placedMap.values());
      if (cleanedPlaced.length > 0 && !isCancelled) {
        setPlacedStickers(cleanedPlaced);
        storage.savePlacedStickers(cleanedPlaced);
      }

      // Built-in identifiers to preserve pristine separation
      const BUILT_IN_SCENE_IDS = new Set(CANVAS_SCENES.map((s) => s.id));
      const BUILT_IN_PACK_IDS = new Set(INITIAL_STICKER_PACKS.map((p) => p.id));
      const BUILT_IN_PACK_NAMES = new Set(INITIAL_STICKER_PACKS.map((p) => p.name.toLowerCase()));
      const BUILT_IN_SCENE_NAMES = new Set(CANVAS_SCENES.map((s) => s.name.toLowerCase()));

      // Merge scenes preserving highest-fidelity customConfig (e.g. image backdrop)
      const sceneMap = new Map<string, CanvasScene>();
      for (const sc of [...localScenes, ...idbScenes]) {
        if (!sc?.id) continue;
        // Purge any built-in scenes or phantom duplicates that leaked into custom storage
        if (
          BUILT_IN_SCENE_IDS.has(sc.id) ||
          sc.id === 'custom-pack-scene-ocean' ||
          sc.id.startsWith('custom-scene-scene-ocean') ||
          sc.id.startsWith('custom-scene-pack-ocean') ||
          (sc.name && BUILT_IN_SCENE_NAMES.has(sc.name.toLowerCase()) && !sc.customConfig?.imageUrl)
        ) {
          continue;
        }

        const existing = sceneMap.get(sc.id);
        if (!existing) {
          sceneMap.set(sc.id, sc);
        } else {
          // If the newer/other record has an image and existing doesn't, keep the image
          const hasImage = sc.customConfig?.type === 'image' && !!sc.customConfig?.imageUrl;
          const existingHasImage = existing.customConfig?.type === 'image' && !!existing.customConfig?.imageUrl;
          if (hasImage && !existingHasImage) {
            sceneMap.set(sc.id, sc);
          }
        }
      }
      const cleanedScenes: CanvasScene[] = Array.from(sceneMap.values()).map((sc) => ({
        ...sc,
        isCustom: true,
      }));

      // Merge packs
      const packMap = new Map<string, StickerPack>();
      for (const p of [...localPacks, ...idbPacks]) {
        if (!p?.id) continue;
        // Purge any built-in packs or phantom duplicate packs
        if (
          BUILT_IN_PACK_IDS.has(p.id) ||
          p.id === 'custom-pack-scene-ocean' ||
          p.id === 'custom-pack-pack-ocean' ||
          p.id.startsWith('custom-pack-scene-ocean') ||
          (p.name && BUILT_IN_PACK_NAMES.has(p.name.toLowerCase()) && (!p.stickers || p.stickers.length === 0)) ||
          (p.name && BUILT_IN_SCENE_NAMES.has(p.name.toLowerCase()) && (!p.stickers || p.stickers.length === 0))
        ) {
          continue;
        }
        packMap.set(p.id, p);
      }
      const cleanedPacks: StickerPack[] = Array.from(packMap.values()).map((p) => ({
        ...p,
        isCustom: true,
      }));

      if (!isCancelled) {
        setCustomPacks(cleanedPacks);
        storage.saveCustomPacks(cleanedPacks);

        setCustomScenes(cleanedScenes);
        storage.saveCustomScenes(cleanedScenes);

        // Reset active canvas scene ID if it references a scene that was deleted
        const allSceneIds = new Set([...CANVAS_SCENES.map((s) => s.id), ...cleanedScenes.map((s) => s.id)]);
        const currentSceneId = storage.loadCanvasSceneId();
        if (currentSceneId && !allSceneIds.has(currentSceneId)) {
          storage.saveCanvasSceneId('scene-notebook');
        }
      }
    };

    syncStorage();

    return () => {
      isCancelled = true;
    };
  }, []);

  // System Dark Mode detection & listener
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemPreference = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateSystemPreference);
      return () => mediaQuery.removeEventListener('change', updateSystemPreference);
    } else {
      // Compatibility fallback
      mediaQuery.addListener(updateSystemPreference);
      return () => mediaQuery.removeListener(updateSystemPreference);
    }
  }, []);

  // Compute active theme: 'system' defaults to OS prefers-color-scheme
  const activeThemeMode: ThemeMode = settings.themeMode || 'system';
  const isDarkActive = activeThemeMode === 'dark' 
    ? true 
    : activeThemeMode === 'light' 
    ? false 
    : isSystemDark;

  // Sync HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkActive) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkActive]);

  // Quick toggle between dark and light modes
  const handleToggleTheme = () => {
    sounds.playPop();
    const nextMode: ThemeMode = isDarkActive ? 'light' : 'dark';
    handleUpdateSettings({
      ...settings,
      themeMode: nextMode,
    });
  };

  // Persist custom decks
  const handleCreateDeck = (newDeck: Deck) => {
    const updated = [...customDecks, newDeck];
    setCustomDecks(updated);
    storage.saveCustomDecks(updated);
  };

  const handleUpdateDeck = (updatedDeck: Deck) => {
    const existsInCustom = customDecks.some((d) => d.id === updatedDeck.id);
    const customizedDeck: Deck = {
      ...updatedDeck,
      isCustom: true,
    };
    let updated: Deck[];
    if (existsInCustom) {
      updated = customDecks.map((d) => (d.id === updatedDeck.id ? customizedDeck : d));
    } else {
      updated = [...customDecks, customizedDeck];
    }
    setCustomDecks(updated);
    storage.saveCustomDecks(updated);
  };

  const handleDeleteDeck = (deckId: string) => {
    const updated = customDecks.filter((d) => d.id !== deckId);
    setCustomDecks(updated);
    storage.saveCustomDecks(updated);
    if (selectedDeckId === deckId) {
      setSelectedDeckId(STARTER_DECKS[0].id);
    }
  };

  const handleUpdateSettings = (newSettings: StudySettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  // Sticker unlock reward logic: Picks a locked sticker across available packs
  const handleUnlockRandomSticker = () => {
    const allStickers = packs.flatMap((p) => p.stickers);
    const lockedStickers = allStickers.filter((s) => !unlockedStickerIds.includes(s.id));

    if (lockedStickers.length === 0) return; // All already unlocked!

    const randomIndex = Math.floor(Math.random() * lockedStickers.length);
    const chosenSticker = lockedStickers[randomIndex];

    const updatedUnlocked = [...unlockedStickerIds, chosenSticker.id];
    setUnlockedStickerIds(updatedUnlocked);
    storage.saveUnlockedStickers(updatedUnlocked);

    // Trigger celebratory visual & sound
    sounds.playFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });

    setRecentlyUnlockedSticker({
      name: chosenSticker.name,
      icon: chosenSticker.svgIcon,
      rarity: chosenSticker.rarity,
    });
  };

  // Unlock an entire pack
  const handleUnlockPack = (packId: string) => {
    const updated = customPacks.map((p) =>
      p.id === packId
        ? {
            ...p,
            isUnlocked: true,
            stickers: p.stickers.map((s) => ({ ...s, isUnlocked: true })),
          }
        : p
    );
    setCustomPacks(updated);
    storage.saveCustomPacks(updated);

    const pack = packs.find((p) => p.id === packId);
    if (pack) {
      const newIds = pack.stickers.map((s) => s.id);
      const combined = Array.from(new Set([...unlockedStickerIds, ...newIds]));
      setUnlockedStickerIds(combined);
      storage.saveUnlockedStickers(combined);
    }
  };

  // Save/Create a custom pack (combo, stickers-only, or background-only)
  const handleSavePack = (pack: StickerPack, scene?: CanvasScene) => {
    const exists = customPacks.some((p) => p.id === pack.id);
    let updatedPacks: StickerPack[];
    if (exists) {
      updatedPacks = customPacks.map((p) => (p.id === pack.id ? pack : p));
    } else {
      updatedPacks = [...customPacks, pack];
    }
    setCustomPacks(updatedPacks);
    storage.saveCustomPacks(updatedPacks);

    // Save or update scene: ALWAYS guarantee an atmospheric scene exists for every custom pack
    // Merge scenes from state and storage to guarantee existing custom backdrop images are preserved
    const sceneMap = new Map<string, CanvasScene>();
    for (const sc of storage.loadCustomScenes()) {
      if (sc?.id) sceneMap.set(sc.id, sc);
    }
    for (const sc of customScenes) {
      if (sc?.id) {
        const existing = sceneMap.get(sc.id);
        if (!existing) {
          sceneMap.set(sc.id, sc);
        } else {
          // Preserve high-fidelity image backdrops
          const hasImage = sc.customConfig?.type === 'image' && !!sc.customConfig?.imageUrl;
          const existingHasImage = existing.customConfig?.type === 'image' && !!existing.customConfig?.imageUrl;
          if (hasImage || !existingHasImage) {
            sceneMap.set(sc.id, sc);
          }
        }
      }
    }
    const combinedExistingScenes = Array.from(sceneMap.values());

    let updatedScenes: CanvasScene[];
    if (scene) {
      const filteredScenes = combinedExistingScenes.filter(
        (s) => s.id !== scene.id && s.packId !== pack.id
      );
      updatedScenes = [...filteredScenes, scene];
    } else {
      const existingPackScene = combinedExistingScenes.find(
        (s) => s.packId === pack.id || s.id === pack.themeSceneId
      );
      if (existingPackScene) {
        updatedScenes = combinedExistingScenes.map((s) =>
          s.id === existingPackScene.id
            ? {
                ...s,
                name: pack.theme && pack.theme.toLowerCase() !== 'custom' ? pack.theme : pack.name,
                theme: pack.theme || pack.name,
              }
            : s
        );
      } else {
        updatedScenes = combinedExistingScenes;
      }
    }
    setCustomScenes(updatedScenes);
    storage.saveCustomScenes(updatedScenes);

    // Synchronize individual sticker unlock states with global unlockedStickerIds
    const packStickers = Array.isArray(pack.stickers) ? pack.stickers : [];
    const explicitUnlockedIds = packStickers
      .filter((s) => s.isUnlocked === true)
      .map((s) => s.id);
    const explicitLockedIds = new Set(
      packStickers
        .filter((s) => s.isUnlocked === false)
        .map((s) => s.id)
    );

    let updatedUnlockedIds: string[];
    if (pack.isUnlocked && explicitLockedIds.size === 0 && explicitUnlockedIds.length === 0) {
      // Entire pack is marked unlocked and no explicit per-sticker overrides
      const newIds = packStickers.map((s) => s.id);
      updatedUnlockedIds = Array.from(new Set([...unlockedStickerIds, ...newIds]));
    } else {
      updatedUnlockedIds = Array.from(
        new Set([
          ...unlockedStickerIds.filter((id) => !explicitLockedIds.has(id)),
          ...explicitUnlockedIds,
        ])
      );
    }
    setUnlockedStickerIds(updatedUnlockedIds);
    storage.saveUnlockedStickers(updatedUnlockedIds);
  };

  // Delete a custom pack
  const handleDeletePack = (packId: string) => {
    const targetPack = customPacks.find((p) => p.id === packId);
    const targetStickerIds = new Set(targetPack && Array.isArray(targetPack.stickers) ? targetPack.stickers.map((s) => s.id) : []);

    const updatedPacks = customPacks.filter((p) => p.id !== packId);
    setCustomPacks(updatedPacks);
    storage.saveCustomPacks(updatedPacks);

    const currentMemoryScenes = customScenes.length > 0 ? customScenes : storage.loadCustomScenes();
    const deletedSceneIds = new Set(
      currentMemoryScenes
        .filter((s) => s.packId === packId || s.id === targetPack?.themeSceneId)
        .map((s) => s.id)
    );
    const updatedScenes = currentMemoryScenes.filter(
      (s) => s.packId !== packId && s.id !== targetPack?.themeSceneId
    );
    setCustomScenes(updatedScenes);
    storage.saveCustomScenes(updatedScenes);

    // Remove deleted pack's stickers from unlockedStickerIds
    const updatedUnlocked = unlockedStickerIds.filter((id) => !targetStickerIds.has(id));
    setUnlockedStickerIds(updatedUnlocked);
    storage.saveUnlockedStickers(updatedUnlocked);

    // Prune placed stickers that were on the deleted scenes or used stickers from the deleted pack
    const currentPlaced = placedStickers;
    const cleanPlaced = currentPlaced.filter(
      (p) => (!p.sceneId || !deletedSceneIds.has(p.sceneId)) && !targetStickerIds.has(p.stickerId)
    );
    if (cleanPlaced.length !== currentPlaced.length) {
      setPlacedStickers(cleanPlaced);
      storage.savePlacedStickers(cleanPlaced);
    }

    // Reset active scene if it was deleted
    const currentActiveScene = storage.loadCanvasSceneId();
    if (deletedSceneIds.has(currentActiveScene)) {
      storage.saveCanvasSceneId('scene-notebook');
    }
  };

  // Toggle pack unlock status
  const handleToggleUnlockPack = (packId: string) => {
    const target = packs.find((p) => p.id === packId);
    if (!target) return;
    
    // Check if currently all stickers in this pack are unlocked
    const allUnlocked = target.stickers.length > 0 && target.stickers.every((s) => unlockedStickerIds.includes(s.id));
    const newUnlockedState = !allUnlocked;

    const updatedPacks = customPacks.map((p) => (p.id === packId ? { 
      ...p, 
      isUnlocked: newUnlockedState,
      stickers: p.stickers.map((s) => ({ ...s, isUnlocked: newUnlockedState }))
    } : p));
    setCustomPacks(updatedPacks);
    storage.saveCustomPacks(updatedPacks);

    const targetStickerIds = new Set(target.stickers.map((s) => s.id));
    let updatedUnlocked: string[];
    if (newUnlockedState) {
      updatedUnlocked = Array.from(new Set([...unlockedStickerIds, ...Array.from(targetStickerIds)]));
    } else {
      updatedUnlocked = unlockedStickerIds.filter((id) => !targetStickerIds.has(id));
    }
    setUnlockedStickerIds(updatedUnlocked);
    storage.saveUnlockedStickers(updatedUnlocked);
  };

  const handleResetProgress = () => {
    localStorage.clear();
    setCustomDecks([]);
    const defaultStickers = ['stk-space-1', 'stk-dino-1'];
    setUnlockedStickerIds(defaultStickers);
    storage.saveUnlockedStickers(defaultStickers);
    setPlacedStickers([]);
    storage.savePlacedStickers([]);
    const defaultSettings: StudySettings = {
      flipTimerDuration: 15,
      gridSize: '2x3',
      soundEnabled: true,
      autoFlip: true,
      cardOrientation: 'term-first',
      themeMode: 'system',
      cardBackgroundStyle: 'illustrated',
    };
    setSettings(defaultSettings);
    storage.saveSettings(defaultSettings);
    setSelectedDeckId(STARTER_DECKS[0].id);
  };

  const activeDeck = allDecks.find((d) => d.id === selectedDeckId) || allDecks[0];
  const allStickersList = packs.flatMap((p) => p.stickers);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 font-body transition-colors">
      {/* Top Header Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        decks={allDecks}
        selectedDeckId={selectedDeckId}
        onSelectDeck={setSelectedDeckId}
        onOpenDeckManager={() => setIsDeckManagerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorGuide={() => setIsUserGuideOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
        isInstallable={isInstallable}
        onInstallPWA={promptInstall}
        unlockedStickersCount={unlockedStickerIds.length}
        totalStickersCount={allStickersList.length}
        themeMode={activeThemeMode}
        isDark={isDarkActive}
        onToggleTheme={handleToggleTheme}
        logoGraphicId={settings.logoGraphicId}
      />

      {/* Main Study Arena */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-start">
        {currentMode === 'card-flip' && (
          <CardFlipMode
            deck={activeDeck}
            settings={settings}
            unlockedStickerIds={unlockedStickerIds}
            onUpdateSettings={handleUpdateSettings}
            onUnlockRandomSticker={handleUnlockRandomSticker}
            onOpenVault={() => setCurrentMode('sticker-vault')}
          />
        )}

        {currentMode === 'matching-grid' && (
          <MatchingGridMode
            deck={activeDeck}
            settings={settings}
            unlockedStickerIds={unlockedStickerIds}
            onUpdateGridSize={(size: GridSize) =>
              handleUpdateSettings({ ...settings, gridSize: size })
            }
            onUnlockRandomSticker={handleUnlockRandomSticker}
            onOpenVault={() => setCurrentMode('sticker-vault')}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizMode
            deck={activeDeck}
            settings={settings}
            unlockedStickerIds={unlockedStickerIds}
            onUnlockRandomSticker={handleUnlockRandomSticker}
            onOpenVault={() => setCurrentMode('sticker-vault')}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentMode === 'sticker-vault' && (
          <StickerVault
            packs={packs}
            unlockedStickerIds={unlockedStickerIds}
            customScenes={customScenes}
            placedStickersProp={placedStickers}
            onUpdatePlacedStickers={setPlacedStickers}
            onUnlockPack={handleUnlockPack}
            onSavePack={handleSavePack}
            onDeletePack={handleDeletePack}
            onToggleUnlockPack={handleToggleUnlockPack}
            initialOpenPackStudio={autoOpenPackStudio}
            onClosePackStudio={() => setAutoOpenPackStudio(false)}
          />
        )}
      </main>

      {/* Reward Unlock Toast Notification */}
      {recentlyUnlockedSticker && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border-2 border-pink-300 dark:border-pink-500/60 flex items-center gap-3.5 max-w-sm ring-4 ring-pink-100 dark:ring-pink-950/40">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[14px] flex items-center justify-center text-3xl overflow-hidden p-1">
                <StickerIconRenderer icon={recentlyUnlockedSticker.icon} alt={recentlyUnlockedSticker.name} size="md" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-100 dark:border-pink-900/60">
                  {recentlyUnlockedSticker.rarity} Sticker
                </span>
                <span className="text-xs">✨</span>
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                {recentlyUnlockedSticker.name} Unlocked!
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Added to your digital sticker book canvas!
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                setRecentlyUnlockedSticker(null);
                setCurrentMode('sticker-vault');
              }}
              className="px-2.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 hover:opacity-90"
            >
              StickerBook
            </button>

            <button
              onClick={() => setRecentlyUnlockedSticker(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <DeckManagerModal
        isOpen={isDeckManagerOpen}
        onClose={() => setIsDeckManagerOpen(false)}
        decks={allDecks}
        selectedDeckId={selectedDeckId}
        onSelectDeck={setSelectedDeckId}
        onCreateDeck={handleCreateDeck}
        onUpdateDeck={handleUpdateDeck}
        onDeleteDeck={handleDeleteDeck}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />

      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        onOpenDeckStudio={() => setIsDeckManagerOpen(true)}
        onOpenTutorGuide={() => {
          setIsUserGuideOpen(false);
          setIsTutorGuideOpen(true);
        }}
        onOpenThemeStudio={() => {
          setIsUserGuideOpen(false);
          setCurrentMode('sticker-vault');
          setAutoOpenPackStudio(true);
        }}
      />

      {/* Co-Developer Tutor Guide (theme inherited from main app setting) */}
      <TutorialModal
        isOpen={isTutorGuideOpen}
        onClose={() => setIsTutorGuideOpen(false)}
      />
    </div>
  );
}
