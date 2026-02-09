// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAVmSmiuJDcCAiZhq3xqXSJZnWtviLvnuU",
    databaseURL: "https://winslow-756c3-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// State
let workspaceId = null;
let tasksRef = null;
let docsRef = null;
let tasks = [];
let docs = [];
let currentDocId = null;
let draggedTask = null;
let saveTimeout = null;
let dropTargetTask = null;
let currentChecklist = [];

// Toggle password visibility
function togglePassword() {
    const input = document.getElementById('passwordInput');
    const btn = event.target;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// Hash password (simple hash for client-side)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Join Workspace with Password
async function joinWorkspace() {
    workspaceId = document.getElementById('syncIdInput').value.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const password = document.getElementById('passwordInput').value;
    
    if (!workspaceId) {
        alert('Please enter a workspace ID');
        return;
    }
    if (!password) {
        alert('Please enter a password');
        return;
    }
    
    const passwordHash = await hashPassword(password);
    const workspaceRef = db.ref(`workspaces/${workspaceId}`);
    
    try {
        const snapshot = await workspaceRef.once('value');
        const workspace = snapshot.val();
        
        console.log('Workspace found:', workspace ? 'YES' : 'NO');
        console.log('Computed hash:', passwordHash);
        
        if (workspace) {
            console.log('Stored hash:', workspace.passwordHash);
            if (workspace.passwordHash !== passwordHash) {
                console.log('Hash mismatch!');
                alert('❌ Incorrect password!\n\nContact admin if you need access.');
                return;
            }
            console.log('✅ Password verified');
        } else {
            alert('❌ Workspace not found!\n\nContact admin to create new workspaces.');
            return;
        }
        
        document.getElementById('workspaceName').textContent = workspaceId;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        document.getElementById('passwordInput').value = '';
        
        tasksRef = workspaceRef.child('tasks');
        docsRef = workspaceRef.child('docs');
        
        tasksRef.on('value', (snap) => {
            const data = snap.val();
            tasks = data ? Object.entries(data).map(([id, t]) => ({id, ...t})) : [];
            renderTasks();
        }, (err) => {
            console.error('Tasks error:', err);
            document.getElementById('syncStatus').textContent = '🔴 Error';
            document.getElementById('syncStatus').className = 'sync-status offline';
        });
        
        docsRef.on('value', (snap) => {
            const data = snap.val();
            docs = data ? Object.entries(data).map(([id, d]) => ({id, ...d})) : [];
            docs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            renderDocsList();
        });
        
        db.ref('.info/connected').on('value', (snap) => {
            if (snap.val()) {
                document.getElementById('syncStatus').textContent = '🟢 Online';
                document.getElementById('syncStatus').className = 'sync-status online';
            } else {
                document.getElementById('syncStatus').textContent = '🟡 Connecting...';
                document.getElementById('syncStatus').className = 'sync-status syncing';
            }
        });
        
    } catch (error) {
        console.error('Join error:', error);
        alert('Error: ' + error.message);
    }
}

// Logout
function logout() {
    if (tasksRef) tasksRef.off();
    if (docsRef) docsRef.off();
    tasks = [];
    docs = [];
    workspaceId = null;
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

// Switch Views
function switchView(view) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('boardView').style.display = 'none';
    document.getElementById('notesView').classList.remove('active');
    document.getElementById('filesView').classList.remove('active');
    
    if (view === 'board') {
        document.getElementById('boardView').style.display = 'grid';
    } else if (view === 'notes') {
        document.getElementById('notesView').classList.add('active');
        if (window.innerWidth <= 768) {
            document.getElementById('docsSidebar').classList.add('hidden');
            document.getElementById('docsToggleBtn').textContent = '📁 Show Notes';
        }
        if (!currentDocId && docs.length > 0) selectDoc(docs[0].id);
    } else if (view === 'files') {
        document.getElementById('filesView').classList.add('active');
        loadDriveLinks();
    }
}

// Toggle Docs Sidebar (Mobile)
function toggleDocsSidebar() {
    const sidebar = document.getElementById('docsSidebar');
    const btn = document.getElementById('docsToggleBtn');
    
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        btn.textContent = '📁 Hide Notes';
    } else {
        sidebar.classList.add('hidden');
        btn.textContent = '📁 Show Notes';
    }
}

// ==================== DRIVE ====================

function loadDriveLinks() {
    const container = document.getElementById('driveLinks');
    
    // Drive folder links
    const folders = [
        { name: 'AI Skills Studio (Root)', url: 'https://drive.google.com/drive/folders/1hU2LW9fW0aht7x_-ki80a4f5MFifIeK7' },
        { name: '📁 Template Packs', url: 'https://drive.google.com/drive/folders/1c2Avh-PNtg9tEpgZWpDJjE6WdqQB9Cyy' },
        { name: '📁 Media Assets', url: 'https://drive.google.com/drive/folders/1SKqsnfGGc1hSW0hqA-SiOXmn1SI47z-K' },
        { name: '📁 Exports', url: 'https://drive.google.com/drive/folders/1P5xl8qhO3yeK90m2XU_Hwp-Psw5S5D1h' },
    ];
    
    const quickLinks = [
        { name: '📝 Google Docs', url: 'https://docs.google.com/document/u/0/' },
        { name: '📊 Google Sheets', url: 'https://docs.google.com/spreadsheets/u/0/' },
        { name: '🎬 Google Slides', url: 'https://docs.google.com/presentation/u/0/' },
        { name: '📋 Google Forms', url: 'https://docs.google.com/forms/u/0/' },
    ];
    
    container.innerHTML = `
        <div class="drive-section">
            <div class="drive-section-title">🎯 Quick Access</div>
            ${quickLinks.map(link => `
                <div class="drive-item">
                    <a href="${link.url}" target="_blank">
                        <span class="drive-item-icon">${link.name.split(' ')[0]}</span>
                        <span>${link.name.substring(2)}</span>
                    </a>
                </div>
            `).join('')}
        </div>
        <div class="drive-section">
            <div class="drive-section-title">📂 AI Skills Studio Folders</div>
            ${folders.map(folder => `
                <div class="drive-folder">
                    <a href="${folder.url}" target="_blank">
                        <span class="drive-folder-icon">${folder.name.startsWith('📁') ? '📁' : '🏠'}</span>
                        <span class="drive-folder-name">${folder.name.replace('📁 ', '').replace('🏠 ', '')}</span>
                    </a>
                </div>
            `).join('')}
        </div>
        <div class="drive-section">
            <div class="drive-section-title">💡 Tips</div>
            <div style="color: #888; font-size: 0.9rem; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                • Click any folder to open in Google Drive<br>
                • Upload templates to "Template Packs" folder<br>
                • All files are automatically backed up<br>
                • Share links are public for template images
            </div>
        </div>
    `;
}

// ==================== TASKS ====================

function renderTasks() {
    const cols = {todo: [], progress: [], review: [], done: []};
    
    tasks.forEach(t => { 
        const status = t.status || t.column || 'todo';
        if (cols[status]) cols[status].push(t); 
    });
    
    Object.keys(cols).forEach(status => {
        cols[status].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    
    Object.keys(cols).forEach(status => {
        const container = document.getElementById(`col-${status}`);
        container.innerHTML = cols[status].map((t) => `
            <div class="task-card" draggable="true" 
                 ondragstart="drag(event, '${t.id}')" 
                 ondragover="dragOverTask(event, '${t.id}')"
                 ondragleave="dragLeaveTask(event)"
                 ontouchstart="touchStart(event, '${t.id}')"
                 ontouchmove="touchMove(event)"
                 ontouchend="touchEnd(event, '${t.id}')"
                 onclick="editTask('${t.id}')">
                <div class="task-title">${escapeHtml(t.title)}</div>
                ${t.desc ? `<div class="task-desc">${escapeHtml(t.desc)}</div>` : ''}
                <div class="task-meta">
                    <span class="tag tag-${t.category}">${t.category}</span>
                    <span class="priority-indicator priority-${t.priority}">${t.priority}</span>
                </div>
                ${renderTaskExtras(t)}
            </div>
        `).join('');
        document.getElementById(`count-${status}`).textContent = cols[status].length;
    });
}

function renderTaskExtras(task) {
    const checklist = task.checklist || [];
    const files = task.files || {};
    const checklistCount = checklist.length;
    const checkedCount = checklist.filter(i => i.checked).length;
    const fileCount = Object.keys(files).length;
    
    if (checklistCount === 0 && fileCount === 0) return '';
    
    let html = '<div class="task-extras">';
    
    if (checklistCount > 0) {
        const percent = Math.round((checkedCount / checklistCount) * 100);
        html += `<span class="has-checklist">☑️ ${checkedCount}/${checklistCount}`;
        if (percent === 100) html += ' ✓';
        html += '</span>';
    }
    
    if (fileCount > 0) {
        html += `<span class="has-files">📎 ${fileCount}</span>`;
    }
    
    html += '</div>';
    
    if (checklistCount > 0) {
        const percent = Math.round((checkedCount / checklistCount) * 100);
        html += `
            <div class="checklist-progress">
                <div class="checklist-progress-bar">
                    <div class="checklist-progress-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    }
    
    return html;
}

// ==================== TOUCH DRAG & DROP ====================

let touchDragElement = null;
let touchDragId = null;
let touchStartX = 0;
let touchStartY = 0;

function touchStart(e, taskId) {
    // Don't prevent default - we want the click to work too
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchDragId = taskId;
    
    // Get the task card element
    touchDragElement = e.currentTarget;
    
    // Add visual feedback
    touchDragElement.classList.add('dragging');
    
    // Store original position for revert
    touchDragElement.dataset.originalPosition = '';
}

function touchMove(e) {
    if (!touchDragElement) return;
    e.preventDefault(); // Prevent scrolling while dragging
    
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;
    
    // Apply transform
    const transform = `translate(${diffX}px, ${diffY}px) scale(0.95)`;
    touchDragElement.style.transform = transform;
    touchDragElement.style.position = 'fixed';
    touchDragElement.style.left = '10px';
    touchDragElement.style.right = '10px';
    touchDragElement.style.zIndex = '1000';
    touchDragElement.style.width = 'auto';
    
    // Find drop target
    const dropTarget = findDropTarget(touch.clientX, touch.clientY);
    
    // Highlight drop zones
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
    });
    
    if (dropTarget) {
        dropTarget.classList.add('drag-over');
    }
}

function touchEnd(e, taskId) {
    if (!touchDragElement) return;
    
    const touch = e.changedTouches[0];
    const dropTarget = findDropTarget(touch.clientX, touch.clientY);
    
    // Remove dragging styles
    touchDragElement.classList.remove('dragging');
    touchDragElement.style.transform = '';
    touchDragElement.style.position = '';
    touchDragElement.style.left = '';
    touchDragElement.style.right = '';
    touchDragElement.style.zIndex = '';
    touchDragElement.style.width = '';
    
    // Remove column highlights
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
    });
    
    // If dropped on a column, move the task
    if (dropTarget) {
        const column = dropTarget.id.replace('col-', '');
        moveTask(taskId, column);
    }
    
    // Reset
    touchDragElement = null;
    touchDragId = null;
}

function findDropTarget(x, y) {
    // Find which column the touch point is over
    const columns = document.querySelectorAll('.column');
    
    for (const col of columns) {
        const rect = col.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            return col;
        }
    }
    
    return null;
}

function drag(e, id) { 
    draggedTask = id; 
    e.dataTransfer.effectAllowed = 'move';
}

function allowDrop(e) { 
    e.preventDefault(); 
}

function dragOverTask(e, targetId) {
    e.preventDefault();
    if (targetId === draggedTask) return;
    dropTargetTask = targetId;
    const card = e.currentTarget;
    card.classList.add('drag-over');
}

function dragLeaveTask(e) {
    e.currentTarget.classList.remove('drag-over');
}

async function drop(e, newStatus) {
    e.preventDefault();
    if (!draggedTask) return;
    
    const task = tasks.find(t => t.id === draggedTask);
    const currentStatus = task.status || task.column;
    
    document.querySelectorAll('.task-card').forEach(card => card.classList.remove('drag-over'));
    
    if (currentStatus !== newStatus) {
        const targetColTasks = tasks.filter(t => (t.status || t.column) === newStatus);
        const newOrder = targetColTasks.length > 0 
            ? Math.min(...targetColTasks.map(t => t.order || 0)) - 1 
            : 0;
        await tasksRef.child(draggedTask).update({
            status: newStatus, 
            column: newStatus, 
            order: newOrder,
            updatedAt: Date.now()
        });
    } else if (dropTargetTask && dropTargetTask !== draggedTask) {
        const colTasks = tasks.filter(t => (t.status || t.column) === newStatus);
        colTasks.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        const draggedIndex = colTasks.findIndex(t => t.id === draggedTask);
        const targetIndex = colTasks.findIndex(t => t.id === dropTargetTask);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const [movedTask] = colTasks.splice(draggedIndex, 1);
            colTasks.splice(targetIndex, 0, movedTask);
            
            const updates = {};
            colTasks.forEach((t, idx) => {
                updates[`${t.id}/order`] = idx;
                updates[`${t.id}/updatedAt`] = Date.now();
            });
            await tasksRef.update(updates);
        }
    }
    
    draggedTask = null;
    dropTargetTask = null;
}

function openTaskModal() {
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskCategory').value = 'marketing';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskColumn').value = 'todo';
    document.getElementById('columnGroup').style.display = 'none';
    currentChecklist = [];
    document.getElementById('checklistSection').style.display = 'block';
    renderChecklist([]);
    document.getElementById('taskFilesSection').style.display = 'none';
    document.getElementById('modalTitle').textContent = 'New Task';
    document.getElementById('deleteTaskBtn').style.display = 'none';
    document.getElementById('taskModal').classList.add('active');
}

function editTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    document.getElementById('taskId').value = id;
    document.getElementById('taskTitle').value = t.title;
    document.getElementById('taskDesc').value = t.desc || '';
    document.getElementById('taskCategory').value = t.category;
    document.getElementById('taskPriority').value = t.priority;
    document.getElementById('columnGroup').style.display = 'block';
    document.getElementById('taskColumn').value = t.status || t.column || 'todo';
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('deleteTaskBtn').style.display = 'block';
    
    currentChecklist = t.checklist || [];
    document.getElementById('checklistSection').style.display = 'block';
    renderChecklist(currentChecklist);
    
    document.getElementById('taskFilesSection').style.display = 'block';
    renderTaskFiles(t.files || {});
    
    document.getElementById('taskModal').classList.add('active');
}

async function saveTask() {
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();
    if (!title) return alert('Please enter a title');
    
    const columnGroup = document.getElementById('columnGroup');
    let status, column;
    
    if (id && columnGroup.style.display !== 'none') {
        const newColumn = document.getElementById('taskColumn').value;
        status = newColumn;
        column = newColumn;
    } else {
        status = id ? tasks.find(t => t.id === id)?.status || 'todo' : 'todo';
        column = id ? tasks.find(t => t.id === id)?.column || 'todo' : 'todo';
    }
    
    const data = {
        title,
        desc: document.getElementById('taskDesc').value.trim(),
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        status,
        column,
        checklist: currentChecklist,
        updatedAt: Date.now()
    };
    if (!id) data.createdAt = Date.now();
    
    const ref = id ? tasksRef.child(id) : tasksRef.push();
    await ref.set(data);
    closeTaskModal();
}

async function deleteTask() {
    const id = document.getElementById('taskId').value;
    if (id && confirm('Delete this task?')) {
        await tasksRef.child(id).remove();
        closeTaskModal();
    }
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
}

// ==================== CHECKLIST ====================

function renderChecklist(checklist) {
    const container = document.getElementById('checklistItems');
    const checkedCount = checklist.filter(i => i.checked).length;
    const totalCount = checklist.length;
    const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
    
    document.getElementById('checklistProgressText').textContent = `${checkedCount}/${totalCount}`;
    document.getElementById('checklistPercent').textContent = `${percent}%`;
    document.getElementById('checklistProgressBar').style.width = `${percent}%`;
    
    if (checklist.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No items yet</p>';
        return;
    }
    
    container.innerHTML = checklist.map((item, index) => `
        <div class="checklist-item">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleChecklistItem(${index})">
            <input type="text" class="checklist-item-text ${item.checked ? 'checked' : ''}" value="${escapeHtml(item.text)}" onchange="updateChecklistItem(${index}, this.value)">
            <span class="checklist-item-delete" onclick="deleteChecklistItem(${index})">×</span>
        </div>
    `).join('');
}

async function addChecklistItem() {
    const input = document.getElementById('newChecklistItem');
    const text = input.value.trim();
    if (!text) return;
    
    currentChecklist.push({ text, checked: false });
    
    const taskId = document.getElementById('taskId').value;
    if (taskId) {
        await tasksRef.child(taskId).update({ checklist: currentChecklist, updatedAt: Date.now() });
    }
    
    input.value = '';
    renderChecklist(currentChecklist);
}

async function toggleChecklistItem(index) {
    if (!currentChecklist[index]) return;
    
    currentChecklist[index].checked = !currentChecklist[index].checked;
    
    const taskId = document.getElementById('taskId').value;
    if (taskId) {
        await tasksRef.child(taskId).update({ checklist: currentChecklist, updatedAt: Date.now() });
    }
    
    renderChecklist(currentChecklist);
}

async function updateChecklistItem(index, text) {
    if (!currentChecklist[index]) return;
    
    currentChecklist[index].text = text.trim();
    
    const taskId = document.getElementById('taskId').value;
    if (taskId) {
        await tasksRef.child(taskId).update({ checklist: currentChecklist, updatedAt: Date.now() });
    }
}

async function deleteChecklistItem(index) {
    currentChecklist.splice(index, 1);
    
    const taskId = document.getElementById('taskId').value;
    if (taskId) {
        await tasksRef.child(taskId).update({ checklist: currentChecklist, updatedAt: Date.now() });
    }
    
    renderChecklist(currentChecklist);
}

// ==================== TASK FILES ====================

function renderTaskFiles(files) {
    const container = document.getElementById('taskFilesList');
    const fileEntries = Object.entries(files).sort((a, b) => b[1].uploadedAt - a[1].uploadedAt);
    
    if (fileEntries.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No attachments yet</p>';
        return;
    }
    
    container.innerHTML = fileEntries.map(([id, file]) => `
        <div class="task-file-item">
            <div class="task-file-info">
                <span class="task-file-icon">${getFileIcon(file.type)}</span>
                <span class="task-file-name">${escapeHtml(file.name)}</span>
            </div>
            <div class="task-file-actions">
                <button onclick="downloadTaskFile('${id}')">Download</button>
                <button class="delete" onclick="deleteTaskFile('${id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function uploadTaskFiles(files) {
    if (!files.length) return;
    
    const taskId = document.getElementById('taskId').value;
    if (!taskId) {
        alert('Please save the task first before uploading files.');
        return;
    }
    
    const task = tasks.find(t => t.id === taskId);
    const existingFiles = task.files || {};
    
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result;
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64,
                uploadedAt: Date.now()
            };
            
            const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            existingFiles[fileId] = fileData;
            
            await tasksRef.child(taskId).update({ files: existingFiles, updatedAt: Date.now() });
            renderTaskFiles(existingFiles);
        };
        reader.readAsDataURL(file);
    }
    
    document.getElementById('taskFileInput').value = '';
}

async function downloadTaskFile(fileId) {
    const taskId = document.getElementById('taskId').value;
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.files || !task.files[fileId]) return;
    
    const file = task.files[fileId];
    const a = document.createElement('a');
    a.href = file.data;
    a.download = file.name;
    a.click();
}

async function deleteTaskFile(fileId) {
    if (!confirm('Delete this attachment?')) return;
    
    const taskId = document.getElementById('taskId').value;
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.files) return;
    
    delete task.files[fileId];
    await tasksRef.child(taskId).update({ files: task.files, updatedAt: Date.now() });
    renderTaskFiles(task.files);
}

// ==================== DOCS / NOTES ====================

function renderDocsList() {
    const list = document.getElementById('docList');
    if (docs.length === 0) {
        list.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No notes yet - create your first one!</div>';
        return;
    }
    list.innerHTML = docs.map(d => `
        <div class="doc-item ${d.id === currentDocId ? 'active' : ''}" onclick="selectDoc('${d.id}')">
            <div style="font-weight: 500;">${escapeHtml(d.title || 'Untitled')}</div>
            <div style="font-size: 0.75rem; color: #666;">${formatDate(d.updatedAt)}</div>
        </div>
    `).join('');
}

function selectDoc(id) {
    currentDocId = id;
    const d = docs.find(x => x.id === id);
    if (d) {
        document.getElementById('docTitle').value = d.title || '';
        document.getElementById('docContent').value = d.content || '';
    }
    renderDocsList();
}

async function createDoc() {
    const ref = docsRef.push();
    await ref.set({
        title: 'New Document',
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    selectDoc(ref.key);
}

function saveDoc() {
    if (!currentDocId) return;
    document.getElementById('saveStatus').textContent = 'Saving...';
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        await docsRef.child(currentDocId).update({
            title: document.getElementById('docTitle').value,
            content: document.getElementById('docContent').value,
            updatedAt: Date.now()
        });
        document.getElementById('saveStatus').textContent = 'Saved';
    }, 500);
}

function copyDoc() {
    navigator.clipboard.writeText(document.getElementById('docContent').value).then(() => {
        document.getElementById('saveStatus').textContent = 'Copied!';
        setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
    });
}

function downloadDoc() {
    const title = document.getElementById('docTitle').value || 'document';
    const content = document.getElementById('docContent').value;
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

async function deleteDoc() {
    if (currentDocId && confirm('Delete this document?')) {
        await docsRef.child(currentDocId).remove();
        currentDocId = null;
        document.getElementById('docTitle').value = '';
        document.getElementById('docContent').value = '';
    }
}

// ==================== FILES ====================

function allowDropFiles(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('dragover');
}

function dropFiles(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
}

async function handleFiles(files) {
    if (!files.length) return;
    
    for (const file of files) {
        await uploadFile(file);
    }
}

async function uploadFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target.result;
        const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64,
            uploadedAt: Date.now()
        };
        
        await db.ref(`workspaces/${workspaceId}/files`).push(fileData);
        loadFilesList();
    };
    reader.readAsDataURL(file);
}

async function loadFilesList() {
    const snapshot = await db.ref(`workspaces/${workspaceId}/files`).once('value');
    const files = snapshot.val();
    const container = document.getElementById('filesListContent');
    
    if (!files) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">No files uploaded yet</p>';
        return;
    }
    
    const fileEntries = Object.entries(files).sort((a, b) => b[1].uploadedAt - a[1].uploadedAt);
    
    container.innerHTML = fileEntries.map(([id, file]) => `
        <div class="file-item">
            <div class="file-info">
                <span class="file-icon">${getFileIcon(file.type)}</span>
                <div>
                    <div class="file-name">${escapeHtml(file.name)}</div>
                    <div class="file-meta">${formatFileSize(file.size)} • ${formatDate(file.uploadedAt)}</div>
                </div>
            </div>
            <div class="file-actions">
                <button onclick="downloadFile('${id}')">💾 Download</button>
                <button onclick="deleteFile('${id}')" style="color: #ff6b6b;">🗑️</button>
            </div>
        </div>
    `).join('');
}

function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    return '📁';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function downloadFile(id) {
    const snapshot = await db.ref(`workspaces/${workspaceId}/files/${id}`).once('value');
    const file = snapshot.val();
    if (!file) return;
    
    const a = document.createElement('a');
    a.href = file.data;
    a.download = file.name;
    a.click();
}

async function deleteFile(id) {
    if (confirm('Delete this file?')) {
        await db.ref(`workspaces/${workspaceId}/files/${id}`).remove();
        loadFilesList();
    }
}

// ==================== UTILS ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(ts) {
    if (!ts) return 'Just now';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return d.toLocaleDateString();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTaskModal();
});
