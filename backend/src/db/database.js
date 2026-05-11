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

  seedDefaultStudent();
  saveDb();
}

function seedDefaultStudent() {
  const checkStmt = db.prepare('SELECT COUNT(*) AS count FROM students');
  checkStmt.step();
  const result = checkStmt.getAsObject();
  checkStmt.free();

  if (result.count > 0) return;

  db.run(`
    INSERT INTO students (
      full_name,
      student_number,
      department,
      university,
      class_year,
      advisor,
      email
    ) VALUES (
      'Ismail Tatlı',
      '202600001',
      'Computer Engineering',
      'Istanbul Arel University',
      '3rd Year',
      'Academic Advisor',
      'ismailtatli99@gmail.com'
    );
  `);

  db.run(`
    INSERT INTO users (
      student_id,
      email,
      password,
      role
    ) VALUES (
      1,
      'ismailtatli99@gmail.com',
      '123456',
      'student'
    );
  `);
}

module.exports = { getDb, saveDb };