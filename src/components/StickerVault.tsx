import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CanvasScene, PlacedSticker, Sticker, StickerPack, StickerRarity } from '../types';
import { CANVAS_SCENES } from '../data/stickerPacks';
import { PASTEL_COLOR_SETS, PastelSet, getRandomPastelSet } from '../data/pastelThemes';
import { NEON_COLOR_SETS, NeonSet, getRandomNeonSet } from '../data/neonThemes';
import { SpaceBackground } from './SpaceBackground';
import { PrehistoricBackground } from './PrehistoricBackground';
import { NeonBackground } from './NeonBackground';
import { OceanBackground } from './OceanBackground';
import { CustomCanvasBackground } from './CustomCanvasBackground';
import { ThemeAndPackManagerModal } from './ThemeAndPackManagerModal';
import { StickerIconRenderer } from './StickerIconRenderer';
import { sanitizeSvgMarkup } from '../lib/sanitizeSvg';
import { sounds } from '../lib/sound';
import { storage } from '../lib/io';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { 
  Sparkles, 
  RotateCw, 
  Trash2, 
  Download, 
  Lock, 
  Check, 
  Plus, 
  Image as ImageIcon,
  BookMarked,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  Shuffle,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  LayoutGrid,
  Filter,
  Clock,
  Camera,
  FlipHorizontal,
  Save,
  CheckCircle2,
} from 'lucide-react';

const cleanPackIcon = (icon?: string): string => {
  if (!icon) return '🎨';
  if (icon === 'Gamepad2' || icon === 'gamepad2') return '🎮';
  if (icon === 'Wand2' || icon === 'wand2') return '🪄';
  if (icon === 'Flower2' || icon === 'flower2') return '🌸';
  if (icon === 'Rocket') return '🚀';
  if (icon === 'Sparkles') return '✨';
  if (icon === 'Waves') return '🌊';
  if (icon === 'Cpu') return '⚡';
  return icon.replace(/2$/, '');
};

const cleanPackName = (name: string, isCustom?: boolean): string => {
  if (!name) return '';
  if (!isCustom) {
    return name.replace(/\s*2\b/g, '').trim();
  }
  return name;
};

interface ThemeThumbnailPreviewProps {
  scene: CanvasScene;
  linkedPack?: StickerPack;
}

const ThemeThumbnailPreview: React.FC<ThemeThumbnailPreviewProps> = ({ scene, linkedPack }) => {
  // 1. Uploaded Image wallpaper
  const imageUrl =
    scene.customConfig?.imageUrl ||
    scene.customConfig?.backgroundImageUrl ||
    (scene as any).imageUrl ||
    (scene as any).backgroundImageUrl;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={scene.name || 'Theme'}
        className="w-full h-full object-cover select-none pointer-events-none"
        loading="lazy"
        onError={(e) => {
          // If image fails to load, gracefully hide broken icon
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // 2. Custom SVG markup wallpaper
  const svgMarkup = scene.customConfig?.svgMarkup || (scene.customConfig as any)?.svg;
  if (svgMarkup && (scene.isCustom || !['stars', 'dots', 'arcade', 'ocean', 'notebook'].includes(scene.pattern || ''))) {
    const cleanSvg = sanitizeSvgMarkup(svgMarkup);
    return (
      <div
        className="w-full h-full overflow-hidden select-none pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover"
        dangerouslySetInnerHTML={{ __html: cleanSvg }}
      />
    );
  }

  // 3. Built-in atmospheric scene themes
  if (scene.pattern === 'stars') {
    return (
      <div className="w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center select-none pointer-events-none">
        <div className="absolute inset-0 bg-radial from-indigo-900/60 via-slate-950 to-slate-950" />
        <div className="w-1 h-1 rounded-full bg-white absolute top-2 left-2.5 shadow-[0_0_3px_#fff]" />
        <div className="w-0.5 h-0.5 rounded-full bg-indigo-300 absolute bottom-2 left-4" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200 absolute top-3 right-3 shadow-[0_0_4px_#fde047]" />
        <div className="w-1 h-1 rounded-full bg-purple-300 absolute bottom-1.5 right-3.5" />
        <span className="text-[9px] font-bold text-indigo-300/80 tracking-widest uppercase">Cosmos</span>
      </div>
    );
  }

  if (scene.pattern === 'dots') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#062c20] via-[#052118] to-[#02140f] relative overflow-hidden flex items-center justify-center select-none pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #34d399 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />
        <span className="text-[9px] font-bold text-emerald-300/80 tracking-widest uppercase">Chalk</span>
      </div>
    );
  }

  if (scene.pattern === 'arcade') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#18032e] via-[#0f051d] to-[#050014] relative overflow-hidden flex items-center justify-center select-none pointer-events-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #a855f7 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        />
        <span className="text-[9px] font-bold text-pink-300/90 tracking-widest uppercase">Neon</span>
      </div>
    );
  }

  if (scene.pattern === 'ocean') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#021526] via-[#03223f] to-[#041e2e] relative overflow-hidden flex items-center justify-center select-none pointer-events-none">
        <div className="w-6 h-6 rounded-full bg-cyan-400/20 blur-xs absolute" />
        <span className="text-[9px] font-bold text-cyan-300/85 tracking-widest uppercase">Ocean</span>
      </div>
    );
  }

  if (scene.pattern === 'notebook') {
    return (
      <div className="w-full h-full bg-[#fbf9f4] dark:bg-[#1a1c23] relative overflow-hidden flex items-center justify-center border-l-2 border-red-400/60 select-none pointer-events-none">
        <div
          className="absolute inset-0 opacity-25 dark:opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #60a5fa 1px, transparent 1px)',
            backgroundSize: '100% 7px',
          }}
        />
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">Notes</span>
      </div>
    );
  }

  // 4. Pack with no backdrop: USE FIRST STICKER AS THUMBNAIL (User requested!)
  const firstSticker = linkedPack?.stickers?.[0];
  if (firstSticker) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/70 flex items-center justify-center p-1 select-none pointer-events-none">
        <div className="transition-transform group-hover:scale-110">
          <StickerIconRenderer icon={firstSticker.svgIcon} alt={firstSticker.name} size="sm" />
        </div>
      </div>
    );
  }

  // 5. Fallback: pack icon
  return (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg select-none pointer-events-none">
      <span>{cleanPackIcon(linkedPack?.icon)}</span>
    </div>
  );
};

interface StickerVaultProps {
  packs: StickerPack[];
  unlockedStickerIds: string[];
  customScenes?: CanvasScene[];
  placedStickersProp?: PlacedSticker[];
  onUpdatePlacedStickers?: (stickers: PlacedSticker[]) => void;
  onUnlockPack: (packId: string) => void;
  onSavePack?: (pack: StickerPack, scene?: CanvasScene) => void;
  onDeletePack?: (packId: string) => void;
  onToggleUnlockPack?: (packId: string) => void;
  initialOpenPackStudio?: boolean;
  onClosePackStudio?: () => void;
}

export const StickerVault: React.FC<StickerVaultProps> = ({
  packs,
  unlockedStickerIds,
  customScenes: customScenesProp,
  placedStickersProp,
  onUpdatePlacedStickers,
  onUnlockPack,
  onSavePack,
  onDeletePack,
  onToggleUnlockPack,
  initialOpenPackStudio = false,
  onClosePackStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'album'>('canvas');
  const [selectedPackId, setSelectedPackId] = useState(packs[0].id);
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  
  // Pack & Theme Manager Modal State
  const [isPackManagerOpen, setIsPackManagerOpen] = useState(initialOpenPackStudio);

  useEffect(() => {
    if (initialOpenPackStudio) {
      setIsPackManagerOpen(true);
    }
  }, [initialOpenPackStudio]);

  const [customScenes, setCustomScenes] = useState<CanvasScene[]>(() => {
    const raw = storage.loadCustomScenes();
    const currentPacks = storage.loadCustomPacks();
    const seenIds = new Set<string>();
    const cleaned: CanvasScene[] = [];
    for (let i = raw.length - 1; i >= 0; i--) {
      const sc = raw[i];
      if (!sc) continue;
      if (sc.id && seenIds.has(sc.id)) continue;

      const matchingPack = currentPacks.find(
        (p) => (sc.packId && p.id === sc.packId) || (p.themeSceneId && p.themeSceneId === sc.id)
      );
      const rawThemeTag = matchingPack?.theme || sc.theme;
      const hasThemeTag =
        rawThemeTag &&
        rawThemeTag.trim() &&
        rawThemeTag.trim().toLowerCase() !== 'custom';
      const themeTagText = hasThemeTag ? rawThemeTag.trim() : '';

      const rawPackName = matchingPack?.name || sc.name;
      const packNameText = rawPackName ? rawPackName.replace(/\s+Theme$/i, '').trim() : '';
      const finalName = themeTagText || packNameText || 'Custom';

      if (sc.id) seenIds.add(sc.id);
      cleaned.unshift({
        ...sc,
        name: finalName,
        theme: themeTagText || sc.theme || packNameText,
      });
    }
    return cleaned;
  });

  // Sync with customScenes prop if provided from App.tsx
  useEffect(() => {
    if (customScenesProp) {
      setCustomScenes(customScenesProp);
    }
  }, [customScenesProp]);

  // Merge built-in scenes and user-created custom backdrop scenes (deduplicating by unique scene id)
  const scenes = useMemo(() => {
    const rawCustom = customScenes.filter((cs) => !CANVAS_SCENES.some((s) => s.id === cs.id));
    const seenIds = new Set<string>();
    const result: CanvasScene[] = [];

    // Built-in scenes first
    for (const sc of CANVAS_SCENES) {
      seenIds.add(sc.id);
      result.push(sc);
    }

    // Custom scenes (reverse so most recent wins if any duplicates exist)
    const customCleaned: CanvasScene[] = [];
    for (let i = rawCustom.length - 1; i >= 0; i--) {
      const cs = rawCustom[i];
      if (!cs || !cs.id || seenIds.has(cs.id)) continue;
      // Guarantee built-in ocean and core themes can never be duplicated in custom scenes
      if (
        cs.id === 'scene-ocean' ||
        cs.packId === 'pack-ocean' ||
        cs.pattern === 'ocean' ||
        cs.id.startsWith('custom-scene-pack-ocean') ||
        cs.id.startsWith('custom-scene-scene-ocean') ||
        cs.id.startsWith('custom-pack-scene-ocean')
      ) {
        continue;
      }
      seenIds.add(cs.id);
      customCleaned.unshift(cs);
    }

    return [...result, ...customCleaned];
  }, [customScenes]);

  const handleSavePackInternal = (pack: StickerPack, scene?: CanvasScene) => {
    setCustomScenes((prev) => {
      const filtered = prev.filter(
        (s) => (!scene || s.id !== scene.id) && s.packId !== pack.id
      );
      return scene ? [...filtered, scene] : filtered;
    });
    if (scene) {
      setActiveSceneId(scene.id);
    }
    if (onSavePack) {
      onSavePack(pack, scene);
    }
  };

  const handleDeletePackInternal = (packId: string) => {
    setCustomScenes((prev) => prev.filter((s) => s.packId !== packId));
    if (selectedPackId === packId) {
      const remainingPack = packs.find((p) => p.id !== packId);
      if (remainingPack) {
        setSelectedPackId(remainingPack.id);
      }
    }
    // If active canvas scene was linked to this pack, reset to default scene
    const activeSceneObj = scenes.find((s) => s.id === activeSceneId);
    if (activeSceneObj && activeSceneObj.packId === packId) {
      const defaultSceneId = CANVAS_SCENES[0].id;
      setActiveSceneId(defaultSceneId);
      storage.saveCanvasSceneId(defaultSceneId);
    }
    if (onDeletePack) {
      onDeletePack(packId);
    }
  };
  
  // Canvas State & Persistent Placed Stickers
  const [activeSceneId, setActiveSceneId] = useState(storage.loadCanvasSceneId());
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(() => {
    if (placedStickersProp && placedStickersProp.length > 0) return placedStickersProp;
    return storage.loadPlacedStickers();
  });
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Sync state when root placedStickersProp updates
  useEffect(() => {
    if (placedStickersProp) {
      setPlacedStickers(placedStickersProp);
    }
  }, [placedStickersProp]);

  // Centralized update function ensuring IndexedDB, memory cache, and App.tsx are in sync safely outside render
  const updatePlacedStickers = (updater: PlacedSticker[] | ((prev: PlacedSticker[]) => PlacedSticker[])) => {
    setPlacedStickers((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      queueMicrotask(() => {
        storage.savePlacedStickers(next);
        onUpdatePlacedStickers?.(next);
      });
      return next;
    });
  };

  // Pastel Theme State: alternates randomly across 7 pastel color sets
  const [activePastelId, setActivePastelId] = useState<string>(() => {
    const saved = storage.loadPastelColorId();
    if (saved && PASTEL_COLOR_SETS.some((s) => s.id === saved)) {
      return saved;
    }
    return getRandomPastelSet().id;
  });

  const activePastelSet: PastelSet =
    PASTEL_COLOR_SETS.find((s) => s.id === activePastelId) || PASTEL_COLOR_SETS[0];

  const handleAlternatePastel = () => {
    sounds.playPop();
    const nextSet = getRandomPastelSet(activePastelId);
    setActivePastelId(nextSet.id);
    storage.savePastelColorId(nextSet.id);
  };

  const handleSelectPastel = (id: string) => {
    sounds.playPop();
    setActivePastelId(id);
    storage.savePastelColorId(id);
  };

  // Neon Theme State: alternates across 5 vibrant neon cyber palettes
  const [activeNeonId, setActiveNeonId] = useState<string>(() => {
    const saved = storage.loadNeonColorId();
    if (saved && NEON_COLOR_SETS.some((s) => s.id === saved)) {
      return saved;
    }
    return getRandomNeonSet().id;
  });

  const activeNeonSet: NeonSet =
    NEON_COLOR_SETS.find((s) => s.id === activeNeonId) || NEON_COLOR_SETS[0];

  const handleAlternateNeon = () => {
    sounds.playPop();
    const nextSet = getRandomNeonSet(activeNeonId);
    setActiveNeonId(nextSet.id);
    storage.saveNeonColorId(nextSet.id);
  };

  const handleSelectNeon = (id: string) => {
    sounds.playPop();
    setActiveNeonId(id);
    storage.saveNeonColorId(id);
  };

  // Dragging state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Theme Scroller & Filter State (Option A & B)
  const [themeFilter, setThemeFilter] = useState<'all' | 'builtin' | 'custom'>('all');
  const [isThemeBrowserOpen, setIsThemeBrowserOpen] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const themeScrollerRef = useRef<HTMLDivElement>(null);

  // Quick Sticker Drawer State (Option A & B)
  const [drawerPackFilter, setDrawerPackFilter] = useState<string>('all');
  const [drawerRarityFilter, setDrawerRarityFilter] = useState<string>('all');
  const [drawerSearchQuery, setDrawerSearchQuery] = useState<string>('');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(false);
  const [recentStickerIds, setRecentStickerIds] = useState<string[]>([]);
  const stickerScrollerRef = useRef<HTMLDivElement>(null);

  const scrollThemes = (direction: 'left' | 'right') => {
    sounds.playPop();
    if (themeScrollerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      themeScrollerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollStickers = (direction: 'left' | 'right') => {
    sounds.playPop();
    if (stickerScrollerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      stickerScrollerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll active theme button into view in the horizontal scroller
  useEffect(() => {
    if (themeScrollerRef.current) {
      const activeEl = themeScrollerRef.current.querySelector<HTMLElement>(`[data-scene-id="${activeSceneId}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSceneId]);

  useEffect(() => {
    storage.saveCanvasSceneId(activeSceneId);
  }, [activeSceneId]);

  // Auto-reset clear confirmation after 6 seconds
  useEffect(() => {
    if (isConfirmingClear) {
      const timer = setTimeout(() => {
        setIsConfirmingClear(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmingClear]);

  // Unified list of all packs
  const allVaultPacks = useMemo(() => {
    return packs;
  }, [packs]);

  // Find all stickers across packs (guarantee unique sticker instances)
  const allStickers = useMemo(() => {
    const seen = new Set<string>();
    const list: Sticker[] = [];
    for (const p of allVaultPacks) {
      for (const s of p.stickers) {
        if (s && s.id) {
          const key = `${p.id || 'pack'}-${s.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push(s);
          }
        }
      }
    }
    return list;
  }, [allVaultPacks]);

  const getStickerById = (id: string): Sticker | undefined => allStickers.find((s) => s.id === id);

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];
  const activePack = allVaultPacks.find((p) => p.id === selectedPackId) || allVaultPacks[0] || packs[0];

  // Scene counts & filtering for theme scroller
  const builtinScenesCount = useMemo(() => scenes.filter((s) => !s.isCustom).length, [scenes]);
  const customScenesCount = useMemo(() => scenes.filter((s) => s.isCustom).length, [scenes]);

  const filteredScenes = useMemo(() => {
    return scenes.filter((sc) => {
      if (themeFilter === 'builtin' && sc.isCustom) return false;
      if (themeFilter === 'custom' && !sc.isCustom) return false;
      if (themeSearchQuery.trim()) {
        const q = themeSearchQuery.toLowerCase();
        const nameMatch = (sc.name || '').toLowerCase().includes(q);
        const themeMatch = (sc.theme || '').toLowerCase().includes(q);
        const linkedPack = allVaultPacks.find((p) => p.id === sc.packId || p.themeSceneId === sc.id);
        const packMatch = (linkedPack?.name || '').toLowerCase().includes(q);
        return nameMatch || themeMatch || !!packMatch;
      }
      return true;
    });
  }, [scenes, themeFilter, themeSearchQuery, allVaultPacks]);

  // Unlocked stickers and filtered drawer stickers (defensively deduplicated)
  const unlockedStickers = useMemo(() => {
    const seen = new Set<string>();
    const list: Sticker[] = [];
    for (const s of allStickers) {
      if (s && s.id && unlockedStickerIds.includes(s.id)) {
        const uniqueKey = `${s.packId || 'pack'}-${s.id}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          list.push(s);
        }
      }
    }
    return list;
  }, [allStickers, unlockedStickerIds]);

  const filteredDrawerStickers = useMemo(() => {
    return unlockedStickers.filter((s) => {
      if (drawerPackFilter === 'recent') {
        return recentStickerIds.includes(s.id);
      }
      if (drawerPackFilter !== 'all') {
        if (s.packId === drawerPackFilter) return true;
        const targetPack = allVaultPacks.find((p) => p.id === drawerPackFilter);
        if (targetPack && targetPack.stickers.some((st) => st.id === s.id)) return true;
        return false;
      }
      if (drawerRarityFilter !== 'all' && (s.rarity || '').toLowerCase() !== drawerRarityFilter.toLowerCase()) {
        return false;
      }
      if (drawerSearchQuery.trim()) {
        const q = drawerSearchQuery.toLowerCase();
        const nameMatch = (s.name || '').toLowerCase().includes(q);
        const tagMatch = s.tags?.some((t) => (t || '').toLowerCase().includes(q));
        return nameMatch || !!tagMatch;
      }
      return true;
    });
  }, [unlockedStickers, drawerPackFilter, drawerRarityFilter, drawerSearchQuery, recentStickerIds, allVaultPacks]);

  // Currently active/selected sticker data
  const activePlacedSticker = placedStickers.find((s) => s.id === activeStickerId);
  const activeStickerData = activePlacedSticker ? getStickerById(activePlacedSticker.stickerId) : undefined;

  // Stickers that belong to the currently viewed scene page (fallback unassigned to default notebook scene)
  const sceneStickers = useMemo(() => {
    return placedStickers.filter((s) => {
      if (!s.sceneId) {
        return activeSceneId === 'scene-notebook' || !activeSceneId;
      }
      return s.sceneId === activeSceneId;
    });
  }, [placedStickers, activeSceneId]);

  // Stamp sticker onto active canvas scene page
  const handleStampSticker = (stickerId: string) => {
    if (!unlockedStickerIds.includes(stickerId)) return;

    sounds.playStick();
    const stickerData = getStickerById(stickerId);
    const newPlaced: PlacedSticker = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stickerId,
      sceneId: activeSceneId,
      packId: activeScene?.packId || undefined,
      x: 30 + Math.random() * 40, // 30% to 70%
      y: 30 + Math.random() * 40,
      rotation: 0, // Primary direction (like in sticker drawer)
      scale: 1,
      isFlipped: false,
      stickerSnapshot: stickerData
        ? {
            name: stickerData.name,
            svgIcon: stickerData.svgIcon,
            rarity: stickerData.rarity,
          }
        : undefined,
    };

    updatePlacedStickers((prev) => [...prev, newPlaced]);
    setRecentStickerIds((prev) => [stickerId, ...prev.filter((id) => id !== stickerId)].slice(0, 12));
    setActiveStickerId(newPlaced.id);
    setActiveTab('canvas');
  };

  // Sticker manipulation
  const rotateActiveSticker = (deltaDeg: number) => {
    if (!activeStickerId) return;
    sounds.playPop();
    updatePlacedStickers((prev) =>
      prev.map((s) => (s.id === activeStickerId ? { ...s, rotation: (s.rotation + deltaDeg) % 360 } : s))
    );
  };

  const flipActiveStickerHorizontal = () => {
    if (!activeStickerId) return;
    sounds.playPop();
    updatePlacedStickers((prev) =>
      prev.map((s) => (s.id === activeStickerId ? { ...s, isFlipped: !s.isFlipped } : s))
    );
  };

  const scaleActiveSticker = (factor: number) => {
    if (!activeStickerId) return;
    sounds.playPop();
    updatePlacedStickers((prev) =>
      prev.map((s) =>
        s.id === activeStickerId
          ? { ...s, scale: Math.max(0.5, Math.min(2.5, +(s.scale * factor).toFixed(2))) }
          : s
      )
    );
  };

  const removeActiveSticker = () => {
    if (!activeStickerId) return;
    sounds.playPop();
    updatePlacedStickers((prev) => prev.filter((s) => s.id !== activeStickerId));
    setActiveStickerId(null);
  };

  const handleConfirmClear = () => {
    sounds.playPop();
    // Remove all stickers placed on this specific scene page
    updatePlacedStickers((prev) =>
      prev.filter((s) => (s.sceneId ? s.sceneId !== activeSceneId : activeSceneId !== 'scene-notebook'))
    );
    setActiveStickerId(null);
    setIsConfirmingClear(false);
  };

  // Canvas Screenshot Capture State & Handler
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [showShutterFlash, setShowShutterFlash] = useState(false);

  const handleCaptureScreenshot = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canvasRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      // Temporarily deselect any active sticker so selection outline doesn't show in photo
      const previousActiveSticker = activeStickerId;
      setActiveStickerId(null);

      // Trigger shutter flash
      setShowShutterFlash(true);
      sounds.playStick();
      setTimeout(() => setShowShutterFlash(false), 260);

      // Give React a frame to deselect before snapping
      await new Promise((res) => setTimeout(res, 90));

      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High-res retina screenshot
        skipFonts: true,
        filter: (node) => {
          if (node instanceof HTMLElement && node.getAttribute('data-capture-ignore') === 'true') {
            return false;
          }
          return true;
        },
      });

      if (previousActiveSticker) {
        setActiveStickerId(previousActiveSticker);
      }

      // Trigger fanfare audio, celebratory confetti burst, and success badge
      sounds.playFanfare();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
      setCaptureSuccess(true);
      setTimeout(() => setCaptureSuccess(false), 3500);

      // Download file automatically to Downloads folder
      const link = document.createElement('a');
      const safeName = (activeScene.name || 'BrainGrid-Canvas').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `BrainGrid-${safeName}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture canvas screenshot:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  // Mouse & Touch Drag Handling for Stickers on Canvas
  const handlePointerDown = (e: React.PointerEvent, placedId: string) => {
    e.stopPropagation();
    sounds.playPop();
    setActiveStickerId(placedId);
    setDraggingId(placedId);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const sticker = placedStickers.find((s) => s.id === placedId);
      if (sticker) {
        const currentPxX = (sticker.x / 100) * rect.width;
        const currentPxY = (sticker.y / 100) * rect.height;
        setDragOffset({
          x: clientX - (rect.left + currentPxX),
          y: clientY - (rect.top + currentPxY),
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const newPxX = e.clientX - rect.left - dragOffset.x;
    const newPxY = e.clientY - rect.top - dragOffset.y;

    const newX = Math.max(5, Math.min(95, (newPxX / rect.width) * 100));
    const newY = Math.max(5, Math.min(95, (newPxY / rect.height) * 100));

    // Smooth real-time coordinate update without heavy disk I/O per frame
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === draggingId ? { ...s, x: newX, y: newY } : s))
    );
  };

  const handlePointerUp = () => {
    if (draggingId) {
      setDraggingId(null);
      // Persist final placed position safely on drag release
      setPlacedStickers((current) => {
        queueMicrotask(() => {
          storage.savePlacedStickers(current);
          onUpdatePlacedStickers?.(current);
        });
        return current;
      });
    }
  };

  // Rarity color helpers
  const getRarityBadgeStyle = (rarity: StickerRarity) => {
    switch (rarity) {
      case 'Common':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rare':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Legendary':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Mythic':
        return 'bg-pink-100 text-pink-800 border-pink-300';
    }
  };

  // Background pattern styles
  const getSceneBackgroundClass = (pattern: string) => {
    switch (pattern) {
      case 'notebook':
        return `${activePastelSet.canvasBg} ${activePastelSet.canvasBorder} shadow-inner`;
      case 'stars':
        return 'bg-slate-950 text-white border-indigo-900';
      case 'dots':
        return 'bg-gradient-to-b from-[#062c20] via-[#052118] to-[#02140f] text-emerald-100 border-emerald-800/80 shadow-inner';
      case 'arcade':
        return `${activeNeonSet.canvasBg} ${activeNeonSet.canvasBorder} transition-all duration-500`;
      case 'ocean':
        return 'bg-gradient-to-b from-[#021526] via-[#03223f] to-[#041e2e] text-cyan-100 border-cyan-700/60 shadow-[0_0_25px_rgba(6,182,212,0.18)]';
      case 'custom-image':
      case 'custom-svg':
        return 'bg-slate-950 text-slate-100 border-indigo-700/50 shadow-xl';
      default:
        return 'bg-white text-slate-800';
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full px-2 sm:px-4 py-3">
      {/* Top StickerBook STUDIO Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-4 gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              StickerBook STUDIO
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 font-bold border border-pink-200 dark:border-pink-800/60 font-mono">
              {unlockedStickerIds.length} / {allStickers.length} Unlocked
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
            Your digital collectible album & creative canvas studio. Unlocks new stickers as you study!
          </p>
        </div>

        {/* Tab Controls & Pack Studio Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setIsPackManagerOpen(true);
            }}
            className="flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:shadow-sm transition-all cursor-pointer group shrink-0 min-h-[42px]"
            title="ThemePack STUDIO"
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg md:text-xl tracking-tight leading-none bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                ThemePack
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60 leading-none">
                STUDIO
              </span>
            </div>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold min-h-[42px]">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('canvas');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Sticker Book Canvas</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('album');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'album'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collectible Album</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'canvas' ? (
        /* ================= DIGITAL STICKER BOOK CANVAS ================= */
        <div className="w-full flex flex-col items-center">
          {/* Canvas Toolbar: Scene Picker & Sticker Transformation Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3 p-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            {/* Scene Picker & Scroller */}
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Theme:</span>

                {/* Source Filter Chips (visible if custom scenes exist) */}
                {customScenesCount > 0 && (
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setThemeFilter('all')}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        themeFilter === 'all'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                      title={`Show all ${scenes.length} themes`}
                    >
                      All ({scenes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeFilter('builtin')}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        themeFilter === 'builtin'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                      title={`Show built-in default themes (${builtinScenesCount})`}
                    >
                      Built-in
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeFilter('custom')}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        themeFilter === 'custom'
                          ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                      title={`Show custom themes created in ThemePack STUDIO (${customScenesCount})`}
                    >
                      Studio ({customScenesCount})
                    </button>
                  </div>
                )}
              </div>

              {/* Horizontal Scroller with Left & Right Chevrons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollThemes('left')}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Scroll themes left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div
                  ref={themeScrollerRef}
                  className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 max-w-[220px] sm:max-w-[320px] md:max-w-[420px] lg:max-w-[540px] py-0.5 px-0.5"
                >
                  {filteredScenes.map((sc) => (
                    <button
                      key={sc.id}
                      data-scene-id={sc.id}
                      onClick={() => {
                        sounds.playPop();
                        if (sc.id === 'scene-notebook') {
                          // Alternate randomly through pastel color sets
                          const nextSet = getRandomPastelSet(activePastelId);
                          setActivePastelId(nextSet.id);
                          storage.savePastelColorId(nextSet.id);
                        }
                        if (sc.id === 'scene-arcade' || sc.id === 'scene-cyber') {
                          // Alternate randomly through neon color sets
                          const nextSet = getRandomNeonSet(activeNeonId);
                          setActiveNeonId(nextSet.id);
                          storage.saveNeonColorId(nextSet.id);
                        }
                        setActiveSceneId(sc.id);
                        storage.saveCanvasSceneId(sc.id);
                        setActiveStickerId(null);
                        setIsConfirmingClear(false);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        activeSceneId === sc.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                      }`}
                    >
                      {sc.id === 'scene-notebook' && (
                        <span
                          className="w-2 h-2 rounded-full transition-colors duration-300 shadow-2xs shrink-0"
                          style={{ backgroundColor: activePastelSet.swatchHex }}
                        />
                      )}
                      {(sc.id === 'scene-arcade' || sc.id === 'scene-cyber') && (
                        <span
                          className="w-2 h-2 rounded-full transition-all duration-300 shadow-2xs shrink-0"
                          style={{ background: activeNeonSet.swatchGradient }}
                        />
                      )}
                      <span>
                        {(() => {
                          if (!sc.isCustom) {
                            return sc.name.split(' ')[0];
                          }
                          // Find linked pack to get the user's Theme Tag and Pack Name
                          const linkedPack = packs.find(
                            (p) => p.id === sc.packId || p.themeSceneId === sc.id
                          );
                          const rawThemeTag = linkedPack?.theme || sc.theme;
                          const hasThemeTag =
                            rawThemeTag &&
                            rawThemeTag.trim() &&
                            rawThemeTag.trim().toLowerCase() !== 'custom';
                          const themeTagText = hasThemeTag ? rawThemeTag.trim() : '';

                          const rawPackName = linkedPack?.name || sc.name;
                          const packNameText = rawPackName
                            ? rawPackName.replace(/\s+Theme$/i, '').trim()
                            : '';

                          // Use Theme Tag text as default; if not set or blank then Pack Name text
                          const caption = themeTagText || packNameText || 'Custom';
                          return caption.length > 16 ? caption.slice(0, 14) + '..' : caption;
                        })()}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollThemes('right')}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Scroll themes right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Browse All Themes Button (Option B Theme Browser Drawer) */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setIsThemeBrowserOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shrink-0 ml-0.5"
                  title="Browse all themes in visual grid (Option B)"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden md:inline">Browse</span>
                </button>
              </div>

              {/* Pastel Theme Color Alternator & Swatch Palette */}
              {activeSceneId === 'scene-notebook' && (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleAlternatePastel}
                    title="Randomly alternate through 7 pastel color sets (Amber, Lavender, Peach, Teal, Pink, Baby Blue, Matcha)"
                    className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/70 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                  >
                    <Shuffle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span>Shuffle Pastel</span>
                  </button>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border hidden md:inline-flex items-center gap-1 ${activePastelSet.badgeClass}`}>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: activePastelSet.swatchHex }}
                    />
                    <span>{activePastelSet.name}</span>
                  </span>

                  {/* 7 Pastel Swatch Buttons */}
                  <div className="flex items-center gap-1" title="Select a pastel set">
                    {PASTEL_COLOR_SETS.map((set) => (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => handleSelectPastel(set.id)}
                        title={`${set.name}: ${set.description}`}
                        className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                          activePastelId === set.id
                            ? 'ring-2 ring-purple-600 dark:ring-purple-400 ring-offset-1 scale-115 shadow-xs'
                            : 'opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                        style={{ backgroundColor: set.swatchHex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Neon Theme Color Alternator & Swatch Palette */}
              {(activeSceneId === 'scene-arcade' || activeSceneId === 'scene-cyber') && (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleAlternateNeon}
                    title="Randomly alternate through 5 vibrant Neon palettes (Synthwave, Acid Tokyo, Outrun Sunset, Laser Ice, Vapor Amethyst)"
                    className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800/70 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/60 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                  >
                    <Shuffle className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-400" />
                    <span>Shuffle Neon</span>
                  </button>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border hidden md:inline-flex items-center gap-1 ${activeNeonSet.badgeClass}`}>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: activeNeonSet.swatchGradient }}
                    />
                    <span>{activeNeonSet.name}</span>
                  </span>

                  {/* 5 Neon Swatch Buttons */}
                  <div className="flex items-center gap-1" title="Select a neon palette">
                    {NEON_COLOR_SETS.map((set) => (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => handleSelectNeon(set.id)}
                        title={`${set.name}: ${set.description}`}
                        className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                          activeNeonId === set.id
                            ? 'ring-2 ring-fuchsia-500 ring-offset-1 scale-115 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                            : 'opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                        style={{ background: set.swatchGradient }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Sticker Actions */}
            <div className="flex items-center gap-1.5 ml-auto">
              {activeStickerData && activeStickerId && (
                <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-indigo-50/90 dark:bg-indigo-950/60 rounded-xl border border-indigo-200 dark:border-indigo-800 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1 px-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 max-w-[100px] sm:max-w-[140px] truncate">
                    <span>{activeStickerData.svgIcon}</span>
                    <span className="truncate hidden sm:inline">{activeStickerData.name}</span>
                  </div>
                  <div className="w-[1px] h-4 bg-indigo-200 dark:bg-indigo-800 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => rotateActiveSticker(-15)}
                    className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Rotate Left (-15°)"
                  >
                    <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 -scale-x-100" />
                  </button>
                  <button
                    type="button"
                    onClick={() => rotateActiveSticker(15)}
                    className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Rotate Right (+15°)"
                  >
                    <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={flipActiveStickerHorizontal}
                    className={`p-1 sm:p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      activePlacedSticker?.isFlipped
                        ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-200 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    title={activePlacedSticker?.isFlipped ? "Mirror Horizontal (Currently flipped - Click to revert)" : "Mirror Horizontal (Flip)"}
                    aria-label="Mirror sticker horizontally"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scaleActiveSticker(1.15)}
                    className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Grow Sticker (+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scaleActiveSticker(0.85)}
                    className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Shrink Sticker (-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={removeActiveSticker}
                    className="p-1 sm:p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                    title="Peel Off / Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setActiveStickerId(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Drop sticker onto scene"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Drop</span>
                  </button>
                  <div className="w-[1px] h-4 bg-indigo-200 dark:bg-indigo-800 mx-0.5" />
                </div>
              )}

              {/* Clear Page Option with In-App Confirmation */}
              {isConfirmingClear ? (
                <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="text-xs text-red-600 dark:text-red-400 font-bold hidden sm:inline">
                    Clear {sceneStickers.length} sticker{sceneStickers.length > 1 ? 's' : ''}?
                  </span>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(false)}
                    className="px-2 py-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (sceneStickers.length === 0) return;
                      sounds.playPop();
                      setIsConfirmingClear(true);
                    }}
                    disabled={sceneStickers.length === 0}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                      sceneStickers.length === 0
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer'
                    }`}
                    title={sceneStickers.length === 0 ? 'No stickers on this page to clear' : `Clear all ${sceneStickers.length} stickers from this page`}
                  >
                    Clear Page
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* THE STICKER CANVAS */}
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={(e) => {
              // Only deselect if clicked the canvas background directly
              if (e.target === canvasRef.current || (e.target as HTMLElement).getAttribute('data-canvas-bg') === 'true') {
                setActiveStickerId(null);
                setIsConfirmingClear(false);
              }
            }}
            className={`relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border-4 shadow-xl select-none transition-all duration-500 ${getSceneBackgroundClass(
              activeScene.pattern
            )}`}
            style={{ touchAction: 'none' }}
          >
            {/* Visual Scene Elements based on pattern */}
            {activeScene.pattern === 'notebook' && (
              <div 
                data-canvas-bg="true" 
                className="absolute inset-0 opacity-45 transition-all duration-500" 
                style={{
                  backgroundImage: `radial-gradient(${activePastelSet.dotColor} 1.2px, transparent 1.2px)`,
                  backgroundSize: '20px 20px',
                }}
              />
            )}
            {activeScene.pattern === 'stars' && !activeScene.isCustom && (
              <SpaceBackground />
            )}
            {activeScene.pattern === 'dots' && !activeScene.isCustom && (
              <PrehistoricBackground />
            )}
            {activeScene.pattern === 'arcade' && !activeScene.isCustom && (
              <NeonBackground neonSet={activeNeonSet} />
            )}
            {activeScene.pattern === 'ocean' && !activeScene.isCustom && (
              <OceanBackground />
            )}
            {(activeScene.isCustom || activeScene.pattern === 'custom-image' || activeScene.pattern === 'custom-svg') && activeScene.customConfig && (
              <CustomCanvasBackground config={activeScene.customConfig} />
            )}

            {/* Watermark Label */}
            <div className={`absolute top-4 left-5 pointer-events-none opacity-45 text-xs font-display font-bold uppercase tracking-wider transition-colors duration-500 ${
              activeScene.pattern === 'notebook'
                ? activePastelSet.accentText
                : activeScene.pattern === 'stars'
                ? 'text-indigo-300'
                : activeScene.pattern === 'dots'
                ? 'text-emerald-300'
                : activeScene.pattern === 'arcade'
                ? activeNeonSet.accentText
                : activeScene.pattern === 'ocean'
                ? 'text-cyan-300'
                : 'text-indigo-300'
            }`}>
              {activeScene.pattern === 'notebook' 
                ? `Pastel • ${activePastelSet.name}` 
                : activeScene.pattern === 'arcade'
                ? `Neon • ${activeNeonSet.name}`
                : activeScene.name} • {sceneStickers.length} Stickers Placed
            </div>

            {/* Empty Canvas Guidance */}
            {sceneStickers.length === 0 && (
              <div data-canvas-bg="true" className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 cursor-default">
                <h4 className={`font-display font-bold text-base pointer-events-none ${
                  activeScene.pattern === 'stars' || activeScene.pattern === 'dots' || activeScene.pattern === 'arcade' || activeScene.pattern === 'ocean' || activeScene.isCustom
                    ? 'text-slate-200'
                    : 'text-slate-700 dark:text-slate-200'
                }`}>
                  Your Sticker Book is Ready
                </h4>
                <p className={`text-xs max-w-xs mt-1 pointer-events-none ${
                  activeScene.pattern === 'stars'
                    ? 'text-slate-400'
                    : activeScene.pattern === 'dots'
                    ? 'text-emerald-200/70'
                    : activeScene.pattern === 'arcade'
                    ? 'text-fuchsia-200/70'
                    : activeScene.pattern === 'ocean'
                    ? 'text-cyan-200/70'
                    : activeScene.isCustom
                    ? 'text-indigo-200/70'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Click any unlocked sticker from the drawer below or study deck rounds to collect more!
                </p>
              </div>
            )}

            {/* Placed Stickers on Canvas */}
            {sceneStickers.map((placed) => {
              const liveSticker = getStickerById(placed.stickerId);
              const sticker: Sticker = liveSticker || (placed.stickerSnapshot ? {
                id: placed.stickerId,
                name: placed.stickerSnapshot.name,
                svgIcon: placed.stickerSnapshot.svgIcon,
                rarity: placed.stickerSnapshot.rarity || 'Common',
                color: '#6366f1',
                description: placed.stickerSnapshot.name,
                packId: placed.packId || 'custom',
              } : {
                id: placed.stickerId,
                name: 'Placed Sticker',
                svgIcon: '✨',
                rarity: 'Common' as const,
                color: '#6366f1',
                description: 'Custom sticker',
                packId: placed.packId || 'custom',
              });
              const isSelected = activeStickerId === placed.id;

              return (
                <div
                  key={placed.id}
                  id={`placed-sticker-${placed.id}`}
                  onPointerDown={(e) => handlePointerDown(e, placed.id)}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    if (draggingId) setDraggingId(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStickerId(placed.id);
                  }}
                  style={{
                    left: `${placed.x}%`,
                    top: `${placed.y}%`,
                    transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
                  }}
                  className={`absolute cursor-grab active:cursor-grabbing transition-transform select-none ${
                    isSelected ? 'z-30' : 'z-10'
                  }`}
                  title={`${sticker.name} (${sticker.rarity}) - Click to move or edit`}
                >
                  <div className="relative group flex items-center justify-center p-1.5">
                    {/* Die-Cut Shaped Sticker with 2px White Contour Border (Transparent background, no white card) */}
                    <div
                      style={{
                        transform: placed.isFlipped ? 'scaleX(-1)' : undefined,
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      className="inline-flex items-center justify-center pointer-events-auto"
                    >
                      <div
                        className={`die-cut-sticker ${
                          isSelected ? 'die-cut-sticker-selected scale-105' : 'hover:scale-105'
                        } flex items-center justify-center transition-transform`}
                      >
                        <StickerIconRenderer icon={sticker.svgIcon} alt={sticker.name} size="xl" />
                      </div>
                    </div>

                    {/* Selected Indicator Bounding Box & Blue Selection Aura (Visible until dropped) */}
                    {isSelected && (
                      <>
                        {/* Ambient Blue Selection Aura */}
                        <div className="absolute -inset-1 rounded-2xl bg-blue-500/25 blur-md pointer-events-none animate-pulse" />

                        {/* Dashed Bounding Frame */}
                        <div className="absolute -inset-2 border-2 border-dashed border-blue-500 dark:border-blue-400 rounded-2xl pointer-events-none animate-pulse shadow-[0_0_16px_rgba(59,130,246,0.45)]" />

                        {/* Floating Status Pill with Name */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1.5 z-40">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                          <span>{sticker.name}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Shutter Flash Animation Effect */}
            {showShutterFlash && (
              <div
                data-capture-ignore="true"
                className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200 opacity-80"
              />
            )}

            {/* Backdrop Bottom-Right Corner Camera Snapshot Button */}
            <div
              data-capture-ignore="true"
              className="absolute bottom-3 right-3 z-30 flex items-center gap-2 pointer-events-auto"
            >
              {captureSuccess && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-lg animate-bounce">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Downloads!</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleCaptureScreenshot}
                disabled={isCapturing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/65 dark:bg-slate-900/65 hover:bg-white/85 dark:hover:bg-slate-900/85 backdrop-blur-md border border-slate-200/65 dark:border-slate-700/65 text-slate-800 dark:text-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer group"
                title="Capture screenshot of this backdrop & placed stickers to save or share"
                aria-label="Capture and save screenshot"
              >
                <Camera className={`w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform ${isCapturing ? 'animate-spin' : ''}`} />
                <span className="text-xs font-bold hidden sm:inline">
                  {isCapturing ? 'Snapping...' : 'Snapshot'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Sticker Drawer Carousel at the Bottom */}
          <div className="w-full mt-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
            {/* Drawer Header with Filter & Layout Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Sticker Tray ({filteredDrawerStickers.length}):</span>
                </span>

                {/* Pack Filter Dropdown */}
                <select
                  value={drawerPackFilter}
                  onChange={(e) => {
                    sounds.playPop();
                    setDrawerPackFilter(e.target.value);
                  }}
                  className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-hidden"
                >
                  <option value="all">All Packs ({unlockedStickers.length})</option>
                  {recentStickerIds.length > 0 && (
                    <option value="recent">Recently Used ({recentStickerIds.length})</option>
                  )}
                  {allVaultPacks.map((p) => {
                    const count = p.stickers.filter((s) => unlockedStickerIds.includes(s.id)).length;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} ({count})
                      </option>
                    );
                  })}
                </select>

                {/* Rarity Filter Dropdown */}
                <select
                  value={drawerRarityFilter}
                  onChange={(e) => {
                    sounds.playPop();
                    setDrawerRarityFilter(e.target.value);
                  }}
                  className="text-xs font-semibold px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-hidden"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search stickers..."
                    value={drawerSearchQuery}
                    onChange={(e) => setDrawerSearchQuery(e.target.value)}
                    className="text-xs pl-6 pr-6 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 w-28 sm:w-36 focus:w-44 transition-all focus:outline-hidden focus:ring-1 focus:ring-pink-500"
                  />
                  {drawerSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDrawerSearchQuery('')}
                      className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* View Full Album & Tray Expand/Collapse Toggle (Option B!) */}
              <div className="flex items-center gap-1.5">
                {/* Option B: Expand Tray Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setIsDrawerExpanded(!isDrawerExpanded);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDrawerExpanded
                      ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                  title={isDrawerExpanded ? 'Switch to Compact 2-Row Strip' : 'Expand to Multi-Row Drawer Tray (Option B)'}
                >
                  {isDrawerExpanded ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-pink-500" />
                      <span className="hidden sm:inline">Compact Strip</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Expand Tray</span>
                    </>
                  )}
                </button>

                {/* Left & Right Chevrons (shown in Compact Strip mode) */}
                {!isDrawerExpanded && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollStickers('left')}
                      className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Scroll stickers left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollStickers('right')}
                      className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Scroll stickers right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('album');
                  }}
                  className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 cursor-pointer pl-1 hidden sm:inline"
                >
                  Full Album →
                </button>
              </div>
            </div>

            {/* Sticker Area */}
            {filteredDrawerStickers.length === 0 ? (
              <div className="py-5 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-200 dark:border-slate-750">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {drawerPackFilter !== 'all' && drawerPackFilter !== 'recent' && allVaultPacks.find((p) => p.id === drawerPackFilter)?.stickers.length === 0
                    ? `"${allVaultPacks.find((p) => p.id === drawerPackFilter)?.name}" is currently a backdrop theme with no stickers minted yet.`
                    : 'No unlocked stickers match your active search or filter.'}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {drawerPackFilter !== 'all' && drawerPackFilter !== 'recent' && allVaultPacks.find((p) => p.id === drawerPackFilter)?.stickers.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setIsPackManagerOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 cursor-pointer transition-colors"
                    >
                      Mint Stickers in STUDIO →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerPackFilter('all');
                      setDrawerRarityFilter('all');
                      setDrawerSearchQuery('');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 cursor-pointer transition-colors"
                  >
                    Reset Drawer Filters
                  </button>
                </div>
              </div>
            ) : isDrawerExpanded ? (
              /* Option B: Expanded Multi-Row Tray Grid */
              <div className="max-h-72 overflow-y-auto p-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                {filteredDrawerStickers.map((sticker, idx) => (
                  <button
                    key={`${sticker.packId || 'pack'}-${sticker.id}-${idx}`}
                    onClick={() => handleStampSticker(sticker.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all active:scale-95 group cursor-pointer shadow-2xs"
                    title={`Click to stamp ${sticker.name} (${sticker.rarity})`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xl shadow-2xs group-hover:scale-110 transition-transform p-1">
                      <div className="die-cut-sticker">
                        <StickerIconRenderer icon={sticker.svgIcon} alt={sticker.name} size="sm" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 w-full truncate text-center">
                      {sticker.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              /* Option A: Space-Efficient 2-Row Horizontal Scroller */
              <div
                ref={stickerScrollerRef}
                className="overflow-x-auto py-1 px-1 grid grid-rows-2 grid-flow-col auto-cols-max gap-2 scroll-smooth"
              >
                {filteredDrawerStickers.map((sticker, idx) => (
                  <button
                    key={`${sticker.packId || 'pack'}-${sticker.id}-${idx}`}
                    onClick={() => handleStampSticker(sticker.id)}
                    className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-500/50 transition-all active:scale-95 shrink-0 group cursor-pointer w-[68px] sm:w-[72px]"
                    title={`Click to stamp ${sticker.name} (${sticker.rarity})`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition-transform p-0.5">
                      <div className="die-cut-sticker">
                        <StickerIconRenderer icon={sticker.svgIcon} alt={sticker.name} size="sm" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 w-full truncate text-center leading-tight">
                      {sticker.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= STICKER ALBUM & PACK BROWSER ================= */
        <div className="w-full flex flex-col items-center">
          {/* Pack Selection Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 mb-4">
            {packs.map((pack) => {
              const packUnlockedCount = pack.stickers.filter((s) => unlockedStickerIds.includes(s.id)).length;
              const isSelected = selectedPackId === pack.id;

              return (
                <button
                  key={pack.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedPackId(pack.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cleanPackName(pack.name, pack.isCustom)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {packUnlockedCount} / {pack.stickers.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Pack Info Banner */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-xs mb-5">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>{cleanPackName(activePack.name, activePack.isCustom)}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-indigo-800/60">
                  {activePack.theme}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{activePack.description}</p>
            </div>

            {!activePack.isUnlocked && (
              <button
                onClick={() => {
                  sounds.playFanfare();
                  confetti({ particleCount: 50 });
                  onUnlockPack(activePack.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-xs hover:shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Unlock Pack Free</span>
              </button>
            )}
          </div>

          {/* Stickers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 w-full">
            {activePack.stickers.map((sticker, idx) => {
              const isUnlocked = unlockedStickerIds.includes(sticker.id);

              return (
                <div
                  key={`${activePack.id}-${sticker.id}-${idx}`}
                  onClick={() => {
                    if (isUnlocked) {
                      handleStampSticker(sticker.id);
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className={`relative p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                    isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-lg cursor-pointer group active:scale-95'
                      : 'bg-slate-100/80 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {/* Rarity Pill */}
                  <span
                    className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border mb-3 ${getRarityBadgeStyle(
                      sticker.rarity
                    )}`}
                  >
                    {sticker.rarity}
                  </span>

                  {/* Sticker Graphic Container */}
                  <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3">
                    {isUnlocked ? (
                      <div className="die-cut-sticker transition-transform group-hover:scale-110 flex items-center justify-center">
                        <StickerIconRenderer icon={sticker.svgIcon} alt={sticker.name} size="lg" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                        <Lock className="w-6 h-6 mb-1 text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] font-bold">Locked</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                    {isUnlocked ? sticker.name : '??? Mystery'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-snug line-clamp-2">
                    {isUnlocked ? sticker.description : 'Earn a flawless score on a study set to unlock!'}
                  </p>

                  {isUnlocked && (
                    <span className="mt-3 text-[10px] font-bold text-pink-600 dark:text-pink-400 group-hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      <span>Peel & Place</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Option B: Canvas Theme Browser Modal */}
      {isThemeBrowserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl lg:max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">
                    Canvas Theme Browser
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Explore all {scenes.length} installed and custom-forged backdrop atmospheres
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsThemeBrowserOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setThemeFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    themeFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All ({scenes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setThemeFilter('builtin')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    themeFilter === 'builtin'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Built-in ({builtinScenesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setThemeFilter('custom')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    themeFilter === 'custom'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Studio Custom ({customScenesCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search themes or packs..."
                  value={themeSearchQuery}
                  onChange={(e) => setThemeSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-7 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                {themeSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setThemeSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Themes Grid - Vertical Scroller with Compact Horizontal Cards */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 dark:bg-slate-950/50">
              {filteredScenes.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                  <LayoutGrid className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600 opacity-60" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No themes found</p>
                  <p className="text-xs mt-1 text-slate-500">Try changing your search term or filter.</p>
                </div>
              ) : (
                filteredScenes.map((sc) => {
                  const isActive = activeSceneId === sc.id;
                  const linkedPack = packs.find((p) => p.id === sc.packId || p.themeSceneId === sc.id);
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setActiveSceneId(sc.id);
                        storage.saveCanvasSceneId(sc.id);
                        setIsThemeBrowserOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer group relative min-h-[76px] ${
                        isActive
                          ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/30 dark:ring-indigo-500/40 bg-indigo-50/80 dark:bg-indigo-950/70 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-750 hover:shadow-xs'
                      }`}
                    >
                      {/* Visual Thumbnail (Option A) */}
                      <div className="w-16 h-12 sm:w-18 sm:h-13 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-2xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                        <ThemeThumbnailPreview scene={sc} linkedPack={linkedPack} />
                      </div>

                      {/* Metadata & Typography */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {sc.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-300 truncate">
                          <span className="truncate">{linkedPack ? linkedPack.name : (sc.theme || 'Atmosphere')}</span>
                          <span aria-hidden="true" className="opacity-40">·</span>
                          <span className="shrink-0">{sc.isCustom ? 'Studio' : 'Built-in'}</span>
                          {linkedPack?.stickers?.length ? (
                            <>
                              <span aria-hidden="true" className="opacity-40">·</span>
                              <span className="shrink-0">{linkedPack.stickers.length} stickers</span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {/* Active Indicator or Hover Chevron */}
                      <div className="shrink-0 pl-1">
                        {isActive ? (
                          <div className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Active</span>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-all">
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with Forge New Theme Action */}
            <div className="flex items-center justify-between p-3.5 sm:px-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                Showing {filteredScenes.length} of {scenes.length} themes
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setIsThemeBrowserOpen(false);
                  setIsPackManagerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer ml-auto"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Forge New Theme in ThemePack STUDIO →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme & Sticker Pack Manager Modal */}
      {isPackManagerOpen && (
        <ThemeAndPackManagerModal
          isOpen={isPackManagerOpen}
          onClose={() => {
            setIsPackManagerOpen(false);
            onClosePackStudio?.();
          }}
          packs={packs}
          scenes={scenes}
          activeSceneId={activeSceneId}
          unlockedStickerIds={unlockedStickerIds}
          onSelectScene={(id) => {
            setActiveSceneId(id);
            storage.saveCanvasSceneId(id);
          }}
          onSavePack={handleSavePackInternal}
          onDeletePack={handleDeletePackInternal}
          onToggleUnlockPack={(id) => onToggleUnlockPack && onToggleUnlockPack(id)}
        />
      )}
    </div>
  );
};
