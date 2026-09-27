import { CanvasScene, Deck, ExportedSticker, Flashcard, PlacedSticker, Sticker, StickerPack, StudySettings, VaultPackFile } from '../types';

/**
 * Robust CSV parser that handles quotes, escaped quotes, commas, tabs, and multiline values
 */
export function parseCSVToCards(csvText: string): Flashcard[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const cards: Flashcard[] = [];

  // Helper to split a CSV line into cells respecting quotes
  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let cur = '';
    let inQuotes = false;
    // Auto-detect delimiter: check for tab if no comma
    const delimiter = line.includes('\t') && !line.includes(',') ? '\t' : ',';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    cells.push(cur.trim());
    return cells;
  };

  let startIndex = 0;
  // Check if first line looks like a header
  if (lines.length > 0) {
    const headerCells = parseLine(lines[0]).map((c) => c.toLowerCase());
    if (headerCells.some((c) => c.includes('term') || c.includes('front') || c.includes('word') || c.includes('question'))) {
      startIndex = 1;
    }
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cells = parseLine(line);
    if (cells.length >= 2) {
      const term = cells[0];
      const definition = cells[1];
      const category = cells[2] || undefined;

      if (term && definition) {
        cards.push({
          id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          term,
          definition,
          category,
        });
      }
    }
  }

  return cards;
}

/**
 * Convert cards back into downloadable CSV
 */
export function cardsToCSV(cards: Flashcard[]): string {
  const escapeCell = (text: string) => {
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const header = 'Term,Definition,Category';
  const rows = cards.map((c) => `${escapeCell(c.term)},${escapeCell(c.definition)},${escapeCell(c.category || '')}`);
  return [header, ...rows].join('\n');
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// LocalStorage Keys
const STORAGE_CUSTOM_DECKS = 'braingrid_custom_decks';
const STORAGE_UNLOCKED_STICKERS = 'braingrid_unlocked_stickers';
const STORAGE_PLACED_STICKERS = 'braingrid_placed_stickers';
const STORAGE_SETTINGS = 'braingrid_settings';
const STORAGE_CANVAS_SCENE = 'braingrid_canvas_scene';
import {
  idbSaveScenes,
  idbSavePacks,
  idbSavePlacedStickers,
  getCachedScenes,
  setCachedScenes,
  getCachedPacks,
  setCachedPacks,
  getCachedPlacedStickers,
  setCachedPlacedStickers,
} from './indexedDBStorage';
import { optimizeImageDataUrl } from './imageOptimizer';

const STORAGE_PASTEL_COLOR = 'braingrid_pastel_color_id_v1';
const STORAGE_NEON_COLOR = 'braingrid_neon_color_id_v1';
const STORAGE_CUSTOM_PACKS = 'braingrid_custom_sticker_packs_v1';
const STORAGE_CUSTOM_SCENES = 'braingrid_custom_canvas_scenes_v1';

export const storage = {
  loadCustomPacks(): StickerPack[] {
    const cached = getCachedPacks();
    if (cached && cached.length > 0) {
      return cached;
    }
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_PACKS);
      const parsed = raw ? JSON.parse(raw) : [];
      if (parsed.length > 0) {
        setCachedPacks(parsed);
      }
      return parsed;
    } catch {
      return [];
    }
  },

  saveCustomPacks(packs: StickerPack[]) {
    setCachedPacks(packs);
    idbSavePacks(packs).catch(() => {});
    try {
      localStorage.setItem(STORAGE_CUSTOM_PACKS, JSON.stringify(packs));
    } catch (err) {
      console.warn('localStorage saveCustomPacks quota warning:', err);
    }
  },

  loadCustomScenes(): CanvasScene[] {
    const cached = getCachedScenes();
    if (cached && cached.length > 0) {
      return cached;
    }
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_SCENES);
      const parsed = raw ? JSON.parse(raw) : [];
      if (parsed.length > 0) {
        setCachedScenes(parsed);
      }
      return parsed;
    } catch {
      return [];
    }
  },

  saveCustomScenes(scenes: CanvasScene[]) {
    setCachedScenes(scenes);
    idbSaveScenes(scenes).catch(() => {});
    try {
      localStorage.setItem(STORAGE_CUSTOM_SCENES, JSON.stringify(scenes));
    } catch (err) {
      console.warn('localStorage saveCustomScenes quota exceeded, persisted via IndexedDB & in-memory cache:', err);
    }
  },
  loadCustomDecks(): Deck[] {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_DECKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveCustomDecks(decks: Deck[]) {
    try {
      localStorage.setItem(STORAGE_CUSTOM_DECKS, JSON.stringify(decks));
    } catch {
      // Storage error catch
    }
  },

  loadUnlockedStickers(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_UNLOCKED_STICKERS);
      // Give 2 starter unlocked stickers so the vault isn't empty on day 1!
      return raw ? JSON.parse(raw) : ['stk-space-1', 'stk-dino-1'];
    } catch {
      return ['stk-space-1', 'stk-dino-1'];
    }
  },

  saveUnlockedStickers(ids: string[]) {
    try {
      localStorage.setItem(STORAGE_UNLOCKED_STICKERS, JSON.stringify(ids));
    } catch {
      // Storage error catch
    }
  },

  loadPlacedStickers(): PlacedSticker[] {
    const cached = getCachedPlacedStickers();
    if (cached && cached.length > 0) {
      return cached;
    }
    try {
      const raw = localStorage.getItem(STORAGE_PLACED_STICKERS);
      const parsed = raw ? JSON.parse(raw) : [];
      if (parsed.length > 0) {
        setCachedPlacedStickers(parsed);
      }
      return parsed;
    } catch {
      return [];
    }
  },

  savePlacedStickers(stickers: PlacedSticker[]) {
    setCachedPlacedStickers(stickers);
    idbSavePlacedStickers(stickers).catch(() => {});
    try {
      localStorage.setItem(STORAGE_PLACED_STICKERS, JSON.stringify(stickers));
    } catch (err) {
      console.warn('localStorage savePlacedStickers quota exceeded, persisted via IndexedDB & in-memory cache:', err);
      try {
        // Lightweight fallback for localStorage if quota exceeded
        const lightweight = stickers.map((s) => {
          if (s.stickerSnapshot && s.stickerSnapshot.svgIcon && s.stickerSnapshot.svgIcon.length > 1000) {
            return {
              ...s,
              stickerSnapshot: {
                ...s.stickerSnapshot,
                svgIcon: '✨',
              },
            };
          }
          return s;
        });
        localStorage.setItem(STORAGE_PLACED_STICKERS, JSON.stringify(lightweight));
      } catch {
        // Handled by IndexedDB
      }
    }
  },

  loadSettings(): StudySettings {
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          cardOrientation: 'term-first',
          themeMode: 'system',
          cardBackgroundStyle: 'illustrated',
          logoGraphicId: 'synapse',
          ...parsed,
        };
      }
    } catch {
      // fallback
    }
    return {
      flipTimerDuration: 15, // Default 15s as requested by user
      gridSize: '2x3', // Default 2x3 as requested by user
      soundEnabled: true,
      autoFlip: true,
      cardOrientation: 'term-first',
      themeMode: 'system',
      cardBackgroundStyle: 'illustrated',
      logoGraphicId: 'synapse',
    };
  },

  saveSettings(settings: StudySettings) {
    try {
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
    } catch {
      // Storage error catch
    }
  },

  loadCanvasSceneId(): string {
    return localStorage.getItem(STORAGE_CANVAS_SCENE) || 'scene-notebook';
  },

  saveCanvasSceneId(sceneId: string) {
    localStorage.setItem(STORAGE_CANVAS_SCENE, sceneId);
  },

  loadPastelColorId(): string | null {
    return localStorage.getItem(STORAGE_PASTEL_COLOR);
  },

  savePastelColorId(colorId: string) {
    try {
      localStorage.setItem(STORAGE_PASTEL_COLOR, colorId);
    } catch {
      // Storage error catch
    }
  },

  loadNeonColorId(): string | null {
    return localStorage.getItem(STORAGE_NEON_COLOR);
  },

  saveNeonColorId(colorId: string) {
    try {
      localStorage.setItem(STORAGE_NEON_COLOR, colorId);
    } catch {
      // Storage error catch
    }
  },
};

/**
 * Export a Sticker Pack and/or Canvas Theme to a downloadable JSON file
 */
export async function exportVaultPack(pack?: StickerPack, scene?: CanvasScene, customFilename?: string) {
  if (!pack && !scene) return;

  const hasStickers = !!(pack && pack.stickers && pack.stickers.length > 0);
  const hasTheme = !!scene;

  let packType: 'combo' | 'stickers-only' | 'background-only' = 'combo';
  if (hasStickers && hasTheme) {
    packType = 'combo';
  } else if (hasStickers) {
    packType = 'stickers-only';
  } else {
    packType = 'background-only';
  }

  const name = pack?.name || scene?.name || 'Vault Pack';
  const description = pack?.description || scene?.theme || 'BrainGrid Custom Vault Pack';
  const author = pack?.author || scene?.author || 'BrainGrid Creator';
  const icon = pack?.icon || '🎨';

  // Compact backdrop image on export if present
  let exportedCustomConfig = scene?.customConfig;
  if (exportedCustomConfig?.type === 'image' && exportedCustomConfig.imageUrl) {
    try {
      const optimizedBg = await optimizeImageDataUrl(
        exportedCustomConfig.imageUrl,
        1920,
        1080,
        0.82,
        'image/jpeg'
      );
      exportedCustomConfig = {
        ...exportedCustomConfig,
        imageUrl: optimizedBg,
      };
    } catch {
      // Keep existing if optimize fails
    }
  }

  // Compact any sticker images on export if present
  let exportedStickers: ExportedSticker[] | undefined = undefined;
  if (pack && pack.stickers) {
    exportedStickers = await Promise.all(
      pack.stickers.map(async ({ id: _id, packId: _pid, ...rest }) => {
        let svgIcon = rest.svgIcon;
        if (svgIcon && svgIcon.startsWith('data:image/')) {
          try {
            svgIcon = await optimizeImageDataUrl(
              svgIcon,
              512,
              512,
              0.85,
              'image/png'
            );
          } catch {
            // Keep existing if optimize fails
          }
        }
        return {
          name: rest.name,
          rarity: rest.rarity,
          svgIcon,
          color: rest.color,
          description: rest.description,
          isCustomImage: rest.isCustomImage,
          isUnlocked: rest.isUnlocked,
        };
      })
    );
  }

  const packFile: VaultPackFile = {
    version: 1,
    format: 'braingrid-vault-pack',
    packType,
    name,
    author,
    description,
    icon,
    stickers: exportedStickers,
    themeScene: scene
      ? {
          name: scene.name,
          theme: scene.theme,
          bgGradient: scene.bgGradient,
          decorClass: scene.decorClass,
          pattern: scene.pattern,
          isCustom: true,
          author: scene.author,
          customConfig: exportedCustomConfig,
        }
      : undefined,
    createdAt: Date.now(),
  };

  const jsonStr = JSON.stringify(packFile, null, 2);
  const safeBaseName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filename = customFilename || `braingrid-pack-${safeBaseName}.json`;

  downloadFile(jsonStr, filename, 'application/json');
}

/**
 * Parse and validate a Vault Pack JSON file string.
 * Supports standard BrainGrid vault pack schema, single pack exports,
 * community themes, and legacy pack formats with backdrop images.
 */
export function parseVaultPackJSON(jsonStr: string): VaultPackFile | null {
  try {
    const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    if (!data || typeof data !== 'object') return null;

    // Detect Pack Name with fallbacks
    const rawName = data.name || data.title || data.packName || data.theme;
    const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : 'Imported Vault Pack';

    // 1. Detect Stickers
    const rawStickers = Array.isArray(data.stickers)
      ? data.stickers
      : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.cards)
      ? data.cards
      : [];

    const cleanedStickers: ExportedSticker[] = rawStickers
      .filter((s: any) => s && typeof s === 'object')
      .map((s: any, idx: number) => {
        const stkName = typeof s.name === 'string' && s.name.trim() ? s.name.trim() : `Sticker ${idx + 1}`;
        const stkRarity = ['Common', 'Rare', 'Epic', 'Legendary'].includes(s.rarity) ? s.rarity : 'Common';
        const svgIcon = typeof s.svgIcon === 'string' ? s.svgIcon : typeof s.icon === 'string' ? s.icon : typeof s.imageUrl === 'string' ? s.imageUrl : '✨';
        const color = typeof s.color === 'string' ? s.color : 'text-indigo-400';
        const description = typeof s.description === 'string' ? s.description : `${stkRarity} sticker`;
        const isCustomImage = typeof s.isCustomImage === 'boolean' ? s.isCustomImage : (svgIcon.startsWith('data:image/') || svgIcon.startsWith('http'));
        const isUnlocked = typeof s.isUnlocked === 'boolean' ? s.isUnlocked : (stkRarity === 'Common');

        return {
          name: stkName,
          rarity: stkRarity,
          svgIcon,
          color,
          description,
          isCustomImage,
          isUnlocked,
        };
      });

    const hasStickers = cleanedStickers.length > 0;

    // 2. Detect Companion Theme / Backdrop Scene
    const rawSceneObj =
      (data.themeScene && typeof data.themeScene === 'object' ? data.themeScene : null) ||
      (data.scene && typeof data.scene === 'object' ? data.scene : null) ||
      (data.customScene && typeof data.customScene === 'object' ? data.customScene : null) ||
      (data.background && typeof data.background === 'object' ? data.background : null) ||
      (data.theme && typeof data.theme === 'object' ? data.theme : null);

    // Look for image backdrop URL in all common locations
    const detectedImageUrl: string | undefined =
      (rawSceneObj?.customConfig?.imageUrl as string) ||
      (rawSceneObj?.customConfig?.backgroundImageUrl as string) ||
      (rawSceneObj?.customConfig?.image as string) ||
      (rawSceneObj?.customConfig?.url as string) ||
      (rawSceneObj?.imageUrl as string) ||
      (rawSceneObj?.backgroundImageUrl as string) ||
      (rawSceneObj?.image as string) ||
      (rawSceneObj?.bgImage as string) ||
      (rawSceneObj?.backgroundImage as string) ||
      (data.customConfig?.imageUrl as string) ||
      (data.customConfig?.backgroundImageUrl as string) ||
      (data.imageUrl as string) ||
      (data.backgroundImageUrl as string) ||
      undefined;

    // Look for SVG backdrop markup
    const detectedSvgMarkup: string | undefined =
      (rawSceneObj?.customConfig?.svgMarkup as string) ||
      (rawSceneObj?.customConfig?.svg as string) ||
      (rawSceneObj?.svgMarkup as string) ||
      (rawSceneObj?.svg as string) ||
      (data.customConfig?.svgMarkup as string) ||
      (data.svgMarkup as string) ||
      undefined;

    let themeScene: VaultPackFile['themeScene'] = undefined;

    if (detectedImageUrl || detectedSvgMarkup || rawSceneObj) {
      const sceneName = (typeof rawSceneObj?.name === 'string' && rawSceneObj.name.trim())
        ? rawSceneObj.name.trim()
        : name;
      const themeTag = (typeof rawSceneObj?.theme === 'string' && rawSceneObj.theme.trim())
        ? rawSceneObj.theme.trim()
        : name;
      const bgGradient = (typeof rawSceneObj?.bgGradient === 'string' && rawSceneObj.bgGradient.trim())
        ? rawSceneObj.bgGradient
        : 'bg-slate-950';

      if (detectedImageUrl) {
        themeScene = {
          name: sceneName,
          theme: themeTag,
          bgGradient,
          decorClass: rawSceneObj?.decorClass,
          pattern: 'custom-image',
          isCustom: true,
          author: typeof rawSceneObj?.author === 'string' ? rawSceneObj.author : (typeof data.author === 'string' ? data.author : 'Community'),
          customConfig: {
            ...(rawSceneObj?.customConfig || {}),
            type: 'image',
            imageUrl: detectedImageUrl,
            fitMode: rawSceneObj?.customConfig?.fitMode || 'cover',
            opacity: rawSceneObj?.customConfig?.opacity ?? 100,
            dimming: rawSceneObj?.customConfig?.dimming ?? 0,
            blur: rawSceneObj?.customConfig?.blur ?? 0,
            overlayColor: rawSceneObj?.customConfig?.overlayColor,
            gridOverlay: rawSceneObj?.customConfig?.gridOverlay || 'none',
          },
        };
      } else if (detectedSvgMarkup) {
        themeScene = {
          name: sceneName,
          theme: themeTag,
          bgGradient,
          decorClass: rawSceneObj?.decorClass,
          pattern: 'custom-svg',
          isCustom: true,
          author: typeof rawSceneObj?.author === 'string' ? rawSceneObj.author : (typeof data.author === 'string' ? data.author : 'Community'),
          customConfig: {
            ...(rawSceneObj?.customConfig || {}),
            type: 'svg',
            svgMarkup: detectedSvgMarkup,
          },
        };
      } else if (rawSceneObj) {
        // Built-in pattern theme or generic scene
        const effectivePattern = rawSceneObj.pattern || 'custom-svg';
        themeScene = {
          name: sceneName,
          theme: themeTag,
          bgGradient,
          decorClass: rawSceneObj.decorClass,
          pattern: effectivePattern,
          isCustom: true,
          author: typeof rawSceneObj.author === 'string' ? rawSceneObj.author : (typeof data.author === 'string' ? data.author : 'Community'),
          customConfig: rawSceneObj.customConfig,
        };
      }
    }

    const hasTheme = !!themeScene;

    if (!hasStickers && !hasTheme) {
      return null;
    }

    let packType: 'combo' | 'stickers-only' | 'background-only' = 'combo';
    if (hasStickers && hasTheme) packType = 'combo';
    else if (hasStickers) packType = 'stickers-only';
    else packType = 'background-only';

    return {
      version: 1,
      format: 'braingrid-vault-pack',
      packType,
      name,
      author: typeof data.author === 'string' && data.author.trim() ? data.author.trim() : undefined,
      description: typeof data.description === 'string' && data.description.trim() ? data.description.trim() : 'Custom Vault Pack',
      icon: typeof data.icon === 'string' && data.icon.trim() ? data.icon.trim() : (packType === 'background-only' ? '🎨' : '📦'),
      stickers: hasStickers ? cleanedStickers : undefined,
      themeScene,
      createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
    };
  } catch {
    return null;
  }
}
