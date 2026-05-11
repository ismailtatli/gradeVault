const API = 'http://localhost:3000/api';

let currentView = 'dashboard';
let currentCourseId = null;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCourseId = null;
      renderView(btn.dataset.view);
    });
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  renderView('dashboard');
});

function renderView(view) {
  currentView = view;
  const app = document.getElementById('app');

  if (view === 'dashboard') renderDashboard(app);
  else if (view === 'courses') renderCourses(app);
  else if (view === 'course-detail') renderCourseDetail(app, currentCourseId);
  else if (view === 'gpa') renderGPA(app);
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
  return 'neutral';
}

async function renderDashboard(app) {
  app.innerHTML = `
    <div class="stats-grid" id="stats"></div>
    <div id="recent-courses"></div>
  `;

  const [coursesRes, gpaRes] = await Promise.all([
    apiFetch('/courses'),
    apiFetch('/grades/gpa')
  ]);

  const courses = coursesRes.data || [];
  const gpaData = gpaRes.data || {};
  const graded = gpaData.details ? gpaData.details.filter(d => d.average !== null) : [];

  const successfulCourses =
    gpaData.summary?.successfulCourses ??
    graded.filter(d => getAcademicStatus(d.average) === 'Successful').length;

  const conditionalCourses =
    gpaData.summary?.conditionalCourses ??
    graded.filter(d => getAcademicStatus(d.average) === 'Conditional Pass').length;

  const atRiskCourses =
    gpaData.summary?.atRiskCourses ??
    graded.filter(d => getAcademicStatus(d.average) === 'At Risk').length;

  document.getElementById('stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Courses</div>
      <div class="stat-value">${courses.length}</div>
      <div class="stat-sub">Registered courses</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Overall GPA</div>
      <div class="stat-value">${gpaData.gpa != null ? gpaData.gpa.toFixed(2) : '—'}</div>
      <div class="stat-sub">Out of 4.00</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Academic Risk</div>
      <div class="stat-value">${atRiskCourses}</div>
      <div class="stat-sub">Courses need attention</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Academic Standing</div>
      <div class="stat-value">${successfulCourses}</div>
      <div class="stat-sub">${conditionalCourses} conditional courses</div>
    </div>
  `;

  const recentDiv = document.getElementById('recent-courses');
  recentDiv.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">My Courses</h2>
    </div>
  `;

  if (courses.length === 0) {
    recentDiv.innerHTML += `
      <div class="empty-state">
        <div class="empty-state-icon">📚</div>
        <p>No courses yet. Go to Courses tab to add one.</p>
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'course-grid';
  grid.innerHTML = courses.map(c => courseCardHTML(c)).join('');
  recentDiv.appendChild(grid);

  bindCourseCardEvents(recentDiv);
}

async function renderCourses(app) {
  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">Courses</h2>
      <button class="btn btn-primary" id="add-course-btn">+ Add Course</button>
    </div>

    <div class="search-bar">
      <input class="search-input" id="course-search" type="text" placeholder="Search by name, code or instructor..." />
    </div>

    <div class="course-grid" id="course-list">Loading...</div>
  `;

  document.getElementById('add-course-btn').addEventListener('click', () => openCourseForm());
  document.getElementById('course-search').addEventListener('input', e => loadCourses(e.target.value));

  await loadCourses('');
}

async function loadCourses(search = '') {
  const res = await apiFetch(`/courses?search=${encodeURIComponent(search)}`);
  const list = document.getElementById('course-list');

  if (!list) return;

  const courses = res.data || [];

  if (courses.length === 0) {
    list.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">🔍</div>
        <p>No courses found.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = courses.map(c => courseCardHTML(c)).join('');
  bindCourseCardEvents(list);
}

function courseCardHTML(c) {
  const avg = c.average;
  const status = c.academicStatus || getAcademicStatus(avg);
  const statusClass = getStatusClass(status);

  let badgeClass = '';

  if (avg != null) {
    badgeClass = avg >= 50 ? 'pass' : 'fail';
  }

  return `
    <div class="course-card" data-id="${c.id}">
      <div class="course-card-header">
        <div>
          <span class="course-code">${c.code}</span>
          <div class="course-name" style="margin-top:0.5rem">${c.name}</div>
          <div class="course-meta">${c.instructor || 'No instructor'} · ${c.semester}</div>
        </div>

        <div class="grade-badge ${badgeClass}">
          ${avg != null ? c.letterGrade : '—'}
        </div>
      </div>

      ${
        avg != null
          ? `
            <div class="progress-bar">
              <div class="progress-fill" style="width:${avg}%"></div>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">
              ${avg.toFixed(1)} / 100
            </div>
            <div class="status-badge ${statusClass}" style="margin-top:0.75rem">
              ${status}
            </div>
          `
          : `
            <div style="font-size:0.8rem;color:var(--text-muted)">No grades yet</div>
            <div class="status-badge neutral" style="margin-top:0.75rem">No Grade</div>
          `
      }

      <div class="course-footer">
        <span style="font-size:0.8rem;color:var(--text-muted)">${c.credits} credits</span>

        <div style="display:flex;gap:0.4rem">
          <button class="btn btn-secondary btn-sm edit-course-btn" data-id="${c.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-course-btn" data-id="${c.id}">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function bindCourseCardEvents(container) {
  container.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.btn')) return;

      currentCourseId = Number(card.dataset.id);
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      renderView('course-detail');
    });
  });

  container.querySelectorAll('.edit-course-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openCourseForm(Number(btn.dataset.id));
    });
  });

  container.querySelectorAll('.delete-course-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteCourse(Number(btn.dataset.id));
    });
  });
}

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
        <input class="form-control" id="f-code" placeholder="e.g. CSE201" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Credits *</label>
        <input class="form-control" id="f-credits" type="number" min="1" placeholder="3" />
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
      <button class="btn btn-primary" id="form-submit">${isEdit ? 'Update Course' : 'Add Course'}</button>
    </div>
  `);

  document.getElementById('form-cancel').addEventListener('click', closeModal);

  if (isEdit) {
    apiFetch(`/courses/${id}`).then(res => {
      const c = res.data;

      document.getElementById('f-name').value = c.name;
      document.getElementById('f-code').value = c.code;
      document.getElementById('f-credits').value = c.credits;
      document.getElementById('f-semester').value = c.semester;
      document.getElementById('f-instructor').value = c.instructor || '';
    });
  }

  document.getElementById('form-submit').addEventListener('click', async () => {
    const data = {
      name: document.getElementById('f-name').value,
      code: document.getElementById('f-code').value,
      credits: document.getElementById('f-credits').value,
      semester: document.getElementById('f-semester').value,
      instructor: document.getElementById('f-instructor').value
    };

    const errDiv = document.getElementById('form-errors');

    const res = await apiFetch(isEdit ? `/courses/${id}` : '/courses', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(data)
    });

    if (!res.success) {
      errDiv.textContent = res.errors.join(', ');
      errDiv.style.display = 'block';
      return;
    }

    closeModal();
    showToast(isEdit ? 'Course updated!' : 'Course added!');
    loadCourses('');
  });
}

async function deleteCourse(id) {
  if (!confirm('Delete this course and all its assignments?')) return;

  const res = await apiFetch(`/courses/${id}`, {
    method: 'DELETE'
  });

  if (res.success) {
    showToast('Course deleted.', 'error');
    loadCourses('');
  }
}

async function renderCourseDetail(app, courseId) {
  app.innerHTML = `<p style="color:var(--text-muted);padding:2rem">Loading...</p>`;

  const [courseRes, assignRes] = await Promise.all([
    apiFetch(`/courses/${courseId}`),
    apiFetch(`/courses/${courseId}/assignments`)
  ]);

  const course = courseRes.data;
  const assignments = assignRes.data || [];

  const status = course.academicStatus || getAcademicStatus(course.average);
  const statusClass = getStatusClass(status);

  app.innerHTML = `
    <button class="back-btn" id="back-btn">← Back to Courses</button>

    <div class="page-header">
      <div>
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.25rem">
          <span class="course-code">${course.code}</span>
          <h2 class="page-title">${course.name}</h2>
        </div>

        <div style="font-size:0.9rem;color:var(--text-muted)">
          ${course.instructor || 'No instructor'} · ${course.semester} · ${course.credits} credits
        </div>
      </div>

      <button class="btn btn-primary" id="add-assignment-btn">+ Add Assignment</button>
    </div>

    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="stat-card">
        <div class="stat-label">Current Average</div>
        <div class="stat-value">${course.average != null ? course.average.toFixed(1) : '—'}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Letter Grade</div>
        <div class="stat-value">${course.letterGrade || '—'}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Academic Status</div>
        <div class="stat-value" style="font-size:1.35rem">${status}</div>
        <div class="status-badge ${statusClass}" style="margin-top:0.5rem">${status}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Assignments</div>
        <div class="stat-value">${assignments.length}</div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Grade</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody id="assignment-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === 'courses');
    });

    renderView('courses');
  });

  document.getElementById('add-assignment-btn').addEventListener('click', () => openAssignmentForm(courseId));

  renderAssignmentRows(assignments, courseId);
}

function renderAssignmentRows(assignments, courseId) {
  const tbody = document.getElementById('assignment-tbody');

  if (!tbody) return;

  if (assignments.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem">
          No assignments yet.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = assignments.map(a => `
    <tr>
      <td>
        <strong>${a.title}</strong>
        ${a.notes ? `<br><span style="font-size:0.75rem;color:var(--text-muted)">${a.notes}</span>` : ''}
      </td>

      <td><span class="badge badge-${a.type}">${a.type}</span></td>
      <td>${a.weight}%</td>
      <td>${a.grade != null ? `<strong>${a.grade}</strong>` : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td>${a.due_date || '—'}</td>

      <td style="display:flex;gap:0.4rem">
        <button class="btn btn-secondary btn-sm edit-a-btn" data-id="${a.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-a-btn" data-id="${a.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-a-btn').forEach(btn => {
    btn.addEventListener('click', () => openAssignmentForm(courseId, Number(btn.dataset.id)));
  });

  tbody.querySelectorAll('.delete-a-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteAssignment(courseId, Number(btn.dataset.id)));
  });
}

function openAssignmentForm(courseId, id = null) {
  const isEdit = id !== null;

  openModal(isEdit ? 'Edit Assignment' : 'Add Assignment', `
    <div id="form-errors" class="form-errors" style="display:none"></div>

    <div class="form-group">
      <label class="form-label">Title *</label>
      <input class="form-control" id="a-title" placeholder="e.g. Midterm Exam" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Type *</label>
        <select class="form-control" id="a-type">
          <option value="">Select type</option>
          <option value="exam">Exam</option>
          <option value="assignment">Assignment</option>
          <option value="quiz">Quiz</option>
          <option value="project">Project</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Weight (%) *</label>
        <input class="form-control" id="a-weight" type="number" min="1" max="100" placeholder="40" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Grade (0-100)</label>
        <input class="form-control" id="a-grade" type="number" min="0" max="100" placeholder="Leave empty if not graded" />
      </div>

      <div class="form-group">
        <label class="form-label">Due Date</label>
        <input class="form-control" id="a-due" type="date" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Notes</label>
      <input class="form-control" id="a-notes" placeholder="Optional notes" />
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary" id="form-cancel">Cancel</button>
      <button class="btn btn-primary" id="form-submit">${isEdit ? 'Update' : 'Add Assignment'}</button>
    </div>
  `);

  document.getElementById('form-cancel').addEventListener('click', closeModal);

  if (isEdit) {
    apiFetch(`/courses/${courseId}/assignments/${id}`).then(res => {
      const a = res.data;

      document.getElementById('a-title').value = a.title;
      document.getElementById('a-type').value = a.type;
      document.getElementById('a-weight').value = a.weight;
      document.getElementById('a-grade').value = a.grade != null ? a.grade : '';
      document.getElementById('a-due').value = a.due_date || '';
      document.getElementById('a-notes').value = a.notes || '';
    });
  }

  document.getElementById('form-submit').addEventListener('click', async () => {
    const data = {
      title: document.getElementById('a-title').value,
      type: document.getElementById('a-type').value,
      weight: document.getElementById('a-weight').value,
      grade: document.getElementById('a-grade').value,
      due_date: document.getElementById('a-due').value,
      notes: document.getElementById('a-notes').value
    };

    const errDiv = document.getElementById('form-errors');

    const endpoint = isEdit
      ? `/courses/${courseId}/assignments/${id}`
      : `/courses/${courseId}/assignments`;

    const res = await apiFetch(endpoint, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(data)
    });

    if (!res.success) {
      errDiv.textContent = res.errors.join(', ');
      errDiv.style.display = 'block';
      return;
    }

    closeModal();
    showToast(isEdit ? 'Assignment updated!' : 'Assignment added!');
    renderView('course-detail');
  });
}

async function deleteAssignment(courseId, id) {
  if (!confirm('Delete this assignment?')) return;

  const res = await apiFetch(`/courses/${courseId}/assignments/${id}`, {
    method: 'DELETE'
  });

  if (res.success) {
    showToast('Assignment deleted.', 'error');
    renderView('course-detail');
  }
}

async function renderGPA(app) {
  app.innerHTML = `<p style="color:var(--text-muted)">Loading...</p>`;

  const semesters = await getSemesters();

  app.innerHTML = `
    <div class="page-header">
      <h2 class="page-title">GPA Analytics</h2>
    </div>

    <div class="filter-row">
      <span class="filter-label">Filter by semester:</span>

      <select class="form-control" id="semester-filter" style="width:auto">
        <option value="">All Semesters</option>
        ${semesters.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>

    <div class="stats-grid" id="gpa-stats"></div>
    <div class="card" id="gpa-details" style="margin-top:1.5rem"></div>
  `;

  document.getElementById('semester-filter').addEventListener('change', e => loadGPA(e.target.value));

  await loadGPA('');
}

async function getSemesters() {
  const res = await apiFetch('/courses');
  const courses = res.data || [];

  return [...new Set(courses.map(c => c.semester))];
}

async function loadGPA(semester = '') {
  const endpoint = semester
    ? `/grades/gpa?semester=${encodeURIComponent(semester)}`
    : '/grades/gpa';

  const res = await apiFetch(endpoint);
  const data = res.data || {};
  const details = data.details || [];

  const successfulCourses =
    data.summary?.successfulCourses ??
    details.filter(d => getAcademicStatus(d.average) === 'Successful').length;

  const conditionalCourses =
    data.summary?.conditionalCourses ??
    details.filter(d => getAcademicStatus(d.average) === 'Conditional Pass').length;

  const atRiskCourses =
    data.summary?.atRiskCourses ??
    details.filter(d => getAcademicStatus(d.average) === 'At Risk').length;

  document.getElementById('gpa-stats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Overall GPA</div>
      <div class="stat-value">${data.gpa != null ? data.gpa.toFixed(2) : '—'}</div>
      <div class="stat-sub">out of 4.00</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Total Credits</div>
      <div class="stat-value">${data.totalCredits || 0}</div>
      <div class="stat-sub">Completed credit load</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Successful Courses</div>
      <div class="stat-value">${successfulCourses}</div>
      <div class="stat-sub">Good standing</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">At-Risk Courses</div>
      <div class="stat-value">${atRiskCourses}</div>
      <div class="stat-sub">${conditionalCourses} conditional courses</div>
    </div>
  `;

  const detailDiv = document.getElementById('gpa-details');

  if (details.length === 0) {
    detailDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <p>No courses found.</p>
      </div>
    `;
    return;
  }

  detailDiv.innerHTML = `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Code</th>
            <th>Credits</th>
            <th>Average</th>
            <th>Letter</th>
            <th>Status</th>
            <th>GPA Points</th>
          </tr>
        </thead>

        <tbody>
          ${details.map(d => {
            const status = d.academicStatus || getAcademicStatus(d.average);
            const statusClass = getStatusClass(status);

            return `
              <tr>
                <td><strong>${d.courseName}</strong></td>
                <td><span class="course-code">${d.courseCode}</span></td>
                <td>${d.credits}</td>
                <td>${d.average != null ? d.average.toFixed(1) : '—'}</td>
                <td><strong>${d.letterGrade}</strong></td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${d.gpaPoints != null ? d.gpaPoints.toFixed(1) : '—'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}