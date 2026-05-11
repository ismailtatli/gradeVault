const { getDb, saveDb } = require('../db/database');

function validateRegisterInput(data) {
  const errors = [];

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.push('Full name must be at least 3 characters.');
  }

  if (!data.studentNumber || data.studentNumber.trim().length < 4) {
    errors.push('Student number is required.');
  }

  if (!data.department || data.department.trim().length < 2) {
    errors.push('Department is required.');
  }

  if (!data.university || data.university.trim().length < 2) {
    errors.push('University is required.');
  }

  if (!data.classYear || data.classYear.trim().length < 2) {
    errors.push('Class year is required.');
  }

  if (!data.email || !data.email.includes('@')) {
    errors.push('A valid email address is required.');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  return errors;
}

function validateLoginInput(data) {
  const errors = [];

  if (!data.email || !data.email.includes('@')) {
    errors.push('A valid email address is required.');
  }

  if (!data.password || data.password.length < 1) {
    errors.push('Password is required.');
  }

  return errors;
}

async function registerStudent(data) {
  const errors = validateRegisterInput(data);

  if (errors.length > 0) {
    return {
      success: false,
      errors
    };
  }

  const db = await getDb();

  const existingStmt = db.prepare(`
    SELECT id FROM users
    WHERE email = $email
  `);

  existingStmt.bind({
    $email: data.email.trim()
  });

  const exists = existingStmt.step();
  existingStmt.free();

  if (exists) {
    return {
      success: false,
      errors: ['This email is already registered.']
    };
  }

  const studentStmt = db.prepare(`
    INSERT INTO students (
      full_name,
      student_number,
      department,
      university,
      class_year,
      advisor,
      email
    ) VALUES (
      $fullName,
      $studentNumber,
      $department,
      $university,
      $classYear,
      $advisor,
      $email
    )
  `);

  studentStmt.run({
    $fullName: data.fullName.trim(),
    $studentNumber: data.studentNumber.trim(),
    $department: data.department.trim(),
    $university: data.university.trim(),
    $classYear: data.classYear.trim(),
    $advisor: data.advisor ? data.advisor.trim() : '',
    $email: data.email.trim()
  });

  studentStmt.free();

  const idStmt = db.prepare('SELECT last_insert_rowid() AS id');
  idStmt.step();
  const idResult = idStmt.getAsObject();
  idStmt.free();

  const userStmt = db.prepare(`
    INSERT INTO users (
      student_id,
      email,
      password,
      role
    ) VALUES (
      $studentId,
      $email,
      $password,
      'student'
    )
  `);

  userStmt.run({
    $studentId: idResult.id,
    $email: data.email.trim(),
    $password: data.password
  });

  userStmt.free();
  saveDb();

  return {
    success: true,
    data: {
      id: idResult.id,
      fullName: data.fullName.trim(),
      studentNumber: data.studentNumber.trim(),
      department: data.department.trim(),
      university: data.university.trim(),
      classYear: data.classYear.trim(),
      advisor: data.advisor ? data.advisor.trim() : '',
      email: data.email.trim()
    }
  };
}

async function loginStudent(data) {
  const errors = validateLoginInput(data);

  if (errors.length > 0) {
    return {
      success: false,
      errors
    };
  }

  const db = await getDb();

  const stmt = db.prepare(`
    SELECT
      users.id AS userId,
      users.role,
      students.id AS studentId,
      students.full_name AS fullName,
      students.student_number AS studentNumber,
      students.department,
      students.university,
      students.class_year AS classYear,
      students.advisor,
      students.email
    FROM users
    JOIN students ON users.student_id = students.id
    WHERE users.email = $email
      AND users.password = $password
  `);

  stmt.bind({
    $email: data.email.trim(),
    $password: data.password
  });

  let user = null;

  if (stmt.step()) {
    user = stmt.getAsObject();
  }

  stmt.free();

  if (!user) {
    return {
      success: false,
      errors: ['Invalid email or password.']
    };
  }

  return {
    success: true,
    data: user
  };
}

async function getDefaultProfile() {
  const db = await getDb();

  const stmt = db.prepare(`
    SELECT
      id,
      full_name AS fullName,
      student_number AS studentNumber,
      department,
      university,
      class_year AS classYear,
      advisor,
      email
    FROM students
    ORDER BY id ASC
    LIMIT 1
  `);

  let profile = null;

  if (stmt.step()) {
    profile = stmt.getAsObject();
  }

  stmt.free();

  return {
    success: true,
    data: profile
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  registerStudent,
  loginStudent,
  getDefaultProfile
};