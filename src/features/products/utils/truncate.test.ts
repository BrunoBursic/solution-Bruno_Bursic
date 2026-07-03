import { describe, expect, it } from 'vitest'
import { truncateDescription } from './truncate'

describe('truncateDescription', () => {
  it('keeps text shorter than the limit unchanged', () => {
    expect(truncateDescription('Short description', 100)).toBe('Short description')
  })

  it('keeps text exactly at the limit unchanged', () => {
    expect(truncateDescription('12345', 5)).toBe('12345')
  })

  it('truncates long text and ends with an ellipsis', () => {
    expect(truncateDescription('The quick brown fox jumps over the lazy dog', 20)).toBe(
      'The quick brown fox…',
    )
  })

  it('does not exceed the requested length', () => {
    expect(truncateDescription('abcdef', 4)).toHaveLength(4)
  })
})
