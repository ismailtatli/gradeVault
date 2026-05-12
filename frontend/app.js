const API = 'http://localhost:3000/api';

let currentView = 'dashboard';
let currentCourseId = null;
let currentUser = null;

const letterPoints = {
  AA: 4.0,
  BA: 3.5,
  BB: 3.0,
  CB: 2.5,
  CC: 2.0,
  DC: 1.5,
  DD: 1.0,
  FD: 0.5,
  FF: 0.0
};

const academicRecord = [
  {
    semester: '1st Year Fall',
    period: '2023-2024 Fall',
    courses: [
      { code: 'CENL160', name: 'Introduction to Computer Eng.', type: 'Z', credit: 3, ects: 3, letter: 'CC' },
      { code: 'CENL161', name: 'Algorithms and Programming-I', type: 'Z', credit: 3, ects: 6, letter: 'CC' },
      { code: 'MBBL002', name: 'Calculus-I', type: 'Z', credit: 5, ects: 7, letter: 'BB' },
      { code: 'MBBL018', name: 'Physics-I', type: 'Z', credit: 5, ects: 7, letter: 'CB' },
      { code: 'ORTL102', name: 'Introduction to Higher Education and Career Planning', type: 'Z', credit: 1, ects: 1, letter: 'S' },
      { code: 'ORTL172', name: 'Turkish Language-I', type: 'Z', credit: 2, ects: 2, letter: 'AA' },
      { code: 'YDLL323', name: 'Academic English-I', type: 'Z', credit: 4, ects: 4, letter: 'AA' }
    ]
  },
  {
    semester: '1st Year Spring',
    period: '2023-2024 Spring',
    courses: [
      { code: 'CENL162', name: 'Algorithms and Programming-II', type: 'Z', credit: 3, ects: 6, letter: 'DD' },
      { code: 'MBBL004', name: 'Calculus-II', type: 'Z', credit: 5, ects: 7, letter: 'CB' },
      { code: 'MBBL008', name: 'Linear Algebra and its Applications', type: 'Z', credit: 3, ects: 4, letter: 'BB' },
      { code: 'MBBL020', name: 'Physics-II', type: 'Z', credit: 5, ects: 7, letter: 'BB' },
      { code: 'ORTL272', name: 'Turkish Language-II', type: 'Z', credit: 2, ects: 2, letter: 'AA' },
      { code: 'YDLL324', name: 'Academic English-II', type: 'Z', credit: 4, ects: 4, letter: 'DD' }
    ]
  },
  {
    semester: '2nd Year Fall',
    period: '2024-2025 Fall',
    courses: [
      { code: 'CENL201', name: 'Data Structures', type: 'Z', credit: 3, ects: 4, letter: 'CB' },
      { code: 'LCEN203', name: 'Object Oriented Programming', type: 'Z', credit: 3, ects: 4, letter: 'BB' },
      { code: 'EENL206', name: 'Electronics I', type: 'Z', credit: 3, ects: 4, letter: 'BA' },
      { code: 'MBBL014', name: 'Discrete Mathematics', type: 'Z', credit: 3, ects: 4, letter: 'CB' },
      { code: 'MBBL016', name: 'Differential Equations', type: 'Z', credit: 3, ects: 6, letter: 'BA' },
      { code: 'MBBL209', name: 'Probability and Statistics', type: 'Z', credit: 3, ects: 6, letter: 'BB' },
      { code: 'ORTL162', name: 'Principles of Atatürk and History of Reforms-I', type: 'Z', credit: 2, ects: 2, letter: 'BA' }
    ]
  },
  {
    semester: '2nd Year Spring',
    period: '2024-2025 Spring',
    courses: [
      { code: 'BMML220', name: 'General Biology', type: 'Z', credit: 3, ects: 4, letter: 'CC' },
      { code: 'CENL210', name: 'Software Engineering', type: 'Z', credit: 3, ects: 3, letter: 'AA' },
      { code: 'CENL260', name: 'Computer Organization', type: 'Z', credit: 3, ects: 4, letter: 'AA' },
      { code: 'EENL202', name: 'Introduction to Digital Design and Lab.', type: 'Z', credit: 4, ects: 5, letter: 'DC' },
      { code: 'EENL210', name: 'Signals and Systems', type: 'Z', credit: 3, ects: 4, letter: 'CC' },
      { code: 'MBBL010', name: 'Numerical Analysis and Its Applications', type: 'Z', credit: 3, ects: 5, letter: 'AA' },
      { code: 'MBBL221', name: 'Quantum Physics', type: 'Z', credit: 3, ects: 3, letter: 'BB' },
      { code: 'ORTL262', name: 'Principles of Atatürk and History of Reforms-II', type: 'Z', credit: 2, ects: 2, letter: 'BB' }
    ]
  },
  {
    semester: '3rd Year Fall',
    period: '2025-2026 Fall',
    courses: [
      { code: 'LCEN301', name: 'Data Communications and Computer Networks', type: 'Z', credit: 3, ects: 5, letter: 'CC' },
      { code: 'LCEN303', name: 'Database Management Systems', type: 'Z', credit: 3, ects: 5, letter: 'DC' },
      { code: 'LCEN361', name: 'Operating Systems', type: 'Z', credit: 3, ects: 5, letter: 'AA' },
      { code: 'LEEN311', name: 'Microprocessors and Lab.', type: 'Z', credit: 3, ects: 5, letter: 'CC' },
      { code: 'LCEN370', name: 'Applied Data Science', type: 'S', credit: 2, ects: 5, letter: 'CC' },
      { code: 'LEEN364', name: 'Deep Learning and Classification Techniques', type: 'S', credit: 2, ects: 5, letter: 'DD' }
    ]
  },
  {
    semester: '3rd Year Spring',
    period: '2025-2026 Spring',
    courses: [
      { code: 'LCEN353', name: 'Software Requirement Analysis', type: 'S', credit: 2, ects: 5, letter: '--' },
      { code: 'LCEN362', name: 'Web Programming', type: 'Z', credit: 3, ects: 5, letter: '--' },
      { code: 'LCEN376', name: 'System Analysis and Design', type: 'Z', credit: 3, ects: 5, letter: '--' },
      { code: 'LCEN355', name: 'Computer Graphics', type: 'S', credit: 2, ects: 5, letter: '--' },
      { code: 'LEEN350', name: 'Image Processing and Lab.', type: 'S', credit: 2, ects: 5, letter: '--' },
      { code: 'LEEN354', name: 'Communications Theory-II', type: 'S', credit: 2, ects: 5, letter: '--' }
    ]
  },
  {
    semester: '4th Year Fall',
    period: '2026-2027 Fall',
    courses: [
      { code: 'LCEN467', name: 'Data Mining', type: 'Z', credit: 3, ects: 5, letter: '--' },
      { code: 'LMMF400', name: 'Interdisciplinary Project', type: 'Z', credit: 2, ects: 4, letter: '--' },
      { code: 'LYET401', name: '21st Century Skills', type: 'Z', credit: 2, ects: 3, letter: '--' },
      { code: 'LCEN470', name: 'Cloud Computing', type: 'S', credit: 2, ects: 5, letter: '--' },
      { code: 'UNISEC1', name: 'Entrepreneurship and Innovation', type: 'S', credit: 2, ects: 3, letter: '--' }
    ]
  },
  {
    semester: '4th Year Spring',
    period: '2026-2027 Spring',
    courses: [
      { code: 'LCEN400', name: 'Professional Training', type: 'Z', credit: 0, ects: 9, letter: '--' },
      { code: 'LCEN462', name: 'Graduation Project', type: 'Z', credit: 1, ects: 8, letter: '--' },
      { code: 'LCEN472', name: 'Software Project Management', type: 'S', credit: 2, ects: 5, letter: '--' },
      { code: 'UNISEC2', name: 'Business Communication', type: 'S', credit: 2, ects: 3, letter: '--' }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initializeAuthScreen();

  document.getElementById('modal-close').addEventListener('click', closeModal);

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) {
      closeModal();
    }
  });
});

function initializeAuthScreen() {
  const savedUser = localStorage.getItem('gradevaultUser');

  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showPortal();
    return;
  }

  showAuthScreen();

  document.getElementById('login-tab').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('register-tab').addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function switchAuthTab(type) {
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errors = document.getElementById('auth-errors');

  errors.style.display = 'none';

  if (type === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function showAuthError(errors) {
  const errorDiv = document.getElementById('auth-errors');
  errorDiv.textContent = Array.isArray(errors) ? errors.join(', ') : errors;
  errorDiv.style.display = 'block';
}

async function handleLogin(e) {
  e.preventDefault();

  const data = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  };

  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!res.success) {
    showAuthError(res.errors || 'Login failed.');
    return;
  }

  currentUser = res.data;
  localStorage.setItem('gradevaultUser', JSON.stringify(currentUser));

  showPortal();
  showToast('Welcome to GradeVault!');
}

async function handleRegister(e) {
  e.preventDefault();

  const data = {
    fullName: document.getElementById('register-fullname').value,
    studentNumber: document.getElementById('register-student-number').value,
    department: document.getElementById('register-department').value,
    university: document.getElementById('register-university').value,
    classYear: document.getElementById('register-class-year').value,
    advisor: document.getElementById('register-advisor').value,
    email: document.getElementById('register-email').value,
    password: document.getElementById('register-password').value
  };

  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!res.success) {
    showAuthError(res.errors || 'Registration failed.');
    return;
  }

  currentUser = res.data;
  localStorage.setItem('gradevaultUser', JSON.stringify(currentUser));

  showPortal();
  showToast('Student account created!');
}

function showAuthScreen() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('portal-screen').classList.add('hidden');
}

function showPortal() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('portal-screen').classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCourseId = null;
      renderView(btn.dataset.view);
    });
  });

  document.getElementById('logout-btn').addEventListener('click', logout);

  renderView('dashboard');
}

function logout() {
  localStorage.removeItem('gradevaultUser');
  currentUser = null;
  location.reload();
}

function renderView(view) {
  currentView = view;
  const app = document.getElementById('app');

  if (view === 'dashboard') renderDashboard(app);
  else if (view === 'courses') renderCourses(app);
  else if (view === 'course-detail') renderCourseDetail(app, currentCourseId);
  else if (view === 'schedule') renderSchedule(app);
  else if (view === 'grades') renderGradeReport(app);
  else if (view === 'semesterAverages') renderSemesterAverages(app);
  else if (view === 'transcript') renderTranscript(app);
  else if (view === 'attendance') renderAttendance(app);
  else if (view === 'exams') renderExamCalendar(app);
  else if (view === 'gpa') renderGPA(app);
  else if (view === 'profile') renderProfile(app);
}

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  return res.json();
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  setTimeout(() => t.classList.add('hidden'), 3000);
}

function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function getAcademicStatus(average) {
  if (average === null || average === undefined) return 'No Grade';
  if (average < 50) return 'At Risk';
  if (average < 65) return 'Conditional Pass';
  return 'Successful';
}

function getStatusClass(status) {
  if (status === 'At Risk') return 'fail';
  if (status === 'Conditional Pass') return 'conditional';
  if (status === 'Successful') return 'pass';
  if (status === 'Warning') return 'conditional';
  if (status === 'Regular') return 'pass';
  return 'neutral';
}

function getAllAcademicCourses() {
  return academicRecord.flatMap(section =>
    section.courses.map(course => ({
      ...course,
      semester: section.semester,
      period: section.period
    }))
  );
}

function calculateSemesterSummary(section) {
  const graded = section.courses.filter(c => letterPoints[c.letter] !== undefined);
  const allCredits = section.courses.reduce((sum, c) => sum + c.credit, 0);
  const credits = graded.reduce((sum, c) => sum + c.credit, 0);
  const ects = section.courses.reduce((sum, c) => sum + c.ects, 0);
  const weighted = graded.reduce((sum, c) => sum + letterPoints[c.letter] * c.credit, 0);
  const gpa = credits > 0 ? Math.round((weighted / credits) * 100) / 100 : null;

  return {
    courseCount: section.courses.length,
    allCredits,
    credits,
    ects,
    gpa,
    successful: graded.filter(c => ['AA', 'BA', 'BB', 'CB', 'CC'].includes(c.letter)).length,
    conditional: graded.filter(c => ['DC', 'DD'].includes(c.letter)).length,
    atRisk: graded.filter(c => ['FD', 'FF'].includes(c.letter)).length
  };
}

function calculateCumulativeSummary() {
  const allCourses = getAllAcademicCourses();
  const graded = allCourses.filter(c => letterPoints[c.letter] !== undefined);
  const credits = graded.reduce((sum, c) => sum + c.credit, 0);
  const ects = allCourses.reduce((sum, c) => sum + c.ects, 0);
  const weighted = graded.reduce((sum, c) => sum + letterPoints[c.letter] * c.credit, 0);
  const gpa = credits > 0 ? Math.round((weighted / credits) * 100) / 100 : null;

  return {
    credits,
    ects,
    gpa,
    courseCount: allCourses.length,
    gradedCourseCount: graded.length
  };
}

function renderDashboard(app) {
  const summary = calculateCumulativeSummary();
  const currentSemester = academicRecord.find(s => s.semester === '3rd Year Spring');
  const currentCourses = currentSemester.courses;

  app.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Active Courses</div>
        <div class="stat-value">${currentCourses.length}</div>
        <div class="stat-sub">2025-2026 Spring</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Cumulative GPA</div>
        <div class="stat-value">${summary.gpa.toFixed(2)}</div>
        <div class="stat-sub">Calculated from completed courses</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Completed Credits</div>
        <div class="stat-value">${summary.credits}</div>
        <div class="stat-sub">Transcript credit total</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Academic Standing</div>
        <div class="stat-value" style="font-size:1.35rem">Good Standing</div>
        <div class="stat-sub">No failed active course</div>
      </div>
    </div>

    <div class="page-header">
      <h2 class="page-title">Current Semester Courses</h2>
    </div>

    <div class="course-grid">
      ${currentCourses.map(course => `
        <div class="course-card">
          <div class="course-card-header">
            <div>
              <span class="course-code">${course.code}</span>
              <div class="course-name" style="margin-top:0.5rem">${course.name}</div>
              <div class="course-meta">2025-2026 Spring · ${course.ects} ECTS</div>
            </div>
            <div class="grade-badge">${course.letter}</div>
          </div>
          <div class="status-badge neutral">In Progress</div>
          <div class="course-footer">
            <span>${course.credit} credits</span>
            <span>${course.type === 'Z' ? 'Required' : 'Elective'}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function renderCourses(app) {
  const courses = getAllAcademicCourses();

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Curriculum Courses</h2>
      <button class="btn btn-primary" id="add-course-btn">+ Add Custom Course</button>
    </div>

    <div class="search-bar">
      <input class="search-input" id="course-search" type="text" placeholder="Search by course code or name..." />
    </div>

    <div class="course-grid" id="course-list">
      ${courses.map(c => courseCardHTML({
        id: c.code,
        code: c.code,
        name: c.name,
        instructor: c.type === 'Z' ? 'Required Course' : 'Elective Course',
        semester: c.period,
        credits: c.credit,
        average: null,
        letterGrade: c.letter
      })).join('')}
    </div>
  `;

  document.getElementById('add-course-btn').addEventListener('click', () => openCourseForm());

  document.getElementById('course-search').addEventListener('input', e => {
    const keyword = e.target.value.toLowerCase();

    const filtered = courses.filter(c =>
      c.code.toLowerCase().includes(keyword) ||
      c.name.toLowerCase().includes(keyword)
    );

    document.getElementById('course-list').innerHTML = filtered.map(c => courseCardHTML({
      id: c.code,
      code: c.code,
      name: c.name,
      instructor: c.type === 'Z' ? 'Required Course' : 'Elective Course',
      semester: c.period,
      credits: c.credit,
      average: null,
      letterGrade: c.letter
    })).join('');
  });
}

function courseCardHTML(c) {
  return `
    <div class="course-card" data-id="${c.id}">
      <div class="course-card-header">
        <div>
          <span class="course-code">${c.code}</span>
          <div class="course-name" style="margin-top:0.5rem">${c.name}</div>
          <div class="course-meta">${c.instructor || 'Academic Staff'} · ${c.semester}</div>
        </div>

        <div class="grade-badge">${c.letterGrade || '—'}</div>
      </div>

      <div class="status-badge ${c.letterGrade === '--' ? 'neutral' : 'pass'}" style="margin-top:0.75rem">
        ${c.letterGrade === '--' ? 'In Progress' : 'Completed'}
      </div>

      <div class="course-footer">
        <span style="font-size:0.8rem;color:var(--text-muted)">${c.credits} credits</span>
      </div>
    </div>
  `;
}

function bindCourseCardEvents() {}

function openCourseForm(id = null) {
  const isEdit = id !== null;

  openModal(isEdit ? 'Edit Course' : 'Add New Course', `
    <div id="form-errors" class="form-errors" style="display:none"></div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Course Name *</label>
        <input class="form-control" id="f-name" placeholder="e.g. Data Structures" />
      </div>

      <div class="form-group">
        <label class="form-label">Course Code *</label>
        <input class="form-control" id="f-code" placeholder="e.g. CENL201" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Credits *</label>
        <input class="form-control" id="f-credits" type="number" min="0" placeholder="3" />
      </div>

      <div class="form-group">
        <label class="form-label">Semester *</label>
        <input class="form-control" id="f-semester" placeholder="e.g. Spring 2026" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Instructor</label>
      <input class="form-control" id="f-instructor" placeholder="e.g. Dr. Smith" />
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" id="form-cancel">Cancel</button>
      <button class="btn btn-primary" id="form-submit">Save Course</button>
    </div>
  `);

  document.getElementById('form-cancel').addEventListener('click', closeModal);

  document.getElementById('form-submit').addEventListener('click', () => {
    closeModal();
    showToast('Demo course form saved locally.');
  });
}

function deleteCourse() {}

function renderCourseDetail(app) {
  app.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📚</div>
      <p>Course details are available in the transcript and grade report modules.</p>
    </div>
  `;
}

function renderAssignmentRows() {}
function openAssignmentForm() {}
function deleteAssignment() {}

function renderSchedule(app) {
  const currentCourses = academicRecord.find(section => section.semester === '3rd Year Spring').courses;

  const schedule = [
    ['Monday', '09:00 - 10:50', currentCourses[0], 'C-204'],
    ['Monday', '13:00 - 14:50', currentCourses[1], 'Lab-2'],
    ['Tuesday', '10:00 - 11:50', currentCourses[2], 'B-305'],
    ['Wednesday', '09:00 - 10:50', currentCourses[3], 'Design Studio'],
    ['Thursday', '14:00 - 15:50', currentCourses[4], 'Lab-4'],
    ['Friday', '11:00 - 12:50', currentCourses[5], 'A-108']
  ];

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Weekly Course Schedule</h2>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Room</th>
              <th>Instructor</th>
            </tr>
          </thead>

          <tbody>
            ${schedule.map(([day, time, course, room]) => `
              <tr>
                <td><strong>${day}</strong></td>
                <td>${time}</td>
                <td><span class="course-code">${course.code}</span></td>
                <td>${course.name}</td>
                <td>${room}</td>
                <td>Academic Staff</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderGradeReport(app) {
  const summary = calculateCumulativeSummary();

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Grade Report</h2>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Cumulative GPA</div>
        <div class="stat-value">${summary.gpa.toFixed(2)}</div>
        <div class="stat-sub">Calculated from completed courses</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Completed Credits</div>
        <div class="stat-value">${summary.credits}</div>
        <div class="stat-sub">Transcript credits</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total ECTS</div>
        <div class="stat-value">${summary.ects}</div>
        <div class="stat-sub">Curriculum ECTS</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Course Count</div>
        <div class="stat-value">${summary.courseCount}</div>
        <div class="stat-sub">All academic records</div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Code</th>
              <th>Course</th>
              <th>Z/S</th>
              <th>Credit</th>
              <th>ECTS</th>
              <th>Letter</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${getAllAcademicCourses().map(course => {
              const status = course.letter === '--' ? 'In Progress' : ['DC', 'DD'].includes(course.letter) ? 'Conditional' : 'Completed';
              const statusClass = course.letter === '--' ? 'neutral' : ['DC', 'DD'].includes(course.letter) ? 'conditional' : 'pass';

              return `
                <tr>
                  <td>${course.period}</td>
                  <td><span class="course-code">${course.code}</span></td>
                  <td><strong>${course.name}</strong></td>
                  <td>${course.type}</td>
                  <td>${course.credit}</td>
                  <td>${course.ects}</td>
                  <td><strong>${course.letter}</strong></td>
                  <td><span class="status-badge ${statusClass}">${status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSemesterAverages(app) {
  const cumulative = calculateCumulativeSummary();

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Semester Averages</h2>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Cumulative GPA</div>
        <div class="stat-value">${cumulative.gpa.toFixed(2)}</div>
        <div class="stat-sub">General academic average</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Completed Credits</div>
        <div class="stat-value">${cumulative.credits}</div>
        <div class="stat-sub">Successfully calculated credits</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total ECTS</div>
        <div class="stat-value">${cumulative.ects}</div>
        <div class="stat-sub">Curriculum progress</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Academic Status</div>
        <div class="stat-value" style="font-size:1.35rem">Good Standing</div>
        <div class="stat-sub">Based on semester records</div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Period</th>
              <th>Courses</th>
              <th>Credits</th>
              <th>ECTS</th>
              <th>Semester GPA</th>
              <th>Successful</th>
              <th>Conditional</th>
              <th>Risk</th>
            </tr>
          </thead>

          <tbody>
            ${academicRecord.map(section => {
              const s = calculateSemesterSummary(section);

              return `
                <tr>
                  <td><strong>${section.semester}</strong></td>
                  <td>${section.period}</td>
                  <td>${s.courseCount}</td>
                  <td>${s.credits}</td>
                  <td>${s.ects}</td>
                  <td><strong>${s.gpa != null ? s.gpa.toFixed(2) : 'In Progress'}</strong></td>
                  <td>${s.successful}</td>
                  <td>${s.conditional}</td>
                  <td>${s.atRisk}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTranscript(app) {
  const cumulative = calculateCumulativeSummary();

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Academic Transcript</h2>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Cumulative GPA</div>
        <div class="stat-value">${cumulative.gpa.toFixed(2)}</div>
        <div class="stat-sub">Overall transcript GPA</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Completed Credits</div>
        <div class="stat-value">${cumulative.credits}</div>
        <div class="stat-sub">Completed course credits</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total ECTS</div>
        <div class="stat-value">${cumulative.ects}</div>
        <div class="stat-sub">All listed curriculum ECTS</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Transcript Status</div>
        <div class="stat-value" style="font-size:1.35rem">Active Student</div>
        <div class="stat-sub">Current academic record</div>
      </div>
    </div>

    ${academicRecord.map(section => {
      const s = calculateSemesterSummary(section);

      return `
        <div class="card transcript-semester-card">
          <div class="semester-header">
            <div>
              <h3>${section.semester}</h3>
              <p>${section.period} · ${s.courseCount} courses · ${s.ects} ECTS</p>
            </div>

            <div class="semester-gpa">
              <span>Semester GPA</span>
              <strong>${s.gpa != null ? s.gpa.toFixed(2) : 'In Progress'}</strong>
            </div>
          </div>

          <div class="table-wrapper" style="margin-top:1rem">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Z/S</th>
                  <th>Credit</th>
                  <th>ECTS</th>
                  <th>Letter</th>
                </tr>
              </thead>

              <tbody>
                ${section.courses.map(course => `
                  <tr>
                    <td><span class="course-code">${course.code}</span></td>
                    <td><strong>${course.name}</strong></td>
                    <td>${course.type}</td>
                    <td>${course.credit}</td>
                    <td>${course.ects}</td>
                    <td><strong>${course.letter}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function renderAttendance(app) {
  const currentCourses = academicRecord.find(section => section.semester === '3rd Year Spring').courses;

  const attendance = currentCourses.map((course, index) => {
    const total = 42;
    const absent = [2, 0, 4, 1, 3, 0][index] || 0;
    const rate = Math.round((absent / total) * 100);

    return {
      ...course,
      total,
      absent,
      rate,
      status: rate >= 20 ? 'Risk' : rate >= 10 ? 'Warning' : 'Regular'
    };
  });

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Attendance Status</h2>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Total Hours</th>
              <th>Absent Hours</th>
              <th>Absence Rate</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${attendance.map(item => {
              const cls = getStatusClass(item.status);

              return `
                <tr>
                  <td><span class="course-code">${item.code}</span></td>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.total}</td>
                  <td>${item.absent}</td>
                  <td>${item.rate}%</td>
                  <td><span class="status-badge ${cls}">${item.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderExamCalendar(app) {
  const exams = [
    ['2026-05-18', '10:00', 'LCEN353', 'Software Requirement Analysis', 'Midterm', 'B-203'],
    ['2026-05-20', '13:00', 'LCEN362', 'Web Programming', 'Project Demo', 'Lab-2'],
    ['2026-05-22', '11:00', 'LCEN376', 'System Analysis and Design', 'READ Presentation', 'B-305'],
    ['2026-05-27', '09:00', 'LCEN355', 'Computer Graphics', 'Final Project', 'Design Studio'],
    ['2026-06-02', '14:00', 'LEEN350', 'Image Processing and Lab.', 'Lab Exam', 'Lab-4']
  ];

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Exam Calendar</h2>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Assessment</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            ${exams.map(exam => `
              <tr>
                <td><strong>${exam[0]}</strong></td>
                <td>${exam[1]}</td>
                <td><span class="course-code">${exam[2]}</span></td>
                <td>${exam[3]}</td>
                <td>${exam[4]}</td>
                <td>${exam[5]}</td>
                <td><span class="status-badge conditional">Scheduled</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderGPA(app) {
  renderSemesterAverages(app);
}