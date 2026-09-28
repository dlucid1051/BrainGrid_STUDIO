import { CanvasScene, PlacedSticker, StickerPack } from '../types';

const DB_NAME = 'braingrid_vault_db_v1';
const DB_VERSION = 2;
const STORE_SCENES = 'scenes';
const STORE_PACKS = 'packs';
const STORE_PLACED_STICKERS = 'placed_stickers';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SCENES)) {
        db.createObjectStore(STORE_SCENES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PACKS)) {
        db.createObjectStore(STORE_PACKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PLACED_STICKERS)) {
        db.createObjectStore(STORE_PLACED_STICKERS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// In-memory runtime cache
let cachedScenes: CanvasScene[] | null = null;
let cachedPacks: StickerPack[] | null = null;
let cachedPlacedStickers: PlacedSticker[] | null = null;

export function getCachedScenes(): CanvasScene[] | null {
  return cachedScenes;
}

export function setCachedScenes(scenes: CanvasScene[]) {
  cachedScenes = scenes;
}

export function getCachedPacks(): StickerPack[] | null {
  return cachedPacks;
}

export function setCachedPacks(packs: StickerPack[]) {
  cachedPacks = packs;
}

export function getCachedPlacedStickers(): PlacedSticker[] | null {
  return cachedPlacedStickers;
}

export function setCachedPlacedStickers(stickers: PlacedSticker[]) {
  cachedPlacedStickers = stickers;
}

export async function idbSaveScenes(scenes: CanvasScene[]): Promise<void> {
  setCachedScenes(scenes);
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SCENES, 'readwrite');
    const store = tx.objectStore(STORE_SCENES);

    // Clear existing to avoid orphaned records
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const scene of scenes) {
      store.put(scene);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB saveScenes warning:', err);
  }
}

export async function idbLoadScenes(): Promise<CanvasScene[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SCENES, 'readonly');
    const store = tx.objectStore(STORE_SCENES);

    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const result = (req.result || []) as CanvasScene[];
        if (result.length > 0) {
          setCachedScenes(result);
        }
        resolve(result);
      };
      req.onerror = () => {
        resolve([]);
      };
    });
  } catch {
    return [];
  }
}

export async function idbSavePacks(packs: StickerPack[]): Promise<void> {
  setCachedPacks(packs);
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PACKS, 'readwrite');
    const store = tx.objectStore(STORE_PACKS);

    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const pack of packs) {
      store.put(pack);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB savePacks warning:', err);
  }
}

export async function idbLoadPacks(): Promise<StickerPack[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PACKS, 'readonly');
    const store = tx.objectStore(STORE_PACKS);

    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const result = (req.result || []) as StickerPack[];
        if (result.length > 0) {
          setCachedPacks(result);
        }
        resolve(result);
      };
      req.onerror = () => {
        resolve([]);
      };
    });
  } catch {
    return [];
  }
}

export async function idbSavePlacedStickers(stickers: PlacedSticker[]): Promise<void> {
  setCachedPlacedStickers(stickers);
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PLACED_STICKERS, 'readwrite');
    const store = tx.objectStore(STORE_PLACED_STICKERS);

    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const sticker of stickers) {
      store.put(sticker);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB savePlacedStickers warning:', err);
  }
}

export async function idbLoadPlacedStickers(): Promise<PlacedSticker[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PLACED_STICKERS, 'readonly');
    const store = tx.objectStore(STORE_PLACED_STICKERS);

    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const result = (req.result || []) as PlacedSticker[];
        if (result.length > 0) {
          setCachedPlacedStickers(result);
        }
        resolve(result);
      };
      req.onerror = () => {
        resolve([]);
      };
    });
  } catch {
    return [];
  }
}

export async function idbClearAll(): Promise<void> {
  cachedScenes = null;
  cachedPacks = null;
  cachedPlacedStickers = null;
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_SCENES, STORE_PACKS, STORE_PLACED_STICKERS], 'readwrite');
    tx.objectStore(STORE_SCENES).clear();
    tx.objectStore(STORE_PACKS).clear();
    tx.objectStore(STORE_PLACED_STICKERS).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB clear warning:', err);
  }
}


