const lastCodes = new Map<string, string>()

export function recordCode(email: string, code: string) {
  lastCodes.set(email.trim().toLowerCase(), code)
}

export function getLastCode(email: string) {
  return lastCodes.get(email.trim().toLowerCase())
}

export function clearCodes() {
  lastCodes.clear()
}
