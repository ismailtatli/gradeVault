const { validateCourse } = require('../src/services/courseService');

describe('validateCourse', () => {
  test('valid data returns no errors', () => {
    const result = validateCourse({ name: 'Data Structures', code: 'CS201', credits: 3, semester: 'Fall 2025' });
    expect(result).toHaveLength(0);
  });
  test('missing name returns error', () => {
    const result = validateCourse({ name: '', code: 'CS201', credits: 3, semester: 'Fall 2025' });
    expect(result).toContain('Course name must be at least 2 characters.');
  });
  test('missing code returns error', () => {
    const result = validateCourse({ name: 'Math', code: '', credits: 3, semester: 'Fall 2025' });
    expect(result).toContain('Course code is required.');
  });
  test('zero credits returns error', () => {
    const result = validateCourse({ name: 'Math', code: 'MT101', credits: 0, semester: 'Fall 2025' });
    expect(result).toContain('Credits must be a positive number.');
  });
  test('negative credits returns error', () => {
    const result = validateCourse({ name: 'Math', code: 'MT101', credits: -1, semester: 'Fall 2025' });
    expect(result).toContain('Credits must be a positive number.');
  });
  test('missing semester returns error', () => {
    const result = validateCourse({ name: 'Math', code: 'MT101', credits: 3, semester: '' });
    expect(result).toContain('Semester is required (e.g. Fall 2025).');
  });
  test('multiple invalid fields returns multiple errors', () => {
    const result = validateCourse({ name: '', code: '', credits: -1, semester: '' });
    expect(result.length).toBeGreaterThan(1);
  });
});