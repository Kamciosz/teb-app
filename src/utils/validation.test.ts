import { isValidTebEmail, formatCurrency } from './validation';

describe('Validation Utils', () => {
  test('isValidTebEmail should return true for @teb.edu.pl emails', () => {
    expect(isValidTebEmail('jan.kowalski@teb.edu.pl')).toBe(true);
  });

  test('isValidTebEmail should return false for other domains', () => {
    expect(isValidTebEmail('jan.kowalski@gmail.com')).toBe(false);
    expect(isValidTebEmail('jan.kowalski@teb.pl')).toBe(false);
  });

  test('formatCurrency should format correctly', () => {
    // Note: implementation depends on locale, which might vary in test environment
    // Just checking basic output or mocking Intl
    // For simplicity, we assume pl-PL locale is available or default format
    const result = formatCurrency(100);
    expect(result).toContain('100');
    expect(result).toContain('zł');
  });
});
