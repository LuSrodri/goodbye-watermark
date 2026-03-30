const DB_NAME = 'goodbye-watermark'
const DB_VERSION = 2
const IMAGES_STORE = 'images'
const SESSION_STORE = 'session'
const PENDING_PAYMENTS_STORE = 'pending_payments'

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
  paidCredits: number
}

export interface PendingPayment {
  sessionId: string
  credits: number
  createdAt: string
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

      // v2: track in-flight Stripe sessions so credits survive browser closes
      if (!db.objectStoreNames.contains(PENDING_PAYMENTS_STORE)) {
        db.createObjectStore(PENDING_PAYMENTS_STORE, { keyPath: 'sessionId' })
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
        resolve({ ...data, paidCredits: data.paidCredits ?? 0 })
      } else {
        resolve({ id: 'current', dailyCount: 0, lastResetDate: getTodayDate(), paidCredits: 0 })
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
  const lastReset = new Date(session.lastResetDate)
  const now = new Date(today)
  const diffDays = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays >= 15) {
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

export async function addPaidCredits(count: number): Promise<SessionData> {
  const session = await getSession()
  const updated: SessionData = { ...session, paidCredits: (session.paidCredits ?? 0) + count }
  await putSession(updated)
  return updated
}

export async function consumePaidCredit(): Promise<SessionData> {
  const session = await getSession()
  const current = session.paidCredits ?? 0
  const updated: SessionData = { ...session, paidCredits: Math.max(0, current - 1) }
  await putSession(updated)
  return updated
}

// Pending payments — survive browser closes / interrupted redirects

export async function savePendingPayment(sessionId: string, credits: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_PAYMENTS_STORE, 'readwrite')
    tx.objectStore(PENDING_PAYMENTS_STORE).put({
      sessionId,
      credits,
      createdAt: new Date().toISOString(),
    } satisfies PendingPayment)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function deletePendingPayment(sessionId: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_PAYMENTS_STORE, 'readwrite')
    tx.objectStore(PENDING_PAYMENTS_STORE).delete(sessionId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllPendingPayments(): Promise<PendingPayment[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_PAYMENTS_STORE, 'readonly')
    const request = tx.objectStore(PENDING_PAYMENTS_STORE).getAll()
    request.onsuccess = () => resolve(request.result as PendingPayment[])
    request.onerror = () => reject(request.error)
  })
}
