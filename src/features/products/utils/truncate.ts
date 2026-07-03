export function truncateDescription(text: string, maxLength = 100): string {
  if (text.length <= maxLength) {
    return text
  }

  if (maxLength <= 1) {
    return text.slice(0, maxLength)
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}
