const { getDb } = require('../db/database');

function validateCourse(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2)
    errors.push('Course name must be at least 2 characters.');
  if (!data.code || data.code.trim().length < 2)
    errors.push('Course code is required.');
  if (!data.credits || isNaN(data.credits) || Number(data.credits) < 1)
    errors.push('Credits must be a positive number.');
  if (!data.semester || data.semester.trim().length < 2)
    errors.push('Semester is required (e.g. Fall 2025).');
  return errors;
}

function getAllCourses(search = '') {
  const db = getDb();
  if (search) {
    return db.prepare(`
      SELECT * FROM courses
      WHERE name LIKE ? OR code LIKE ? OR instructor LIKE ?
      ORDER BY created_at DESC
    `).all(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  return db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
}

function getCourseById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
}

function createCourse(data) {
  const errors = validateCourse(data);
  if (errors.length > 0) return { success: false, errors };
  const db = getDb();
  try {
    const result = db.prepare(`
      INSERT INTO courses (name, code, credits, semester, instructor)
      VALUES (@name, @code, @credits, @semester, @instructor)
    `).run({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      credits: Number(data.credits),
      semester: data.semester.trim(),
      instructor: data.instructor ? data.instructor.trim() : null
    });
    return { success: true, id: result.lastInsertRowid };
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return { success: false, errors: ['Course code already exists.'] };
    }
    throw err;
  }
}

function updateCourse(id, data) {
  const existing = getCourseById(id);
  if (!existing) return { success: false, errors: ['Course not found.'] };
  const errors = validateCourse(data);
  if (errors.length > 0) return { success: false, errors };
  const db = getDb();
  try {
    db.prepare(`
      UPDATE courses SET name=@name, code=@code, credits=@credits,
      semester=@semester, instructor=@instructor, updated_at=CURRENT_TIMESTAMP
      WHERE id=@id
    `).run({
      id,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      credits: Number(data.credits),
      semester: data.semester.trim(),
      instructor: data.instructor ? data.instructor.trim() : null
    });
    return { success: true };
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return { success: false, errors: ['Course code already exists.'] };
    }
    throw err;
  }
}

function deleteCourse(id) {
  const existing = getCourseById(id);
  if (!existing) return { success: false, errors: ['Course not found.'] };
  const db = getDb();
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  return { success: true };
}

module.exports = {
  getAllCourses, getCourseById,
  createCourse, updateCourse,
  deleteCourse, validateCourse
};