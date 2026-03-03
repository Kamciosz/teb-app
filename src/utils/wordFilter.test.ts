import { filterText } from './wordFilter';

describe('Word Filter', () => {
  test('should censor bad words', () => {
    expect(filterText('To jest kurwa dramat')).toBe('To jest #### dramat');
    expect(filterText('Jaki chuj')).toBe('Jaki ####');
  });

  test('should handle repeated characters (fuzzy)', () => {
    expect(filterText('kkuurrwwaa')).toBe('####');
  });

  test('should be case insensitive', () => {
    expect(filterText('KURWA')).toBe('####');
  });

  test('should not affect safe text', () => {
    expect(filterText('To jest bezpieczny tekst')).toBe('To jest bezpieczny tekst');
  });
});
