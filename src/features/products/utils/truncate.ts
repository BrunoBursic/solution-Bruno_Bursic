export function truncateDescription(text: string, maxLength = 100): string {
  if (text.length <= maxLength) {
    return text
  }

  if (maxLength <= 3) {
    return text.slice(0, maxLength)
  }

  return `${text.slice(0, maxLength - 3).trimEnd()}...`
}
