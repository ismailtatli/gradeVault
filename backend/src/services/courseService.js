const { getDb, saveDb } = require('../db/database');

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

async function getAllCourses(search = '') {
  const db = await getDb();
  let rows;
  if (search) {
    const stmt = db.prepare(`
      SELECT * FROM courses
      WHERE name LIKE $search OR code LIKE $search OR instructor LIKE $search
      ORDER BY id DESC
    `);
    rows = [];
    const s = `%${search}%`;
    stmt.bind({ $search: s });
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
  } else {
    const stmt = db.prepare('SELECT * FROM courses ORDER BY id DESC');
    rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
  }
  return rows;
}

async function getCourseById(id) {
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM courses WHERE id = $id');
  stmt.bind({ $id: id });
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

async function createCourse(data) {
  const errors = validateCourse(data);
  if (errors.length > 0) return { success: false, errors };
  const db = await getDb();
  try {
    db.run(
      `INSERT INTO courses (name, code, credits, semester, instructor)
       VALUES ($name, $code, $credits, $semester, $instructor)`,
      {
        $name: data.name.trim(),
        $code: data.code.trim().toUpperCase(),
        $credits: Number(data.credits),
        $semester: data.semester.trim(),
        $instructor: data.instructor ? data.instructor.trim() : null
      }
    );
    const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    saveDb();
    return { success: true, id };
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return { success: false, errors: ['Course code already exists.'] };
    }
    throw err;
  }
}

async function updateCourse(id, data) {
  const existing = await getCourseById(id);
  if (!existing) return { success: false, errors: ['Course not found.'] };
  const errors = validateCourse(data);
  if (errors.length > 0) return { success: false, errors };
  const db = await getDb();
  try {
    db.run(
      `UPDATE courses SET name=$name, code=$code, credits=$credits,
       semester=$semester, instructor=$instructor, updated_at=CURRENT_TIMESTAMP
       WHERE id=$id`,
      {
        $id: id,
        $name: data.name.trim(),
        $code: data.code.trim().toUpperCase(),
        $credits: Number(data.credits),
        $semester: data.semester.trim(),
        $instructor: data.instructor ? data.instructor.trim() : null
      }
    );
    saveDb();
    return { success: true };
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return { success: false, errors: ['Course code already exists.'] };
    }
    throw err;
  }
}

async function deleteCourse(id) {
  const existing = await getCourseById(id);
  if (!existing) return { success: false, errors: ['Course not found.'] };
  const db = await getDb();
  db.run('DELETE FROM courses WHERE id = $id', { $id: id });
  db.run('DELETE FROM assignments WHERE course_id = $id', { $id: id });
  saveDb();
  return { success: true };
}

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, validateCourse };