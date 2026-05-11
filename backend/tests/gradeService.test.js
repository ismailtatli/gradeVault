const { letterGrade, gradeToGpa } = require('../src/services/gradeService');

describe('letterGrade', () => {
  test('95 returns AA', () => expect(letterGrade(95)).toBe('AA'));
  test('90 returns AA', () => expect(letterGrade(90)).toBe('AA'));
  test('87 returns BA', () => expect(letterGrade(87)).toBe('BA'));
  test('82 returns BB', () => expect(letterGrade(82)).toBe('BB'));
  test('77 returns CB', () => expect(letterGrade(77)).toBe('CB'));
  test('72 returns CC', () => expect(letterGrade(72)).toBe('CC'));
  test('67 returns DC', () => expect(letterGrade(67)).toBe('DC'));
  test('62 returns DD', () => expect(letterGrade(62)).toBe('DD'));
  test('45 returns FF', () => expect(letterGrade(45)).toBe('FF'));
  test('null returns N/A', () => expect(letterGrade(null)).toBe('N/A'));
});

describe('gradeToGpa', () => {
  test('92 returns 4.0', () => expect(gradeToGpa(92)).toBe(4.0));
  test('86 returns 3.5', () => expect(gradeToGpa(86)).toBe(3.5));
  test('81 returns 3.0', () => expect(gradeToGpa(81)).toBe(3.0));
  test('76 returns 2.5', () => expect(gradeToGpa(76)).toBe(2.5));
  test('71 returns 2.0', () => expect(gradeToGpa(71)).toBe(2.0));
  test('50 returns 0.0', () => expect(gradeToGpa(50)).toBe(0.0));
  test('null returns null', () => expect(gradeToGpa(null)).toBeNull());
});