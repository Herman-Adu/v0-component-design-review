// ---------------------------------------------------------------------------
// Reusable In-Memory Store Utilities
// ---------------------------------------------------------------------------
// Provides HMR-safe ID generation and store management with built-in
// deduplication. All admin features should use these utilities to prevent
// duplicate key issues across hot reloads and module re-evaluations.
//
// Pattern:
//   import { globalId, createStore } from "@/lib/store-utils"
//   const myStore = createStore<MyType>("__my_feature_items__")
//   myStore.push({ id: globalId("item"), ... })
//   const items = myStore.getAll()  // always deduplicated
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. HMR-Safe ID Generator
// ---------------------------------------------------------------------------
// Uses globalThis to persist the counter across hot reloads. The counter
// is combined with Date.now() and a random suffix for triple-layer
// collision protection.

const ID_COUNTER_KEY = "__store_utils_id_counter__"

function getCounter(): { value: number } {
  const g = globalThis as Record<string, unknown>
  if (!g[ID_COUNTER_KEY]) {
    g[ID_COUNTER_KEY] = { value: 0 }
  }
  return g[ID_COUNTER_KEY] as { value: number }
}

/**
 * Generate a globally unique ID that survives HMR.
 * Format: `{prefix}_{timestamp}_{counter}_{random}`
 *
 * @example globalId("corr") => "corr_1707400000000_42_a3f"
 */
export function globalId(prefix: string): string {
  const counter = getCounter()
  counter.value++
  const rand = Math.random().toString(36).slice(2, 5)
  return `${prefix}_${Date.now()}_${counter.value}_${rand}`
}

// ---------------------------------------------------------------------------
// 2. Type-Safe Store with Deduplication
// ---------------------------------------------------------------------------
// Wraps a globalThis-persisted array with methods that enforce uniqueness
// by `id` field on every insert and query operation.

interface HasId {
  id: string
}

interface Store<T extends HasId> {
  /** Get all items, deduplicated by id (last-write-wins) */
  getAll(): T[]
  /** Get items matching a filter, deduplicated */
  filter(predicate: (item: T) => boolean): T[]
  /** Find a single item by predicate */
  find(predicate: (item: T) => boolean): T | undefined
  /** Push item to end (skips if id already exists) */
  push(item: T): void
  /** Unshift item to start (skips if id already exists) */
  unshift(item: T): void
  /** Update an item by id */
  update(id: string, updater: (item: T) => void): void
  /** Remove items by predicate */
  remove(predicate: (item: T) => boolean): void
  /** Get the raw array (for seeding only -- prefer getAll/filter) */
  raw(): T[]
  /** Get count of unique items */
  count(): number
}

/**
 * Create a type-safe, deduplicated in-memory store persisted on globalThis.
 *
 * @example
 * const jobStore = createStore<Job>("__jobs__")
 * jobStore.push({ id: globalId("job"), name: "Test" })
 * const jobs = jobStore.getAll() // always unique by id
 */
export function createStore<T extends HasId>(key: string): Store<T> {
  function getArray(): T[] {
    const g = globalThis as Record<string, unknown>
    if (!g[key]) g[key] = [] as T[]
    return g[key] as T[]
  }

  function dedupe(arr: T[]): T[] {
    const seen = new Set<string>()
    const result: T[] = []
    // Iterate in reverse so the latest entry wins, then reverse back
    for (let i = arr.length - 1; i >= 0; i--) {
      if (!seen.has(arr[i].id)) {
        seen.add(arr[i].id)
        result.push(arr[i])
      }
    }
    return result.reverse()
  }

  return {
    getAll() {
      return dedupe(getArray())
    },

    filter(predicate) {
      return dedupe(getArray()).filter(predicate)
    },

    find(predicate) {
      return dedupe(getArray()).find(predicate)
    },

    push(item) {
      const arr = getArray()
      // Skip if this exact id already exists
      if (arr.some((existing) => existing.id === item.id)) return
      arr.push(item)
    },

    unshift(item) {
      const arr = getArray()
      if (arr.some((existing) => existing.id === item.id)) return
      arr.unshift(item)
    },

    update(id, updater) {
      const item = getArray().find((i) => i.id === id)
      if (item) updater(item)
    },

    remove(predicate) {
      const g = globalThis as Record<string, unknown>
      const arr = getArray()
      g[key] = arr.filter((item) => !predicate(item))
    },

    raw() {
      return getArray()
    },

    count() {
      return dedupe(getArray()).length
    },
  }
}
