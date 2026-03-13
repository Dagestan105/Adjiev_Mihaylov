// --- ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ ---
document.addEventListener('DOMContentLoaded', () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');

    if (loggedIn && role) {
        renderRoleInterface(role);
    }
});

// --- АВТОРИЗАЦИЯ ---
async function handleLogin() {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    try {
        const response = await fetch('handler.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username: user, password: pass })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', data.role);
            renderRoleInterface(data.role);
        } else {
            alert("Ошибка: Неверный логин или пароль");
        }
    } catch (e) {
        alert("Ошибка соединения с сервером XAMPP");
    }
}

function handleLogout() {
    localStorage.clear();
    location.reload();
}

// --- НАВИГАЦИЯ МЕЖДУ РОЛЯМИ ---
function renderRoleInterface(role) {
    // Скрываем всё
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('store-manager-interface').classList.add('hidden');
    document.getElementById('hr-specialist-interface').classList.add('hidden');

    // Показываем нужный интерфейс
    if (role === 'store-manager') {
        document.getElementById('store-manager-interface').classList.remove('hidden');
    } else if (role === 'hr-specialist') {
        document.getElementById('hr-specialist-interface').classList.remove('hidden');
        loadTasksForHR();
    }
}

// --- ФУНКЦИИ МАГАЗИНА ---
function showStoreSection(id) {
    document.getElementById('store-dashboard').classList.add('hidden');
    document.getElementById('store-create-task').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
}

async function saveTaskDB() {
    const taskData = {
        action: 'create_task',
        title: document.getElementById('task-name').value,
        start_date: document.getElementById('start-date').value,
        requirements: document.getElementById('worker-requirements').value,
        status: 'in_work'
    };

    const res = await fetch('handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });

    if (res.ok) {
        alert("Задание отправлено!");
        showStoreSection('store-dashboard');
    }
}

// --- ФУНКЦИИ HR (Метод MAP для таблицы) ---
async function loadTasksForHR() {
    const res = await fetch('handler.php?action=get_tasks');
    const tasks = await res.json();
    const tbody = document.getElementById('hr-table-body');

    tbody.innerHTML = tasks.map(t => `
        <tr>
            <td>${t.title}</td>
            <td>${t.start_date}</td>
            <td><span style="color:green">${t.status}</span></td>
        </tr>
    `).join('');
}