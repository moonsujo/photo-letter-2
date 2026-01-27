export function safeDecode(value, fallback) {
  try {
    return JSON.parse(atob(value))
  } catch {
    return fallback
  }
}