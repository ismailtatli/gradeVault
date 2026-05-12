const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../gradevault.db');

let db;

async function getDb() {
  if (!db) {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    initializeSchema();
  }

  return db;
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function initializeSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      student_number TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      university TEXT NOT NULL,
      class_year TEXT NOT NULL,
      advisor TEXT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      credits INTEGER NOT NULL,
      semester TEXT NOT NULL,
      instructor TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      weight REAL NOT NULL,
      grade REAL,
      due_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );
  `);

  seedDemoStudents();
  saveDb();
}

function seedDemoStudents() {
  const checkStmt = db.prepare('SELECT COUNT(*) AS count FROM students');
  checkStmt.step();
  const result = checkStmt.getAsObject();
  checkStmt.free();

  if (result.count > 0) return;

  const students = [
    {
      fullName: 'Ismail Tatlı',
      studentNumber: '202600001',
      department: 'Computer Engineering',
      university: 'Istanbul Arel University',
      classYear: '3rd Year',
      advisor: 'Academic Advisor',
      email: 'ismailtatli99@gmail.com',
      password: '123456'
    },
    {
      fullName: 'Ayşe Yılmaz',
      studentNumber: '202600002',
      department: 'Software Engineering',
      university: 'Istanbul Arel University',
      classYear: '2nd Year',
      advisor: 'Dr. Elif Demir',
      email: 'ayse.student@gradevault.edu',
      password: '123456'
    },
    {
      fullName: 'Mehmet Kaya',
      studentNumber: '202600003',
      department: 'Management Information Systems',
      university: 'Istanbul Arel University',
      classYear: '4th Year',
      advisor: 'Dr. Murat Aksoy',
      email: 'mehmet.student@gradevault.edu',
      password: '123456'
    }
  ];

  students.forEach(student => {
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
      $fullName: student.fullName,
      $studentNumber: student.studentNumber,
      $department: student.department,
      $university: student.university,
      $classYear: student.classYear,
      $advisor: student.advisor,
      $email: student.email
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
      $email: student.email,
      $password: student.password
    });

    userStmt.free();
  });
}

module.exports = { getDb, saveDb };