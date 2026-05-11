# 🎓 GradeVault — Student Grade & Course Tracker

A full-stack web application for tracking university courses, assignments, and GPA.
Built for the System Analysis and Design course — Spring 2026.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JavaScript (SPA) |
| Backend | Node.js + Express |
| Database | SQLite (sql.js) |
| API Docs | Swagger / OpenAPI 3.0 |
| Testing | Jest |

## Features

- Full CRUD for Courses and Assignments
- Weighted grade average per course
- GPA calculation (Turkish system: AA–FF / 4.0 scale)
- Search & filter courses by name, code, instructor
- Filter GPA by semester
- Interactive Swagger documentation
- Input validation on both frontend and backend
- Modular architecture (business logic separated from routes)

## Project Structure

gradeVault/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js
│   │   ├── services/
│   │   │   ├── courseService.js
│   │   │   ├── assignmentService.js
│   │   │   └── gradeService.js
│   │   ├── routes/
│   │   │   ├── courseRoutes.js
│   │   │   ├── assignmentRoutes.js
│   │   │   └── gradeRoutes.js
│   │   └── swagger.js
│   ├── tests/
│   │   ├── courseService.test.js
│   │   ├── assignmentService.test.js
│   │   └── gradeService.test.js
│   ├── app.js
│   └── package.json
└── frontend/
├── index.html
├── style.css
└── app.js

## Setup & Installation

### Prerequisites
- Node.js v18 or higher
- npm

### Steps

1. Clone the repository:
```bash
git clone https://github.com/ismailtatli/gradeVault.git
cd gradeVault
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Start the server:
```bash
npm start
```

Server runs at: `http://localhost:3000`

4. Open the frontend:

Open `frontend/index.html` with Live Server in VS Code.

## Running Tests

```bash
cd backend
npm test
```

All 24 tests should pass.

## API Documentation

Interactive Swagger UI:
http://localhost:3000/api-docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | List all courses |
| GET | /api/courses?search=x | Search courses |
| GET | /api/courses/:id | Get a course |
| POST | /api/courses | Create a course |
| PUT | /api/courses/:id | Update a course |
| DELETE | /api/courses/:id | Delete a course |
| GET | /api/courses/:id/assignments | List assignments |
| GET | /api/courses/:id/assignments/:aid | Get an assignment |
| POST | /api/courses/:id/assignments | Create assignment |
| PUT | /api/courses/:id/assignments/:aid | Update assignment |
| DELETE | /api/courses/:id/assignments/:aid | Delete assignment |
| GET | /api/grades/gpa | Get overall GPA |
| GET | /api/grades/gpa?semester=x | GPA by semester |
| GET | /api/grades/course/:id | Course grade summary |