const { getDb, saveDb } = require('../db/database');
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

async function getAssignmentsByCourse(courseId) {
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM assignments WHERE course_id = $id ORDER BY id DESC');
  stmt.bind({ $id: courseId });
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

async function getAssignmentById(id) {
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM assignments WHERE id = $id');
  stmt.bind({ $id: id });
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

async function createAssignment(courseId, data) {
  const course = await getCourseById(courseId);
  if (!course) return { success: false, errors: ['Course not found.'] };
  const errors = validateAssignment(data);
  if (errors.length > 0) return { success: false, errors };
  const db = await getDb();
  db.run(
    `INSERT INTO assignments (course_id, title, type, weight, grade, due_date, notes)
     VALUES ($courseId, $title, $type, $weight, $grade, $due_date, $notes)`,
    {
      $courseId: Number(courseId),
      $title: data.title.trim(),
      $type: data.type,
      $weight: Number(data.weight),
      $grade: data.grade !== undefined && data.grade !== '' ? Number(data.grade) : null,
      $due_date: data.due_date || null,
      $notes: data.notes ? data.notes.trim() : null
    }
  );
  const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
  saveDb();
  return { success: true, id };
}

async function updateAssignment(id, data) {
  const existing = await getAssignmentById(id);
  if (!existing) return { success: false, errors: ['Assignment not found.'] };
  const errors = validateAssignment(data);
  if (errors.length > 0) return { success: false, errors };
  const db = await getDb();
  db.run(
    `UPDATE assignments SET title=$title, type=$type, weight=$weight,
     grade=$grade, due_date=$due_date, notes=$notes, updated_at=CURRENT_TIMESTAMP
     WHERE id=$id`,
    {
      $id: id,
      $title: data.title.trim(),
      $type: data.type,
      $weight: Number(data.weight),
      $grade: data.grade !== undefined && data.grade !== '' ? Number(data.grade) : null,
      $due_date: data.due_date || null,
      $notes: data.notes ? data.notes.trim() : null
    }
  );
  saveDb();
  return { success: true };
}

async function deleteAssignment(id) {
  const existing = await getAssignmentById(id);
  if (!existing) return { success: false, errors: ['Assignment not found.'] };
  const db = await getDb();
  db.run('DELETE FROM assignments WHERE id = $id', { $id: id });
  saveDb();
  return { success: true };
}

module.exports = {
  getAssignmentsByCourse, getAssignmentById,
  createAssignment, updateAssignment,
  deleteAssignment, validateAssignment
};