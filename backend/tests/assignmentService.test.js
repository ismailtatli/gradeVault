const { validateAssignment } = require('../src/services/assignmentService');

describe('validateAssignment', () => {
  test('valid data returns no errors', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'exam', weight: 40, grade: 85 });
    expect(result).toHaveLength(0);
  });
  test('short title returns error', () => {
    const result = validateAssignment({ title: 'A', type: 'exam', weight: 40 });
    expect(result).toContain('Title must be at least 2 characters.');
  });
  test('invalid type returns error', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'homework', weight: 40 });
    expect(result).toContain('Type must be one of: exam, assignment, quiz, project.');
  });
  test('zero weight returns error', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'exam', weight: 0 });
    expect(result).toContain('Weight must be between 0 and 100.');
  });
  test('weight over 100 returns error', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'exam', weight: 150 });
    expect(result).toContain('Weight must be between 0 and 100.');
  });
  test('grade over 100 returns error', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'exam', weight: 40, grade: 110 });
    expect(result).toContain('Grade must be between 0 and 100.');
  });
  test('null grade is allowed', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'exam', weight: 40, grade: null });
    expect(result).toHaveLength(0);
  });
  test('empty grade string is allowed', () => {
    const result = validateAssignment({ title: 'Midterm', type: 'exam', weight: 40, grade: '' });
    expect(result).toHaveLength(0);
  });
});