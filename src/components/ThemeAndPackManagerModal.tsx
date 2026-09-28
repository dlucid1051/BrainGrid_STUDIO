import React, { useState, useRef, useEffect } from 'react';
import { 
  CanvasScene, 
  CustomBackgroundConfig, 
  Sticker, 
  StickerPack, 
  StickerRarity, 
  VaultPackFile 
} from '../types';
import { 
  SVG_BACKGROUND_TEMPLATES, 
  getCoreThemeBackdrop, 
  CORE_THEME_BACKDROPS 
} from '../data/svgBackgroundTemplates';
import { exportVaultPack, parseVaultPackJSON, storage } from '../lib/io';
import { optimizeImageDataUrl } from '../lib/imageOptimizer';
import { sounds } from '../lib/sound';
import { StickerIconRenderer } from './StickerIconRenderer';
import { CustomCanvasBackground } from './CustomCanvasBackground';
import { 
  X, 
  Sparkles, 
  Package, 
  Layers, 
  Palette, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  Image as ImageIcon, 
  Code2, 
  Sliders, 
  Check, 
  AlertCircle, 
  Info, 
  ArrowRight,
  RefreshCw,
  FolderDown,
  FileCheck,
  GraduationCap,
  Lock,
  Unlock,
  Save,
  CheckCircle2
} from 'lucide-react';

interface ThemeAndPackManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  packs: StickerPack[];
  scenes: CanvasScene[];
  activeSceneId: string;
  unlockedStickerIds?: string[];
  onSelectScene: (sceneId: string) => void;
  onSavePack: (pack: StickerPack, scene?: CanvasScene) => void;
  onDeletePack: (packId: string) => void;
  onToggleUnlockPack: (packId: string) => void;
}

type ModalTab = 'installed' | 'create' | 'import';
type PackKind = 'combo' | 'stickers-only' | 'background-only';

const cleanPackIcon = (icon?: string): string => {
  if (!icon) return '🌟';
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

export const ThemeAndPackManagerModal: React.FC<ThemeAndPackManagerModalProps> = ({
  isOpen,
  onClose,
  packs,
  scenes,
  unlockedStickerIds,
  onSavePack,
  onDeletePack,
  onToggleUnlockPack,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('installed');
  const [packFilter, setPackFilter] = useState<'all' | 'custom' | 'built-in'>('all');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Editing Pack State
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [packKind, setPackKind] = useState<PackKind>('combo');
  const [packName, setPackName] = useState('');
  const [packAuthor, setPackAuthor] = useState('');
  const [packTheme, setPackTheme] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [packIcon, setPackIcon] = useState('🌟');
  const [packStickers, setPackStickers] = useState<Sticker[]>([]);

  // Background Studio State
  const [bgType, setBgType] = useState<'image' | 'svg'>('image');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [bgOpacity, setBgOpacity] = useState(100);
  const [bgDimming, setBgDimming] = useState(20);
  const [bgBlur, setBgBlur] = useState(0);
  const [bgFitMode, setBgFitMode] = useState<'cover' | 'contain' | 'center'>('cover');
  const [bgGridOverlay, setBgGridOverlay] = useState<'none' | 'dots' | 'lines' | 'isometric'>('none');
  const [bgOverlayColor, setBgOverlayColor] = useState('#0f172a');
  const [bgSvgMarkup, setBgSvgMarkup] = useState(SVG_BACKGROUND_TEMPLATES[0].svgMarkup);
  const [selectedTemplateId, setSelectedTemplateId] = useState(SVG_BACKGROUND_TEMPLATES[0].id);

  // New Sticker Form State
  const [stickerInputType, setStickerInputType] = useState<'emoji' | 'image'>('emoji');
  const [newStickerName, setNewStickerName] = useState('');
  const [newStickerDesc, setNewStickerDesc] = useState('');
  const [newStickerRarity, setNewStickerRarity] = useState<StickerRarity>('Common');
  const [newStickerEmoji, setNewStickerEmoji] = useState('✨');
  const [newStickerColor, setNewStickerColor] = useState('#6366f1');
  const [newStickerImageData, setNewStickerImageData] = useState('');

  // Import State
  const [importPreview, setImportPreview] = useState<VaultPackFile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Selected Sticker in Editor Draft
  const [selectedDraftStickerId, setSelectedDraftStickerId] = useState<string | null>(null);

  // Pack Delete Confirmation State
  const [confirmingDeletePackId, setConfirmingDeletePackId] = useState<string | null>(null);

  // Editing Scene ID (preserves the linked scene ID when editing an existing pack)
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

  // File Input Refs
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const imageBgFileInputRef = useRef<HTMLInputElement>(null);
  const stickerImageFileInputRef = useRef<HTMLInputElement>(null);

  // Scroll and Highlight tracking for newly added/copied/imported packs
  const [targetScrollPackId, setTargetScrollPackId] = useState<string | null>(null);
  const [highlightedPackId, setHighlightedPackId] = useState<string | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Whenever ThemePack STUDIO modal opens, reset default view to "Installed Packs" tab
  useEffect(() => {
    if (isOpen) {
      setActiveTab('installed');
      setPackFilter('all');
      setValidationError(null);
      setShowHowItWorks(false);
      setEditingPackId(null);
      setEditingSceneId(null);
      setSelectedDraftStickerId(null);
      setTargetScrollPackId(null);
      setHighlightedPackId(null);
    }
  }, [isOpen]);

  // Scroll the Installed Packs list so the target new/copied/imported pack card is in view
  useEffect(() => {
    if (!targetScrollPackId || !isOpen || activeTab !== 'installed') return;

    // Check if the target pack is in packs
    const packInList = packs.some((p) => p.id === targetScrollPackId);
    if (!packInList) return;

    // If it's filtered out, switch to 'all' so it is visible in the list
    if (packFilter === 'built-in') {
      setPackFilter('all');
    }

    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const cardEl = document.getElementById(`pack-card-${targetScrollPackId}`);
      const container = listContainerRef.current;

      if (cardEl && container) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const relativeTop = cardRect.top - containerRect.top + container.scrollTop;
        const targetTop = relativeTop - container.clientHeight / 2 + cardRect.height / 2;

        container.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });

        try {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch {
          // Fallback if not supported
        }

        setHighlightedPackId(targetScrollPackId);
        setTargetScrollPackId(null);

        const highlightTimer = setTimeout(() => {
          setHighlightedPackId((prev) => (prev === targetScrollPackId ? null : prev));
        }, 2800);

        return () => clearTimeout(highlightTimer);
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryScroll, 60);
      }
    };

    const timer = setTimeout(tryScroll, 80);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [packs, isOpen, activeTab, targetScrollPackId, packFilter]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helpers to start creating a new pack
  const handleStartCreateNew = () => {
    sounds.playPop();
    setEditingPackId(null);
    setEditingSceneId(null);
    setSelectedDraftStickerId(null);
    setPackKind('combo');
    setPackName('');
    setPackAuthor('');
    setPackTheme('Custom World');
    setPackDescription('A custom themed sticker pack & backdrop');
    setPackIcon('🌟');
    setPackStickers([]);
    setBgType('image');
    setBgImageUrl('');
    setBgOpacity(100);
    setBgDimming(20);
    setBgBlur(0);
    setBgFitMode('cover');
    setBgGridOverlay('none');
    setBgOverlayColor('#0f172a');
    setBgSvgMarkup(SVG_BACKGROUND_TEMPLATES[0].svgMarkup);
    setActiveTab('create');
  };

  // Helper to edit an existing pack
  const handleStartEditPack = (pack: StickerPack) => {
    sounds.playPop();
    // Built-in core packs cannot be directly edited; only custom packs can be edited
    if (!pack.isCustom) return;
    const newPackId = pack.id;
    setEditingPackId(pack.id);
    setPackName(pack.name || '');
    setSelectedDraftStickerId(null);
    setPackAuthor(pack.author || 'Creator');
    setPackTheme(pack.theme || '');
    setPackDescription(pack.description || '');
    setPackIcon(pack.icon || '🌟');

    // Populate each sticker with its current unlock state
    const loadedStickers: Sticker[] = pack.stickers.map((s) => ({
      ...s,
      packId: newPackId,
      isUnlocked: typeof s.isUnlocked === 'boolean'
        ? s.isUnlocked
        : (unlockedStickerIds ? unlockedStickerIds.includes(s.id) : (s.rarity === 'Common')),
    }));
    setPackStickers(loadedStickers);

    // Find linked scene if combo, and preserve its exact ID
    const linkedScene =
      scenes.find(
        (s) =>
          s.id === pack.themeSceneId ||
          s.packId === pack.id ||
          (pack.name && s.name.toLowerCase() === pack.name.toLowerCase()) ||
          (pack.theme && s.theme && pack.theme.toLowerCase() === pack.theme.toLowerCase())
      ) ||
      storage.loadCustomScenes().find(
        (s) =>
          s.id === pack.themeSceneId ||
          s.packId === pack.id ||
          (pack.name && s.name.toLowerCase() === pack.name.toLowerCase()) ||
          (pack.theme && s.theme && pack.theme.toLowerCase() === pack.theme.toLowerCase())
      );
    setEditingSceneId(linkedScene ? linkedScene.id : (pack.themeSceneId || null));

    if (linkedScene && pack.stickers.length > 0) {
      setPackKind('combo');
    } else if (linkedScene && pack.stickers.length === 0) {
      setPackKind('background-only');
    } else {
      setPackKind('stickers-only');
    }

    // Resolve companion backdrop info (check customConfig, or fallback to core theme backdrops)
    const coreBackdrop =
      getCoreThemeBackdrop(linkedScene?.id) ||
      getCoreThemeBackdrop(pack.themeSceneId) ||
      getCoreThemeBackdrop(pack.id) ||
      getCoreThemeBackdrop(linkedScene?.pattern) ||
      getCoreThemeBackdrop(linkedScene?.customConfig?.presetTemplate) ||
      getCoreThemeBackdrop(pack.theme) ||
      getCoreThemeBackdrop(pack.name) ||
      getCoreThemeBackdrop(linkedScene?.name) ||
      getCoreThemeBackdrop(linkedScene?.theme);

    const effectiveConfig: CustomBackgroundConfig | undefined =
      linkedScene?.customConfig ||
      (coreBackdrop
        ? {
            type: 'svg',
            presetTemplate: coreBackdrop.templateId,
            svgMarkup: coreBackdrop.svgMarkup,
          }
        : undefined);

    // 1. Detect image content
    const rawImageUrl =
      effectiveConfig?.imageUrl ||
      effectiveConfig?.backgroundImageUrl ||
      (effectiveConfig as any)?.image ||
      (effectiveConfig as any)?.url ||
      (linkedScene as any)?.imageUrl ||
      '';
    const hasValidImage = typeof rawImageUrl === 'string' && rawImageUrl.trim().length > 0;

    // 2. Detect SVG markup or preset
    const rawSvgMarkup =
      effectiveConfig?.svgMarkup ||
      (effectiveConfig as any)?.svg ||
      (linkedScene as any)?.svgMarkup ||
      '';
    const hasValidSvg = (typeof rawSvgMarkup === 'string' && rawSvgMarkup.trim().length > 0) || !!effectiveConfig?.presetTemplate || !!coreBackdrop;

    // 3. Resolve backdrop editor default:
    // If the current backdrop has an image and:
    //   - effectiveConfig?.type === 'image' OR
    //   - linkedScene?.pattern === 'custom-image' OR
    //   - there is an image and no valid custom SVG markup or core backdrop
    // -> 'image' (Image Wallpaper & Adjuster)
    // Else if it has an SVG (core backdrop, custom-svg pattern, SVG markup, SVG preset, or vector pattern):
    // -> 'svg' (SVG Canvas Vector Builder)
    const isImageBackdrop =
      (effectiveConfig?.type === 'image' && hasValidImage) ||
      linkedScene?.pattern === 'custom-image' ||
      (hasValidImage && !hasValidSvg && !coreBackdrop && effectiveConfig?.type !== 'svg');

    const isSvgBackdrop =
      effectiveConfig?.type === 'svg' ||
      linkedScene?.pattern === 'custom-svg' ||
      !!coreBackdrop ||
      hasValidSvg ||
      (linkedScene?.pattern && ['stars', 'dots', 'arcade', 'ocean', 'lines', 'waves'].includes(linkedScene.pattern));

    let resolvedBackdropType: 'image' | 'svg' = 'svg';

    if (isImageBackdrop && !isSvgBackdrop) {
      resolvedBackdropType = 'image';
    } else if (isSvgBackdrop) {
      resolvedBackdropType = 'svg';
    } else if (hasValidImage) {
      resolvedBackdropType = 'image';
    } else {
      resolvedBackdropType = 'svg';
    }

    setBgType(resolvedBackdropType);

    if (effectiveConfig || coreBackdrop) {
      setBgImageUrl(rawImageUrl || '');
      setBgOpacity(effectiveConfig?.opacity ?? 100);
      setBgDimming(effectiveConfig?.dimming ?? 20);
      setBgBlur(effectiveConfig?.blur ?? 0);
      setBgFitMode(effectiveConfig?.fitMode || 'cover');
      setBgGridOverlay(effectiveConfig?.gridOverlay || 'none');
      setBgOverlayColor(effectiveConfig?.overlayColor || '#0f172a');
      setBgSvgMarkup(
        rawSvgMarkup ||
        (coreBackdrop ? coreBackdrop.svgMarkup : SVG_BACKGROUND_TEMPLATES[0].svgMarkup)
      );
      if (effectiveConfig?.presetTemplate) {
        setSelectedTemplateId(effectiveConfig.presetTemplate);
      } else if (coreBackdrop) {
        setSelectedTemplateId(coreBackdrop.templateId);
      }
    }

    if (coreBackdrop && (!pack.theme || pack.theme.toLowerCase() === 'custom')) {
      setPackTheme(coreBackdrop.shortLabel);
    }
    setActiveTab('create');
  };

  // Helper to clone/duplicate an existing pack
  const handleDuplicatePack = (pack: StickerPack) => {
    sounds.playPop();
    const newPackId = `custom-pack-${Date.now()}`;
    const linkedScene =
      scenes.find(
        (s) =>
          s.id === pack.themeSceneId ||
          s.packId === pack.id ||
          (pack.name && s.name.toLowerCase() === pack.name.toLowerCase()) ||
          (pack.theme && s.theme && pack.theme.toLowerCase() === pack.theme.toLowerCase())
      ) ||
      storage.loadCustomScenes().find(
        (s) =>
          s.id === pack.themeSceneId ||
          s.packId === pack.id ||
          (pack.name && s.name.toLowerCase() === pack.name.toLowerCase()) ||
          (pack.theme && s.theme && pack.theme.toLowerCase() === pack.theme.toLowerCase())
      );
    const coreBackdrop =
      getCoreThemeBackdrop(linkedScene?.id) ||
      getCoreThemeBackdrop(pack.themeSceneId) ||
      getCoreThemeBackdrop(pack.id) ||
      getCoreThemeBackdrop(linkedScene?.pattern) ||
      getCoreThemeBackdrop(linkedScene?.customConfig?.presetTemplate) ||
      getCoreThemeBackdrop(pack.theme) ||
      getCoreThemeBackdrop(pack.name) ||
      getCoreThemeBackdrop(linkedScene?.name) ||
      getCoreThemeBackdrop(linkedScene?.theme);
    
    const clonedStickers: Sticker[] = pack.stickers.map((s, idx) => ({
      ...s,
      id: `stk-${Date.now()}-${idx}`,
      packId: newPackId,
      isUnlocked: typeof s.isUnlocked === 'boolean'
        ? s.isUnlocked
        : (unlockedStickerIds ? unlockedStickerIds.includes(s.id) : (s.rarity === 'Common')),
    }));

    let clonedScene: CanvasScene | undefined = undefined;
    if (linkedScene || coreBackdrop) {
      const isImage = !!(
        linkedScene?.customConfig?.imageUrl?.trim() ||
        linkedScene?.customConfig?.backgroundImageUrl?.trim() ||
        linkedScene?.pattern === 'custom-image'
      );

      const customConfig: CustomBackgroundConfig = linkedScene?.customConfig
        ? {
            ...linkedScene.customConfig,
            type: linkedScene.customConfig.type || (isImage ? 'image' : 'svg'),
          }
        : coreBackdrop
        ? {
            type: 'svg',
            presetTemplate: coreBackdrop.templateId,
            svgMarkup: coreBackdrop.svgMarkup,
          }
        : {
            type: 'svg',
            svgMarkup: SVG_BACKGROUND_TEMPLATES[0].svgMarkup,
          };

      const sceneName = coreBackdrop
        ? `${coreBackdrop.name} (Copy)`
        : linkedScene
        ? `${linkedScene.name} (Copy)`
        : `${pack.name} (Copy) Theme`;

      const themeTag = coreBackdrop
        ? coreBackdrop.shortLabel
        : (linkedScene?.theme || pack.theme || 'Custom Theme');

      clonedScene = {
        ...(linkedScene || {}),
        id: `scene-custom-${Date.now()}`,
        name: sceneName,
        theme: themeTag,
        bgGradient: linkedScene?.bgGradient || 'bg-slate-950',
        pattern: isImage ? 'custom-image' : 'custom-svg',
        isCustom: true,
        packId: newPackId,
        customConfig,
      };
    }

    const effectiveTheme = coreBackdrop
      ? coreBackdrop.shortLabel
      : (pack.theme || 'Custom Theme');

    const clonedPack: StickerPack = {
      ...pack,
      id: newPackId,
      name: `${pack.name} (Copy)`,
      author: 'You',
      theme: effectiveTheme,
      isCustom: true,
      stickers: clonedStickers,
      themeSceneId: clonedScene ? clonedScene.id : undefined,
    };

    onSavePack(clonedPack, clonedScene);
    if (packFilter === 'built-in') {
      setPackFilter('all');
    }
    setActiveTab('installed');
    setTargetScrollPackId(newPackId);
  };

  // Add Sticker to Current Draft (Default rule: Common is unlocked, others are locked)
  const handleAddStickerToDraft = () => {
    if (!newStickerName.trim()) return;
    sounds.playPop();

    const iconVal = stickerInputType === 'image' && newStickerImageData
      ? newStickerImageData
      : newStickerEmoji.trim() || '✨';

    const newStk: Sticker = {
      id: `draft-stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: newStickerName.trim(),
      description: newStickerDesc.trim() || `${newStickerRarity} reward sticker`,
      packId: editingPackId || 'temp-pack',
      rarity: newStickerRarity,
      svgIcon: iconVal,
      color: newStickerColor,
      isCustomImage: stickerInputType === 'image',
      isUnlocked: newStickerRarity === 'Common', // Default: Common is unlocked, Rare/Legendary/Mythic locked
    };

    setPackStickers((prev) => [...prev, newStk]);
    setNewStickerName('');
    setNewStickerDesc('');
    setNewStickerImageData('');
  };

  const handleRemoveStickerFromDraft = (stkId: string) => {
    sounds.playPop();
    setPackStickers((prev) => prev.filter((s) => s.id !== stkId));
    setSelectedDraftStickerId((prev) => (prev === stkId ? null : prev));
  };

  const handleUpdateSelectedSticker = (updated: Partial<Sticker>) => {
    if (!selectedDraftStickerId) return;
    setPackStickers((prev) =>
      prev.map((s) => (s.id === selectedDraftStickerId ? { ...s, ...updated } : s))
    );
  };

  // Lock / Unlock Helpers for Draft Stickers
  const handleToggleDraftStickerLock = (stkId: string) => {
    sounds.playPop();
    setPackStickers((prev) =>
      prev.map((s) => (s.id === stkId ? { ...s, isUnlocked: !s.isUnlocked } : s))
    );
  };

  // Option 1: Default - Common unlocked, Rare/Legendary/Mythic locked
  const handleSetDefaultLockState = () => {
    sounds.playPop();
    setPackStickers((prev) =>
      prev.map((s) => ({
        ...s,
        isUnlocked: s.rarity === 'Common',
      }))
    );
  };

  // Option 2: Lock All
  const handleLockAllStickers = () => {
    sounds.playPop();
    setPackStickers((prev) =>
      prev.map((s) => ({
        ...s,
        isUnlocked: false,
      }))
    );
  };

  // Option 3: Unlock All
  const handleUnlockAllStickers = () => {
    sounds.playPop();
    setPackStickers((prev) =>
      prev.map((s) => ({
        ...s,
        isUnlocked: true,
      }))
    );
  };

  // Background Image Upload
  const handleImageBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (allow up to 8MB since it will be optimized to lightweight crisp JPEG)
    if (file.size > 8 * 1024 * 1024) {
      setValidationError('Background image is too large. Please select an image under 8MB.');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          const optimized = await optimizeImageDataUrl(result, 1920, 1080, 0.84, 'image/jpeg');
          setBgImageUrl(optimized);
        } catch {
          setBgImageUrl(result);
        }
        sounds.playPop();
      }
    };
    reader.readAsDataURL(file);
  };

  // Sticker Image Upload
  const handleStickerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setValidationError('Sticker image is too large. Please choose an image under 4MB.');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          const optimized = await optimizeImageDataUrl(result, 512, 512, 0.88, 'image/png');
          setNewStickerImageData(optimized);
        } catch {
          setNewStickerImageData(result);
        }
        if (!newStickerName) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
          setNewStickerName(cleanName);
        }
        sounds.playPop();
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Pack (persists combo, stickers-only, or background-only)
  const handleSavePackSubmit = async () => {
    const effectivePackName = packName.trim() || packTheme.trim() || 'Custom Pack';
    if (!effectivePackName) {
      setValidationError('Please enter a pack or theme name.');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    sounds.playFanfare();
    const isEditingBuiltIn = editingPackId ? packs.some((p) => p.id === editingPackId && !p.isCustom) : false;
    const packId = (editingPackId && !isEditingBuiltIn) ? editingPackId : `custom-pack-${Date.now()}`;
    const linkedScene = scenes.find(
      (s) =>
        (editingSceneId && s.id === editingSceneId) ||
        s.packId === packId ||
        (packId && s.id === `custom-scene-${packId}`) ||
        (effectivePackName && s.name.toLowerCase() === effectivePackName.toLowerCase()) ||
        (packTheme.trim() && s.theme && s.theme.toLowerCase() === packTheme.trim().toLowerCase())
    );
    const isEditingBuiltInScene = editingSceneId ? scenes.some((s) => s.id === editingSceneId && !s.isCustom) : false;
    const sceneId = (editingSceneId && !isEditingBuiltInScene)
      ? editingSceneId
      : (linkedScene && linkedScene.isCustom ? linkedScene.id : `custom-scene-${packId}`);

    let sceneToSave: CanvasScene | undefined = undefined;

    if (packKind === 'combo' || packKind === 'background-only') {
      let finalImageUrl = bgImageUrl;
      if (bgType === 'image' && bgImageUrl) {
        try {
          finalImageUrl = await optimizeImageDataUrl(bgImageUrl, 1920, 1080, 0.82, 'image/jpeg');
        } catch {
          // Keep existing
        }
      }

      const customConfig: CustomBackgroundConfig = bgType === 'image'
        ? {
            type: 'image',
            imageUrl: finalImageUrl,
            opacity: bgOpacity,
            dimming: bgDimming,
            blur: bgBlur,
            fitMode: bgFitMode,
            gridOverlay: bgGridOverlay,
            overlayColor: bgOverlayColor,
          }
        : {
            type: 'svg',
            svgMarkup: bgSvgMarkup,
            presetTemplate: selectedTemplateId,
          };

      // Use Theme Tag as caption text; if not set or blank, fall back to Pack Name
      const effectiveThemeTag = packTheme.trim();
      const sceneDisplayName = effectiveThemeTag || effectivePackName;

      sceneToSave = {
        id: sceneId,
        name: sceneDisplayName,
        theme: effectiveThemeTag || effectivePackName,
        bgGradient: bgType === 'image' ? 'bg-slate-950' : 'bg-slate-900',
        pattern: bgType === 'image' ? 'custom-image' : 'custom-svg',
        isCustom: true,
        author: packAuthor.trim() || 'You',
        customConfig,
        packId,
      };
    } else {
      // packKind === 'stickers-only'
      const effectiveThemeTag = packTheme.trim();
      const sceneDisplayName = effectiveThemeTag || effectivePackName;
      if (linkedScene) {
        sceneToSave = {
          ...linkedScene,
          id: linkedScene.id || sceneId,
          name: sceneDisplayName,
          theme: effectiveThemeTag || effectivePackName,
          packId,
        };
      } else {
        sceneToSave = {
          id: sceneId,
          name: sceneDisplayName,
          theme: effectiveThemeTag || effectivePackName,
          bgGradient: 'bg-slate-950',
          pattern: 'custom-svg',
          isCustom: true,
          author: packAuthor.trim() || 'You',
          customConfig: {
            type: 'svg',
            svgMarkup: `<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="amb-${packId}" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.9" /><stop offset="60%" stop-color="#0f172a" stop-opacity="0.95" /><stop offset="100%" stop-color="#020617" stop-opacity="1" /></radialGradient></defs><rect width="1000" height="500" fill="url(#amb-${packId})" /><circle cx="820" cy="110" r="45" fill="#fef08a" opacity="0.85" /><circle cx="805" cy="100" r="42" fill="#0f172a" opacity="0.9" /></svg>`,
          },
          packId,
        };
      }
    }

    const isCoreStickerId = (id?: string) =>
      id &&
      (id.startsWith('stk-space-') ||
        id.startsWith('stk-dino-') ||
        id.startsWith('stk-math-') ||
        id.startsWith('stk-ocean-'));

    const stickersToSave: Sticker[] = (packKind === 'background-only')
      ? []
      : packStickers.map((s, idx) => ({
          ...s,
          id: (s.id && !isCoreStickerId(s.id)) ? s.id : `stk-${packId}-${idx + 1}`,
          packId,
          isUnlocked: typeof s.isUnlocked === 'boolean' ? s.isUnlocked : (s.rarity === 'Common'),
        }));

    const allUnlocked = packKind === 'background-only' || (stickersToSave.length > 0 && stickersToSave.every((s) => s.isUnlocked));

    const packToSave: StickerPack = {
      id: packId,
      name: effectivePackName,
      author: packAuthor.trim() || 'You',
      theme: packTheme.trim() || effectivePackName,
      description: packDescription.trim() || `${effectivePackName} Sticker Pack`,
      icon: packIcon.trim() || '🎨',
      isUnlocked: allUnlocked,
      isCustom: true,
      stickers: stickersToSave,
      themeSceneId: sceneToSave ? sceneId : undefined,
    };

    onSavePack(packToSave, sceneToSave);
    setEditingSceneId(null);
    if (packFilter === 'built-in') {
      setPackFilter('all');
    }
    setActiveTab('installed');
    setTargetScrollPackId(packId);
  };

  // Single Pack Export Handler
  const handleExportSinglePack = async (pack: StickerPack) => {
    sounds.playPop();
    let companionScene =
      scenes.find((s) => s.id === pack.themeSceneId || s.packId === pack.id) ||
      storage.loadCustomScenes().find((s) => s.id === pack.themeSceneId || s.packId === pack.id);
    const coreBackdrop =
      getCoreThemeBackdrop(companionScene?.id) ||
      getCoreThemeBackdrop(pack.themeSceneId) ||
      getCoreThemeBackdrop(pack.id) ||
      getCoreThemeBackdrop(companionScene?.pattern) ||
      getCoreThemeBackdrop(companionScene?.customConfig?.presetTemplate) ||
      getCoreThemeBackdrop(pack.theme) ||
      getCoreThemeBackdrop(pack.name) ||
      getCoreThemeBackdrop(companionScene?.name) ||
      getCoreThemeBackdrop(companionScene?.theme);

    if (!companionScene || !companionScene.customConfig) {
      if (coreBackdrop) {
        companionScene = {
          ...(companionScene || {}),
          id: pack.themeSceneId || `scene-custom-${pack.id}`,
          name: coreBackdrop.name,
          theme: coreBackdrop.shortLabel,
          bgGradient: 'bg-slate-950',
          pattern: 'custom-svg',
          isCustom: true,
          author: pack.author || 'BrainGrid',
          customConfig: {
            type: 'svg',
            presetTemplate: coreBackdrop.templateId,
            svgMarkup: coreBackdrop.svgMarkup,
          },
          packId: pack.id,
        };
      } else if (!companionScene) {
        const themeTitle = pack.theme && pack.theme.toLowerCase() !== 'custom' ? pack.theme : pack.name;
        companionScene = {
          id: pack.themeSceneId || `custom-scene-${pack.id}`,
          name: themeTitle,
          theme: themeTitle,
          bgGradient: 'bg-slate-950',
          pattern: 'custom-svg',
          isCustom: true,
          author: pack.author || 'You',
          customConfig: {
            type: 'svg',
            svgMarkup: SVG_BACKGROUND_TEMPLATES[0].svgMarkup,
          },
          packId: pack.id,
        };
      }
    }
    await exportVaultPack(pack, companionScene);
  };

  // Handle Import File Selection
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        if (content) {
          const parsed = parseVaultPackJSON(content);
          if (parsed) {
            if (parsed.themeScene?.customConfig?.imageUrl) {
              try {
                parsed.themeScene.customConfig.imageUrl = await optimizeImageDataUrl(
                  parsed.themeScene.customConfig.imageUrl,
                  1920,
                  1080,
                  0.84,
                  'image/jpeg'
                );
              } catch (err) {
                console.warn('Theme image optimize warning on import:', err);
              }
            }
            setImportPreview(parsed);
            setImportError(null);
            sounds.playPop();
          } else {
            setImportError('Invalid BrainGrid pack file. Please make sure the JSON format is valid.');
            setImportPreview(null);
          }
        }
      } catch (err) {
        console.error('Import parse error:', err);
        setImportError('Could not process this file. Please check that it is a valid BrainGrid JSON pack.');
        setImportPreview(null);
      } finally {
        if (e.target) {
          e.target.value = '';
        }
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file from disk.');
      if (e.target) e.target.value = '';
    };
    reader.readAsText(file);
  };

  // Install Imported Pack
  const handleInstallImportedPack = async () => {
    if (!importPreview) return;
    sounds.playFanfare();

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const packId = `custom-pack-${uniqueSuffix}`;
    const sceneId = `custom-scene-${uniqueSuffix}`;

    let sceneToSave: CanvasScene | undefined = undefined;
    if (importPreview.themeScene) {
      let finalConfig = importPreview.themeScene.customConfig;
      if (finalConfig?.imageUrl) {
        try {
          const optimized = await optimizeImageDataUrl(finalConfig.imageUrl, 1920, 1080, 0.84, 'image/jpeg');
          finalConfig = {
            ...finalConfig,
            type: 'image',
            imageUrl: optimized,
          };
        } catch {
          // Keep existing if optimize fails
        }
      }

      const effectivePattern: CanvasScene['pattern'] =
        finalConfig?.imageUrl
          ? 'custom-image'
          : (finalConfig?.svgMarkup ? 'custom-svg' : (importPreview.themeScene.pattern || 'custom-image'));

      if (!finalConfig?.imageUrl && (finalConfig?.svgMarkup || finalConfig?.presetTemplate || effectivePattern === 'custom-svg')) {
        finalConfig = {
          ...(finalConfig || {}),
          type: 'svg',
        };
      }

      sceneToSave = {
        ...importPreview.themeScene,
        id: sceneId,
        isCustom: true,
        packId,
        pattern: effectivePattern,
        customConfig: finalConfig,
      };
    } else {
      const themeTitle = importPreview.name;
      sceneToSave = {
        id: sceneId,
        name: themeTitle,
        theme: themeTitle,
        bgGradient: 'bg-slate-950',
        pattern: 'custom-svg',
        isCustom: true,
        author: importPreview.author || 'Community',
        customConfig: {
          type: 'svg',
          svgMarkup: `<svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="amb-${packId}" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.9" /><stop offset="60%" stop-color="#0f172a" stop-opacity="0.95" /><stop offset="100%" stop-color="#020617" stop-opacity="1" /></radialGradient></defs><rect width="1000" height="500" fill="url(#amb-${packId})" /><circle cx="820" cy="110" r="45" fill="#fef08a" opacity="0.85" /><circle cx="805" cy="100" r="42" fill="#0f172a" opacity="0.9" /></svg>`,
        },
        packId,
      };
    }

    const stickersToSave: Sticker[] = (importPreview.stickers || []).map((s, idx) => ({
      ...s,
      id: `imported-stk-${Date.now()}-${idx}`,
      packId,
      isUnlocked: typeof s.isUnlocked === 'boolean' ? s.isUnlocked : (s.rarity === 'Common'),
    }));

    const allUnlocked = stickersToSave.length > 0 && stickersToSave.every((s) => s.isUnlocked);

    const packToSave: StickerPack = {
      id: packId,
      name: importPreview.name || 'Imported Pack',
      author: importPreview.author || 'Community',
      theme: importPreview.themeScene?.theme || importPreview.name || 'Imported Pack',
      description: importPreview.description || 'Custom Vault Pack',
      icon: importPreview.icon || (stickersToSave.length > 0 ? '📦' : '🎨'),
      isUnlocked: allUnlocked,
      isCustom: true,
      stickers: stickersToSave,
      themeSceneId: sceneId,
    };

    onSavePack(packToSave, sceneToSave);
    setImportPreview(null);
    if (packFilter === 'built-in') {
      setPackFilter('all');
    }
    setActiveTab('installed');
    setTargetScrollPackId(packId);
  };

  // Filtered list of packs
  const displayedPacks = packs.filter((p) => {
    if (packFilter === 'custom') return p.isCustom;
    if (packFilter === 'built-in') return !p.isCustom;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight leading-none bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  ThemePack
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60 leading-none">
                  STUDIO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Design custom backdrop themes, mint custom stickers, and export portable packs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowHowItWorks(!showHowItWorks);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                showHowItWorks
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/70'
              }`}
              title="How It Works & Quick Tutorial"
            >
              <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span>How It Works</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HOW IT WORKS & QUICK TUTORIAL DRAWER */}
        {showHowItWorks && (
          <div className="border-b border-purple-200/80 dark:border-purple-900/60 bg-gradient-to-b from-purple-50/70 to-indigo-50/40 dark:from-purple-950/40 dark:to-indigo-950/20 p-4 sm:p-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>How ThemePack STUDIO Works</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold">
                    Quick Tour
                  </span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowHowItWorks(false)}
                className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
              >
                Hide
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px]">1</span>
                  <span>Forge Themes</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Pick SVG geometric scenes or upload 16:9 wallpaper. Configure dimming, blur, and isometric/dot grids.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400">
                  <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-[10px]">2</span>
                  <span>Mint Stickers</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Add emojis or upload PNG/SVG artwork (transparent background recommended) with custom rarity tiers.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-[10px]">3</span>
                  <span>Lock & Study Motivator</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Use batch controls (<span className="font-semibold text-amber-700 dark:text-amber-300">Default</span> keeps Common unlocked, Rare/Legendary locked for study rewards) or toggle lock icons on individual stickers!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-400">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[10px]">4</span>
                  <span>Canvas & StickerBook Sync</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Backdrops automatically sync to the StickerBook STUDIO theme scroller. Deleted backdrops and locked stickers are safely pruned from canvases.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px]">5</span>
                  <span>Export & Import</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Export a lightweight <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">.vault-pack.json</code> bundle. Imported packs auto-sync their theme and reward states.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL TAB NAVIGATION */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('installed');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'installed'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Installed Packs ({packs.length})</span>
            </button>

            <button
              onClick={handleStartCreateNew}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingPackId ? 'Edit Pack' : 'Create New Pack'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('import');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'import'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Pack (.json)</span>
            </button>
          </div>

          {activeTab === 'installed' && (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setPackFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  packFilter === 'all'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPackFilter('custom')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  packFilter === 'custom'
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Custom ({packs.filter((p) => p.isCustom).length})
              </button>
              <button
                onClick={() => setPackFilter('built-in')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  packFilter === 'built-in'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Built-in ({packs.filter((p) => !p.isCustom).length})
              </button>
            </div>
          )}
        </div>

        {/* MODAL BODY CONTAINER */}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {/* Validation Alert Banner */}
          {validationError && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-between">
              <span>{validationError}</span>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-xs font-bold hover:underline cursor-pointer ml-3 shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: INSTALLED PACKS LIST */}
          {activeTab === 'installed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your sticker packs and companion themes. Export to JSON to share with study buddies!
                </p>
                <button
                  onClick={handleStartCreateNew}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Combo Pack</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedPacks.map((pack) => {
                  const linkedScene = scenes.find((s) => s.id === pack.themeSceneId || s.packId === pack.id);
                  const isCombo = !!linkedScene && pack.stickers.length > 0;
                  const isBackgroundOnly = !!linkedScene && pack.stickers.length === 0;
                  const isHighlighted = highlightedPackId === pack.id;

                  return (
                    <div
                      key={pack.id}
                      id={`pack-card-${pack.id}`}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-500 ${
                        isHighlighted
                          ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/80 dark:ring-indigo-400/80 shadow-md bg-indigo-50/70 dark:bg-indigo-950/50'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Top Row: Title, Icon, Badges */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl select-none">{cleanPackIcon(pack.icon)}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                                  {cleanPackName(pack.name, pack.isCustom)}
                                </h4>
                                {pack.isCustom ? (
                                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                                    Custom
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                                    Core
                                  </span>
                                )}
                                {isHighlighted && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold shadow-2xs animate-pulse">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                By {pack.author || 'BrainGrid'} • {pack.theme}
                              </p>
                            </div>
                          </div>

                          {/* Pack Type Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isCombo
                                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : isBackgroundOnly
                                ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                                : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            }`}
                          >
                            {isCombo
                              ? `Combo (${pack.stickers.length} stk + theme)`
                              : isBackgroundOnly
                              ? 'Theme Only'
                              : `${pack.stickers.length} Stickers`}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                          {pack.description}
                        </p>

                        {/* Stickers Preview Strip */}
                        {pack.stickers.length > 0 && (
                          <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-3 no-scrollbar">
                            {pack.stickers.slice(0, 8).map((stk) => (
                              <div
                                key={stk.id}
                                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs"
                                title={`${stk.name} (${stk.rarity})`}
                              >
                                <StickerIconRenderer icon={stk.svgIcon} size="sm" alt={stk.name} />
                              </div>
                            ))}
                            {pack.stickers.length > 8 && (
                              <span className="text-[10px] font-bold text-slate-400 pl-1">
                                +{pack.stickers.length - 8}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-700/60 mt-2">
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const unlockedInPack = pack.stickers.filter((s) =>
                              unlockedStickerIds ? unlockedStickerIds.includes(s.id) : pack.isUnlocked
                            ).length;
                            const isAllUnlocked = pack.stickers.length > 0 && unlockedInPack === pack.stickers.length;
                            const isNoneUnlocked = unlockedInPack === 0;

                            return (
                              <button
                                type="button"
                                onClick={() => onToggleUnlockPack(pack.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                                  isAllUnlocked
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                                    : isNoneUnlocked
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200'
                                }`}
                                title="Click to toggle unlock state for all stickers in this pack"
                              >
                                {isAllUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                <span>
                                  {pack.stickers.length === 0
                                    ? 'No Stickers'
                                    : isAllUnlocked
                                    ? 'Unlocked (All)'
                                    : isNoneUnlocked
                                    ? `Locked (0/${pack.stickers.length})`
                                    : `${unlockedInPack}/${pack.stickers.length} Unlocked`}
                                </span>
                              </button>
                            );
                          })()}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Export Pack JSON Button */}
                          <button
                            type="button"
                            onClick={() => handleExportSinglePack(pack)}
                            title="Export pack to .json file"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Duplicate Pack Button */}
                          <button
                            type="button"
                            onClick={() => handleDuplicatePack(pack)}
                            title="Duplicate as new custom pack"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Pack Button (Custom packs only) */}
                          {pack.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleStartEditPack(pack)}
                              title="Edit custom pack"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Pack (Custom only) */}
                          {pack.isCustom && (
                            confirmingDeletePackId === pack.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/90 px-1.5 py-0.5 rounded-lg border border-rose-300 dark:border-rose-800 shadow-xs animate-in fade-in duration-150">
                                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 whitespace-nowrap">
                                  Delete?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playPop();
                                    onDeletePack(pack.id);
                                    setConfirmingDeletePackId(null);
                                    if (editingPackId === pack.id) {
                                      handleStartCreateNew();
                                    }
                                  }}
                                  className="px-1.5 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs cursor-pointer transition-colors"
                                  title="Confirm delete pack"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingDeletePackId(null)}
                                  className="px-1 py-0.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                                  title="Cancel deletion"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playPop();
                                  setConfirmingDeletePackId(pack.id);
                                }}
                                title="Delete custom pack"
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PACK CREATOR & STUDIO */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              {/* 1. Pack Type Choice (Combo vs Stickers Only vs Background Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                  What kind of pack are you creating?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setPackKind('combo');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      packKind === 'combo'
                        ? 'bg-amber-500/10 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🌟</span>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        Full Theme Combo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Themed background scene + 8–12 matching stickers. The ideal complete study experience.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setPackKind('stickers-only');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      packKind === 'stickers-only'
                        ? 'bg-purple-500/10 border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🏷️</span>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        Stickers Only
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Collection of custom emoji or uploaded image badges with rarity tags and white border die-cuts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setPackKind('background-only');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      packKind === 'background-only'
                        ? 'bg-cyan-500/10 border-cyan-500 dark:border-cyan-400 ring-2 ring-cyan-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🎨</span>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        Background Only
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      A standalone custom wallpaper or SVG vector scene backdrop for the StickerBook canvas.
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. General Pack Details */}
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-display font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  Pack Metadata
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Pack Name *</label>
                    <input
                      type="text"
                      value={packName || ''}
                      onChange={(e) => setPackName(e.target.value)}
                      placeholder="e.g. Celestial Wanderers, Cozy Cafe Study"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={packAuthor || ''}
                      onChange={(e) => setPackAuthor(e.target.value)}
                      placeholder="e.g. Dale, FlashyBrain"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Pack Icon</label>
                    <input
                      type="text"
                      value={packIcon || ''}
                      onChange={(e) => setPackIcon(e.target.value)}
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-center text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-slate-500 mb-1">Theme Tag</label>
                    <input
                      type="text"
                      value={packTheme || ''}
                      onChange={(e) => setPackTheme(e.target.value)}
                      placeholder="e.g. Sci-Fi, Nature, Retro Arcade, Medieval"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 3. BACKGROUND STUDIO (For Combo or Background Only) */}
              {(packKind === 'combo' || packKind === 'background-only') && (
                <div className="p-5 rounded-2xl border-2 border-indigo-200/70 dark:border-indigo-900/60 bg-white dark:bg-slate-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-indigo-500" />
                      <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                        Canvas Theme Backdrop Studio
                      </h4>
                      {packTheme && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                          {packTheme}
                        </span>
                      )}
                    </div>

                    {/* Method Toggle: Image Adjuster vs SVG Builder */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setBgType('image');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bgType === 'image'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Image Wallpaper & Adjuster</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setBgType('svg');
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bgType === 'svg'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>SVG Vector Canvas Builder</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Mini Preview Canvas */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-inner bg-slate-950 flex items-center justify-center">
                    <CustomCanvasBackground
                      config={
                        bgType === 'image'
                          ? {
                              type: 'image',
                              imageUrl: bgImageUrl,
                              opacity: bgOpacity,
                              dimming: bgDimming,
                              blur: bgBlur,
                              fitMode: bgFitMode,
                              gridOverlay: bgGridOverlay,
                              overlayColor: bgOverlayColor,
                            }
                          : {
                              type: 'svg',
                              svgMarkup: bgSvgMarkup,
                            }
                      }
                    />

                    {!bgImageUrl && bgType === 'image' && (
                      <div className="relative z-10 text-center p-4">
                        <ImageIcon className="w-8 h-8 mx-auto text-slate-500 mb-1 opacity-60" />
                        <p className="text-xs text-slate-400 font-medium">
                          Upload a PNG, WebP, or JPEG wallpaper below to preview
                        </p>
                      </div>
                    )}

                    {/* Watermark in Preview */}
                    <div className="absolute top-2 left-3 text-[10px] font-mono uppercase tracking-wider text-white/50 pointer-events-none">
                      {packName || 'Theme Preview'} • Live Canvas
                    </div>
                  </div>

                  {/* SUB-SECTION A: IMAGE ADJUSTER CONTROLS */}
                  {bgType === 'image' && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-3">
                        <input
                          ref={imageBgFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageBgUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => imageBgFileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Wallpaper Image</span>
                        </button>
                        {bgImageUrl && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Image Loaded
                          </span>
                        )}
                      </div>

                      {/* Slider Controls Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {/* Opacity Slider */}
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                            <span>Image Opacity</span>
                            <span className="font-mono">{bgOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={bgOpacity}
                            onChange={(e) => setBgOpacity(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        {/* Dimming Darkness Slider */}
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                            <span>Dimming (Darkness)</span>
                            <span className="font-mono">{bgDimming}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={80}
                            value={bgDimming}
                            onChange={(e) => setBgDimming(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        {/* Blur Filter */}
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                            <span>Soft Blur</span>
                            <span className="font-mono">{bgBlur}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={16}
                            value={bgBlur}
                            onChange={(e) => setBgBlur(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        {/* Fit Mode */}
                        <div>
                          <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                            Fit Scaling Mode
                          </label>
                          <select
                            value={bgFitMode}
                            onChange={(e) => setBgFitMode(e.target.value as 'cover' | 'contain' | 'center')}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 outline-hidden"
                          >
                            <option value="cover">Cover (Fill Screen)</option>
                            <option value="contain">Contain (Keep Ratio)</option>
                            <option value="center">Center / Repeat</option>
                          </select>
                        </div>

                        {/* Grid Texture Overlay */}
                        <div>
                          <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                            Grid Overlay Texture
                          </label>
                          <select
                            value={bgGridOverlay}
                            onChange={(e) => setBgGridOverlay(e.target.value as 'none' | 'dots' | 'lines' | 'isometric')}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 outline-hidden"
                          >
                            <option value="none">None (Clean)</option>
                            <option value="dots">Subtle Dots</option>
                            <option value="lines">Graph Lines</option>
                            <option value="isometric">Isometric Mesh</option>
                          </select>
                        </div>

                        {/* Tint Color */}
                        <div>
                          <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                            Overlay Tint Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={bgOverlayColor}
                              onChange={(e) => setBgOverlayColor(e.target.value)}
                              className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                            />
                            <span className="text-xs font-mono text-slate-500">{bgOverlayColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-SECTION B: SVG CANVAS BUILDER */}
                  {bgType === 'svg' && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Starter Vector Template:
                        </label>
                        <select
                          value={selectedTemplateId}
                          onChange={(e) => {
                            const found = SVG_BACKGROUND_TEMPLATES.find((t) => t.id === e.target.value);
                            if (found) {
                              setSelectedTemplateId(found.id);
                              setBgSvgMarkup(found.svgMarkup);
                              sounds.playPop();
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-hidden"
                        >
                          {SVG_BACKGROUND_TEMPLATES.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>SVG Markup (Sanitized & Live-Rendered)</span>
                          <span className="text-[11px] text-indigo-500">Auto-scales to canvas</span>
                        </div>
                        <textarea
                          rows={6}
                          value={bgSvgMarkup}
                          onChange={(e) => setBgSvgMarkup(e.target.value)}
                          placeholder="<svg viewBox='0 0 1000 500'>...</svg>"
                          className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. STICKERS ROSTER (For Combo or Stickers Only) */}
              {(packKind === 'combo' || packKind === 'stickers-only') && (
                <div className="p-5 rounded-2xl border-2 border-purple-200/70 dark:border-purple-900/60 bg-white dark:bg-slate-900 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
                        Stickers in Pack ({packStickers.length})
                      </h4>
                    </div>

                    {/* BATCH UNLOCK / LOCK CONTROLS */}
                    {packStickers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1.5 hidden sm:inline">
                          Batch:
                        </span>
                        {/* Option 1: Default (Common Unlocked, Others Locked) */}
                        <button
                          type="button"
                          onClick={handleSetDefaultLockState}
                          title="Default Rule: Common stickers are unlocked immediately; Rare, Legendary, and Mythic are locked as study rewards"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs hover:bg-indigo-50 dark:hover:bg-slate-600 border border-indigo-100 dark:border-indigo-900/50"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Default (Common Only)</span>
                        </button>

                        {/* Option 2: Lock All */}
                        <button
                          type="button"
                          onClick={handleLockAllStickers}
                          title="Lock all stickers in this pack so they must be earned through study quizzes"
                          className="px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-2xs hover:bg-amber-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                        >
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Lock All</span>
                        </button>

                        {/* Option 3: Unlock All */}
                        <button
                          type="button"
                          onClick={handleUnlockAllStickers}
                          title="Unlock all stickers immediately for instant creative use"
                          className="px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs hover:bg-emerald-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                        >
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>Unlock All</span>
                        </button>
                      </div>
                    )}

                    {/* SOFT NUDGE RECOMMENDATION BANNER */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 ml-auto">
                      <span>🎯 Recommended: 8–12</span>
                      <span className="font-bold">
                        ({packStickers.filter((s) => s.isUnlocked).length} unlocked • {packStickers.filter((s) => !s.isUnlocked).length} locked)
                      </span>
                    </div>
                  </div>

                  {/* Existing Stickers Grid in Draft */}
                  {packStickers.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No stickers added yet. Use the form below to add emoji badges or custom transparent image stickers!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {packStickers.map((stk) => {
                          const isSelected = selectedDraftStickerId === stk.id;
                          return (
                            <div
                              key={stk.id}
                              onClick={() => {
                                sounds.playPop();
                                setSelectedDraftStickerId((prev) => (prev === stk.id ? null : stk.id));
                              }}
                              className={`relative group p-2.5 pb-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center select-none ${
                                isSelected
                                  ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/90 dark:bg-purple-950/70 shadow-md scale-[1.03]'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-purple-400 dark:hover:border-purple-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 shadow-2xs'
                              }`}
                              title="Click to select or edit this sticker"
                            >
                              {/* Always-visible red delete button with clear trash can icon */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveStickerFromDraft(stk.id);
                                }}
                                className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950/90 dark:hover:bg-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/80 shadow-xs transition-all cursor-pointer z-10"
                                title={`Delete "${stk.name}" from pack`}
                                aria-label={`Delete ${stk.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Selected Status Pill */}
                              {isSelected && (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-bold shadow-2xs z-10">
                                  Selected
                                </span>
                              )}

                              {/* Lock / Unlock Toggle Icon on Bottom-Right Corner */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleDraftStickerLock(stk.id);
                                }}
                                className={`absolute bottom-1.5 right-1.5 p-1 rounded-lg border shadow-2xs transition-all cursor-pointer z-10 flex items-center justify-center ${
                                  stk.isUnlocked
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/90 dark:hover:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/90 dark:hover:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                }`}
                                title={
                                  stk.isUnlocked
                                    ? 'Unlocked: Available immediately (Click to lock as study reward)'
                                    : 'Locked: Study reward (Click to unlock immediately)'
                                }
                                aria-label={stk.isUnlocked ? `Lock ${stk.name}` : `Unlock ${stk.name}`}
                              >
                                {stk.isUnlocked ? (
                                  <Unlock className="w-3.5 h-3.5" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <div
                                className={`w-12 h-12 rounded-2xl bg-white shadow-md border-2 flex items-center justify-center mb-1.5 transition-transform ${
                                  isSelected ? 'border-purple-400 scale-105' : 'border-white'
                                }`}
                              >
                                <StickerIconRenderer icon={stk.svgIcon} size="md" alt={stk.name} />
                              </div>

                              <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-100 truncate w-full px-1">
                                {stk.name}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5 self-start pl-1">
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                                    stk.rarity === 'Mythic'
                                      ? 'bg-amber-100 text-amber-800'
                                      : stk.rarity === 'Legendary'
                                      ? 'bg-purple-100 text-purple-800'
                                      : stk.rarity === 'Rare'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {stk.rarity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* SELECTED STICKER INSPECTOR & ACTION BAR */}
                      {(() => {
                        const selectedSticker = packStickers.find((s) => s.id === selectedDraftStickerId);
                        if (!selectedSticker) return null;

                        return (
                          <div className="p-3.5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/50 border-2 border-purple-300 dark:border-purple-800 space-y-3 mt-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 dark:border-purple-900/60 pb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-purple-200 flex items-center justify-center shrink-0">
                                  <StickerIconRenderer icon={selectedSticker.svgIcon} size="md" alt={selectedSticker.name} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                      Selected: <span className="text-purple-600 dark:text-purple-300">{selectedSticker.name}</span>
                                    </span>
                                    <span
                                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        selectedSticker.rarity === 'Mythic'
                                          ? 'bg-amber-100 text-amber-800'
                                          : selectedSticker.rarity === 'Legendary'
                                          ? 'bg-purple-100 text-purple-800'
                                          : selectedSticker.rarity === 'Rare'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {selectedSticker.rarity}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">Edit details below or toggle unlock status</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Lock/Unlock Toggle in Inspector */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleDraftStickerLock(selectedSticker.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                                    selectedSticker.isUnlocked
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200'
                                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-200'
                                  }`}
                                  title="Toggle whether this sticker is available immediately or unlocked through studying"
                                >
                                  {selectedSticker.isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                  <span>{selectedSticker.isUnlocked ? 'Unlocked (Immediate)' : 'Locked (Study Reward)'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveStickerFromDraft(selectedSticker.id)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                  title="Delete selected sticker"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDraftStickerId(null)}
                                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 cursor-pointer"
                                >
                                  Deselect
                                </button>
                              </div>
                            </div>

                            {/* In-Place Edit Fields for Selected Sticker */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                  Sticker Name
                                </label>
                                <input
                                  type="text"
                                  value={selectedSticker.name || ''}
                                  onChange={(e) => handleUpdateSelectedSticker({ name: e.target.value })}
                                  className="w-full px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                  Rarity Tier
                                </label>
                                <select
                                  value={selectedSticker.rarity}
                                  onChange={(e) => handleUpdateSelectedSticker({ rarity: e.target.value as StickerRarity })}
                                  className="w-full px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 outline-hidden"
                                >
                                  <option value="Common">Common (Bronze)</option>
                                  <option value="Rare">Rare (Blue)</option>
                                  <option value="Legendary">Legendary (Purple)</option>
                                  <option value="Mythic">Mythic (Gold / Hologram)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                  Accent Glow
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={selectedSticker.color || '#6366f1'}
                                    onChange={(e) => handleUpdateSelectedSticker({ color: e.target.value })}
                                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                                  />
                                  <span className="text-xs font-mono text-slate-500">{selectedSticker.color || '#6366f1'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ADD STICKER TO PACK SUB-FORM */}
                  <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-display font-bold text-xs uppercase tracking-wide text-purple-900 dark:text-purple-300">
                        + Add Sticker to Pack
                      </h5>

                      {/* Input Type Toggle */}
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-purple-100 dark:border-purple-900">
                        <button
                          type="button"
                          onClick={() => setStickerInputType('emoji')}
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                            stickerInputType === 'emoji'
                              ? 'bg-purple-600 text-white font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          Emoji / Icon
                        </button>
                        <button
                          type="button"
                          onClick={() => setStickerInputType('image')}
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                            stickerInputType === 'image'
                              ? 'bg-purple-600 text-white font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          Image / PNG Upload
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                      {stickerInputType === 'emoji' ? (
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Emoji Character</label>
                          <input
                            type="text"
                            value={newStickerEmoji}
                            onChange={(e) => setNewStickerEmoji(e.target.value)}
                            maxLength={4}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-xl outline-hidden focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Sticker Graphic</label>
                          <input
                            ref={stickerImageFileInputRef}
                            type="file"
                            accept="image/png,image/webp,image/svg+xml"
                            onChange={handleStickerImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => stickerImageFileInputRef.current?.click()}
                            className="w-full py-2 px-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-xs font-bold text-purple-600 dark:text-purple-300 flex items-center justify-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{newStickerImageData ? 'Change Image' : 'Upload PNG'}</span>
                          </button>
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-500 mb-1">Sticker Name *</label>
                        <input
                          type="text"
                          value={newStickerName}
                          onChange={(e) => setNewStickerName(e.target.value)}
                          placeholder="e.g. Neon Dragon, Space Voyager"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-hidden focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Rarity</label>
                        <select
                          value={newStickerRarity}
                          onChange={(e) => setNewStickerRarity(e.target.value as StickerRarity)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-hidden"
                        >
                          <option value="Common">Common (Bronze)</option>
                          <option value="Rare">Rare (Silver / Blue)</option>
                          <option value="Legendary">Legendary (Purple)</option>
                          <option value="Mythic">Mythic (Gold)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddStickerToDraft}
                        disabled={!newStickerName.trim()}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Sticker</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. BOTTOM SAVE & CANCEL BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('installed')}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  {/* If editing an existing custom pack, allow deletion right here */}
                  {editingPackId && packs.find((p) => p.id === editingPackId)?.isCustom && (
                    confirmingDeletePackId === editingPackId ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/90 px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 animate-in fade-in duration-150">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                          Delete pack?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            onDeletePack(editingPackId);
                            setConfirmingDeletePackId(null);
                            handleStartCreateNew();
                            setActiveTab('installed');
                          }}
                          className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDeletePackId(null)}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setConfirmingDeletePackId(editingPackId);
                        }}
                        className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Delete this custom pack"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Pack</span>
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSavePackSubmit}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Pack to StickerBook</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT PACK */}
          {activeTab === 'import' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs border border-indigo-100 dark:border-indigo-900">
                  <FolderDown className="w-7 h-7" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">
                  Import Shared Pack (.json)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select or drop a BrainGrid Vault Pack JSON file to install custom themes, sticker collections, or full combos.
                </p>
              </div>

              {/* Dropzone / Upload Box */}
              <input
                ref={importFileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFileChange}
                className="hidden"
              />

              <div
                onClick={() => {
                  if (importFileInputRef.current) {
                    importFileInputRef.current.value = '';
                    importFileInputRef.current.click();
                  }
                }}
                className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30"
              >
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Click to choose file or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">Accepts .json and .braingrid-pack.json</p>
              </div>

              {importError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* File Parsed Preview */}
              {importPreview && (
                <div className="p-5 rounded-2xl border-2 border-indigo-500 bg-white dark:bg-slate-900 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{importPreview.icon || '📦'}</span>
                      <div>
                        <h4 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">
                          {importPreview.name || 'Custom Pack'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          By {importPreview.author || 'Community Creator'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {(importPreview.packType || 'combo').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {importPreview.description || 'Custom Vault Pack'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {importPreview.stickers && Array.isArray(importPreview.stickers) && (
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        🏷️ {importPreview.stickers.length} Stickers
                      </span>
                    )}
                    {importPreview.themeScene && (
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">
                        🎨 1 Companion Theme ({importPreview.themeScene.name || 'Custom Theme'})
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleInstallImportedPack}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Install Pack to StickerBook</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
