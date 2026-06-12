const API_BASE = '';
let tasks = [];
let editingTaskId = null;

function showToast(title, desc, isError = false) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastDesc = document.getElementById('toastDesc');
    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    toastTitle.style.color = isError ? 'var(--rose)' : 'white';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== LOGIN ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginBtnText = document.getElementById('loginBtnText');
        const loginArrow = document.getElementById('loginArrow');
        const loginSpinner = document.getElementById('loginSpinner');
        if (loginBtnText) loginBtnText.textContent = 'Synchronizing...';
        if (loginArrow) loginArrow.classList.add('hidden');
        if (loginSpinner) loginSpinner.classList.remove('hidden');
        setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    });
}

// ========== NAVIGATION ==========
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = item.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageName}`);
        const targetNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (targetPage) targetPage.classList.add('active');
        if (targetNav) targetNav.classList.add('active');
        if (pageName === 'xml-tools') loadXmlDocs();
    });
});

// ========== MODAL ==========
const taskModal = document.getElementById('taskModal');
const newTaskBtn = document.getElementById('newTaskBtn');
const cancelBtn = document.getElementById('cancelBtn');
const submitTaskBtn = document.getElementById('submitTaskBtn');
const taskProgress = document.getElementById('taskProgress');
const progressValue = document.getElementById('progressValue');
const logoutBtn = document.getElementById('logoutBtn');

newTaskBtn.addEventListener('click', () => {
    editingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Initialize New Task';
    submitTaskBtn.textContent = 'Confirm & Launch';
    resetForm();
    taskModal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', closeModal);
taskModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

taskProgress.addEventListener('input', () => {
    progressValue.textContent = taskProgress.value;
});

function openModal() { taskModal.classList.remove('hidden'); }
function closeModal() { taskModal.classList.add('hidden'); resetForm(); }

function resetForm() {
    document.getElementById('taskForm').reset();
    taskProgress.value = 0;
    progressValue.textContent = '0';
    editingTaskId = null;
}

submitTaskBtn.addEventListener('click', async () => {
    const task = {
        id: editingTaskId || `t${Date.now()}`,
        type: 'simple',
        titre: document.getElementById('taskName').value,
        date_debut: document.getElementById('taskStart').value,
        date_fin: document.getElementById('taskEnd').value,
        priorite: document.getElementById('taskPriority').value,
        statut: document.getElementById('taskStatus').value,
    };
    if (!task.titre || !task.date_debut || !task.date_fin) {
        showToast('Error', 'Please fill all required fields', true);
        return;
    }
    try {
        const method = editingTaskId ? 'PUT' : 'POST';
        const url = editingTaskId ? `/api/tasks/${editingTaskId}` : '/api/tasks';
        const res = await fetch(url, {
            method, headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (res.ok) {
            showToast(editingTaskId ? 'Task Updated' : 'Task Initialized',
                       editingTaskId ? 'Node re-synchronized.' : 'New node added.');
            closeModal();
            loadTasks();
        }
    } catch (error) {
        showToast('Error', 'Failed to save task', true);
    }
});

// ========== LOAD & RENDER ==========
async function loadTasks() {
    try {
        const res = await fetch('/api/tasks');
        tasks = await res.json();
        renderDashboard();
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function renderDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.statut === 'terminé').length;
    const active = tasks.filter(t => t.statut === 'en cours').length;
    const critical = tasks.filter(t => t.priorite === 'haute').length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('activeTasks').textContent = active;
    document.getElementById('criticalTasks').textContent = critical;
    document.getElementById('totalEffort').textContent = total * 8;
    document.getElementById('completionRate').textContent = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('activeCount').textContent = active;

    initBadge();
    renderGantt(tasks);
}

// ========== BADGE ==========
function initBadge() {
    const now = new Date();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();
    const badge = document.getElementById('cycleBadge');
    if (badge) badge.textContent = `${month} ${year} Cycle`;
}

// ========== GANTT CHART ==========
function renderGantt(tasksToRender) {
    const header = document.getElementById('ganttHeader');
    const body = document.getElementById('ganttBody');

    // Clear previous
    header.innerHTML = '<div class="gantt-row-label">Active Project Nodes</div>';
    body.innerHTML = '';

    if (tasksToRender.length === 0) {
        header.innerHTML += '<div class="gantt-day" style="grid-column:2/-1;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);font-size:0.8rem;">No tasks to display</div>';
        return;
    }

    // Collect all unique dates from tasks
    const allDates = [];
    tasksToRender.forEach(t => {
        allDates.push(new Date(t.date_debut).getTime());
        allDates.push(new Date(t.date_fin).getTime());
    });

    const minTime = Math.min(...allDates);
    const maxTime = Math.max(...allDates);

    // Build day list from start of earliest month to end of latest month
    const startDate = new Date(minTime);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(maxTime);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(0, 0, 0, 0);

    const totalMs = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(totalMs / 86400000);
    const days = [];
    for (let i = 0; i < totalDays; i++) {
        days.push(new Date(startDate.getTime() + i * 86400000));
    }

    const dayStartMs = days[0].getTime();

    // Set header grid to match number of days
    header.style.gridTemplateColumns = `18rem repeat(${totalDays}, minmax(2.5rem, 1fr))`;

    // Add day header cells
    days.forEach((day, i) => {
        const dayEl = document.createElement('div');
        dayEl.className = `gantt-day ${day.getDay() === 0 || day.getDay() === 6 ? 'weekend' : ''}`;
        dayEl.innerHTML = `
            <span class="gantt-day-name">${day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span class="gantt-day-num">${day.getDate()}</span>
        `;
        header.appendChild(dayEl);
    });

    // Add task rows
    tasksToRender.forEach(task => {
        const row = document.createElement('div');
        row.className = 'gantt-task-row';
        row.style.gridTemplateColumns = header.style.gridTemplateColumns;

        // Parse dates safely as local dates
        const [sy, sm, sd] = task.date_debut.split('-').map(Number);
        const [ey, em, ed] = task.date_fin.split('-').map(Number);
        const taskStart = new Date(sy, sm - 1, sd).getTime();
        const taskEnd = new Date(ey, em - 1, ed).getTime();

        const priorityClass = task.priorite === 'haute' ? 'priority-critical' :
                             task.priorite === 'moyenne' ? 'priority-medium' : 'priority-low';

        // Calculate exact grid position
        const startDayIndex = Math.round((taskStart - dayStartMs) / 86400000);
        const durationDays = Math.max(1, Math.round((taskEnd - taskStart) / 86400000) + 1);
        const startCol = Math.max(2, startDayIndex + 2);

        row.innerHTML = `
            <div class="gantt-task-info">
                <div class="gantt-task-name">
                    <h4>${task.titre}</h4>
                    <div class="gantt-task-meta">
                        <div class="gantt-task-dot ${priorityClass}"></div>
                        <span>${task.priorite}</span>
                    </div>
                </div>
                <div class="gantt-task-actions">
                    <button class="task-action-btn" onclick="editTask('${task.id}')" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="task-action-btn danger" onclick="deleteTask('${task.id}')" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="gantt-task-bar" style="grid-column: ${startCol} / span ${durationDays}">
                <div class="gantt-bar ${priorityClass}">
                    <div class="gantt-bar-progress" style="width: ${task.progress || 0}%"></div>
                    <span class="gantt-bar-label">
                        ${(task.progress === 100) ? '&#10003; ' : ''}${task.progress || 0}%
                    </span>
                </div>
            </div>
        `;
        body.appendChild(row);
    });
}

// ========== SEARCH ==========
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = tasks.filter(t =>
            t.titre.toLowerCase().includes(query) ||
            t.priorite.toLowerCase().includes(query) ||
            t.statut.toLowerCase().includes(query)
        );
        renderGantt(filtered);
    });
}

// ========== EDIT / DELETE ==========
async function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    editingTaskId = id;
    document.getElementById('modalTitle').textContent = 'Edit Task Node';
    submitTaskBtn.textContent = 'Update Node';
    document.getElementById('taskName').value = task.titre;
    document.getElementById('taskStart').value = task.date_debut;
    document.getElementById('taskEnd').value = task.date_fin;
    document.getElementById('taskPriority').value = task.priorite;
    document.getElementById('taskStatus').value = task.statut;
    taskProgress.value = task.progress || 0;
    progressValue.textContent = task.progress || 0;
    openModal();
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        showToast('Task Deleted', 'Node permanently removed.', true);
        loadTasks();
    } catch (error) {
        showToast('Error', 'Failed to delete task', true);
    }
}



function renderAreaChart() {
    const container = document.getElementById('areaChart');
    if (!container) return;
    container.innerHTML = `
        <div class="chart-grid">
            ${[100, 75, 50, 25, 0].map(v => `<div class="chart-grid-line"></div>`).join('')}
        </div>
        <div class="chart-bars">
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const total = Math.floor(Math.random() * 60) + 40;
                const completed = Math.floor(total * (0.5 + Math.random() * 0.4));
                return `
                    <div class="chart-bar-wrapper">
                        <div style="display: flex; gap: 0.25rem; align-items: flex-end; flex: 1;">
                            <div class="chart-bar bg-primary" style="height: ${total}%"></div>
                            <div class="chart-bar bg-accent" style="height: ${completed}%"></div>
                        </div>
                        <span class="chart-bar-label">${day}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ========== XML TOOLS ==========
async function loadXmlDocs() {
    try {
        const xsdRes = await fetch('/api/xsd/content');
        const dtdRes = await fetch('/api/dtd/content');
        const xsdEl = document.getElementById('xsdPreview');
        const dtdEl = document.getElementById('dtdPreview');
        if (xsdEl) xsdEl.textContent = await xsdRes.text();
        if (dtdEl) dtdEl.textContent = await dtdRes.text();
    } catch (error) {
        const xsdEl = document.getElementById('xsdPreview');
        const dtdEl = document.getElementById('dtdPreview');
        if (xsdEl) xsdEl.textContent = 'Failed to load';
        if (dtdEl) dtdEl.textContent = 'Failed to load';
    }
}

document.getElementById('xmlSourceBtn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/xml/content');
        const xml = await res.text();
        const preview = document.getElementById('xmlPreview');
        preview.innerHTML = `<pre class="code-block" style="margin:0;border:none;color:#a78bfa;white-space:pre-wrap;word-break:break-all;">${escapeHtml(xml)}</pre>`;
        document.getElementById('downloadBtn').classList.remove('hidden');
        showToast('XML Loaded', 'Tasks source file from database.');
    } catch (error) {
        showToast('Error', 'Failed to load XML', true);
    }
});

document.getElementById('htmlReportBtn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/xml/transform');
        const html = await res.text();
        const preview = document.getElementById('xmlPreview');
        preview.innerHTML = `<div style="padding: 20px;">${html}</div>`;
        document.getElementById('downloadBtn').classList.remove('hidden');
        showToast('Report Generated', 'XSLT transformation complete.');
    } catch (error) {
        showToast('Error', 'Failed to generate report', true);
    }
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
    try {
        const preview = document.getElementById('xmlPreview');
        const content = preview.innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.html';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        showToast('Error', 'Failed to download', true);
    }
});

// Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/';
});

// ========== INIT ==========
initBadge();
loadTasks();
