const DB_NAME = 'goodbye-watermark'
const DB_VERSION = 1
const IMAGES_STORE = 'images'
const SESSION_STORE = 'session'

export interface StoredImage {
  id: string
  blob: Blob
  originalName: string
  createdAt: string
}

export interface SessionData {
  id: 'current'
  dailyCount: number
  lastResetDate: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        const store = db.createObjectStore(IMAGES_STORE, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }

      if (!db.objectStoreNames.contains(SESSION_STORE)) {
        db.createObjectStore(SESSION_STORE, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveImage(id: string, blob: Blob, originalName: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, 'readwrite')
    tx.objectStore(IMAGES_STORE).put({
      id,
      blob,
      originalName,
      createdAt: new Date().toISOString(),
    } satisfies StoredImage)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllImages(): Promise<StoredImage[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, 'readonly')
    const index = tx.objectStore(IMAGES_STORE).index('createdAt')
    const request = index.openCursor(null, 'prev')
    const results: StoredImage[] = []

    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        resolve(results)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

export async function getImageBlob(id: string): Promise<Blob | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IMAGES_STORE, 'readonly')
    const request = tx.objectStore(IMAGES_STORE).get(id)
    request.onsuccess = () => {
      const record = request.result as StoredImage | undefined
      resolve(record?.blob ?? null)
    }
    request.onerror = () => reject(request.error)
  })
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export async function getSession(): Promise<SessionData> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SESSION_STORE, 'readonly')
    const request = tx.objectStore(SESSION_STORE).get('current')
    request.onsuccess = () => {
      const data = request.result as SessionData | undefined
      if (data) {
        resolve(data)
      } else {
        resolve({ id: 'current', dailyCount: 0, lastResetDate: getTodayDate() })
      }
    }
    request.onerror = () => reject(request.error)
  })
}

async function putSession(data: SessionData): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SESSION_STORE, 'readwrite')
    tx.objectStore(SESSION_STORE).put(data)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function resetDailyCountIfNewDay(): Promise<SessionData> {
  const session = await getSession()
  const today = getTodayDate()

  if (session.lastResetDate !== today) {
    const updated: SessionData = { ...session, dailyCount: 0, lastResetDate: today }
    await putSession(updated)
    return updated
  }

  return session
}

export async function incrementDailyCount(): Promise<SessionData> {
  const session = await resetDailyCountIfNewDay()
  const updated: SessionData = { ...session, dailyCount: session.dailyCount + 1 }
  await putSession(updated)
  return updated
}
