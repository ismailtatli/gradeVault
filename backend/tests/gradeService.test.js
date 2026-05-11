const {
  letterGrade,
  gradeToGpa,
  academicStatus
} = require('../src/services/gradeService');

describe('letterGrade', () => {
  test('95 returns AA', () => expect(letterGrade(95)).toBe('AA'));
  test('85 returns AA', () => expect(letterGrade(85)).toBe('AA'));
  test('84 returns BA', () => expect(letterGrade(84)).toBe('BA'));
  test('75 returns BA', () => expect(letterGrade(75)).toBe('BA'));
  test('72 returns BB', () => expect(letterGrade(72)).toBe('BB'));
  test('67 returns CB', () => expect(letterGrade(67)).toBe('CB'));
  test('62 returns CC', () => expect(letterGrade(62)).toBe('CC'));
  test('52 returns DC', () => expect(letterGrade(52)).toBe('DC'));
  test('45 returns DD', () => expect(letterGrade(45)).toBe('DD'));
  test('35 returns FD', () => expect(letterGrade(35)).toBe('FD'));
  test('20 returns FF', () => expect(letterGrade(20)).toBe('FF'));
  test('null returns N/A', () => expect(letterGrade(null)).toBe('N/A'));
});

describe('gradeToGpa', () => {
  test('90 returns 4.0', () => expect(gradeToGpa(90)).toBe(4.0));
  test('80 returns 3.5', () => expect(gradeToGpa(80)).toBe(3.5));
  test('72 returns 3.0', () => expect(gradeToGpa(72)).toBe(3.0));
  test('67 returns 2.5', () => expect(gradeToGpa(67)).toBe(2.5));
  test('60 returns 2.0', () => expect(gradeToGpa(60)).toBe(2.0));
  test('52 returns 1.5', () => expect(gradeToGpa(52)).toBe(1.5));
  test('45 returns 1.0', () => expect(gradeToGpa(45)).toBe(1.0));
  test('35 returns 0.5', () => expect(gradeToGpa(35)).toBe(0.5));
  test('20 returns 0.0', () => expect(gradeToGpa(20)).toBe(0.0));
  test('null returns null', () => expect(gradeToGpa(null)).toBeNull());
});

describe('academicStatus', () => {
  test('null returns No Grade', () => expect(academicStatus(null)).toBe('No Grade'));
  test('45 returns At Risk', () => expect(academicStatus(45)).toBe('At Risk'));
  test('55 returns Conditional Pass', () => expect(academicStatus(55)).toBe('Conditional Pass'));
  test('70 returns Successful', () => expect(academicStatus(70)).toBe('Successful'));
});