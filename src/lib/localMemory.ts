interface RecentTable {
  tableId: string
  tableName: string
  characterName: string
  isGM: boolean
}

const RECENT_KEY = 'ninja-mesa:recent-tables'
const NAME_PREFIX = 'ninja-mesa:name:'

export function getRecentTables(): RecentTable[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as RecentTable[]) : []
  } catch {
    return []
  }
}

export function rememberTable(entry: RecentTable) {
  try {
    const existing = getRecentTables().filter((t) => t.tableId !== entry.tableId)
    const next = [entry, ...existing].slice(0, 8)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // localStorage indisponível — ignora
  }
}

export function getStoredName(tableId: string): string | null {
  try {
    return localStorage.getItem(NAME_PREFIX + tableId)
  } catch {
    return null
  }
}

export function setStoredName(tableId: string, name: string) {
  try {
    localStorage.setItem(NAME_PREFIX + tableId, name)
  } catch {
    // ignora
  }
}
