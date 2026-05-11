const { getDb } = require('../db/database');
const { getCourseById } = require('./courseService');

function validateAssignment(data) {
  const errors = [];
  if (!data.title || data.title.trim().length < 2)
    errors.push('Title must be at least 2 characters.');
  const validTypes = ['exam', 'assignment', 'quiz', 'project'];
  if (!data.type || !validTypes.includes(data.type))
    errors.push('Type must be one of: exam, assignment, quiz, project.');
  if (!data.weight || isNaN(data.weight) || Number(data.weight) <= 0 || Number(data.weight) > 100)
    errors.push('Weight must be between 0 and 100.');
  if (data.grade !== undefined && data.grade !== null && data.grade !== '') {
    if (isNaN(data.grade) || Number(data.grade) < 0 || Number(data.grade) > 100)
      errors.push('Grade must be between 0 and 100.');
  }
  return errors;
}

function getAssignmentsByCourse(courseId) {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM assignments WHERE course_id = ? ORDER BY created_at DESC'
  ).all(courseId);
}

function getAssignmentById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM assignments WHERE id = ?').get(id);
}

function createAssignment(courseId, data) {
  const course = getCourseById(courseId);
  if (!course) return { success: false, errors: ['Course not found.'] };
  const errors = validateAssignment(data);
  if (errors.length > 0) return { success: false, errors };
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO assignments (course_id, title, type, weight, grade, due_date, notes)
    VALUES (@courseId, @title, @type, @weight, @grade, @due_date, @notes)
  `).run({
    courseId: Number(courseId),
    title: data.title.trim(),
    type: data.type,
    weight: Number(data.weight),
    grade: data.grade !== undefined && data.grade !== '' ? Number(data.grade) : null,
    due_date: data.due_date || null,
    notes: data.notes ? data.notes.trim() : null
  });
  return { success: true, id: result.lastInsertRowid };
}

function updateAssignment(id, data) {
  const existing = getAssignmentById(id);
  if (!existing) return { success: false, errors: ['Assignment not found.'] };
  const errors = validateAssignment(data);
  if (errors.length > 0) return { success: false, errors };
  const db = getDb();
  db.prepare(`
    UPDATE assignments SET title=@title, type=@type, weight=@weight,
    grade=@grade, due_date=@due_date, notes=@notes, updated_at=CURRENT_TIMESTAMP
    WHERE id=@id
  `).run({
    id,
    title: data.title.trim(),
    type: data.type,
    weight: Number(data.weight),
    grade: data.grade !== undefined && data.grade !== '' ? Number(data.grade) : null,
    due_date: data.due_date || null,
    notes: data.notes ? data.notes.trim() : null
  });
  return { success: true };
}

function deleteAssignment(id) {
  const existing = getAssignmentById(id);
  if (!existing) return { success: false, errors: ['Assignment not found.'] };
  const db = getDb();
  db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
  return { success: true };
}

module.exports = {
  getAssignmentsByCourse, getAssignmentById,
  createAssignment, updateAssignment,
  deleteAssignment, validateAssignment
};