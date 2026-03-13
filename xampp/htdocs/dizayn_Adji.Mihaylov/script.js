// ========== ГЛОБАЛЬНАЯ ЛОГИКА И АВТОРИЗАЦИЯ ==========

// Функция входа (Аутентификация)
async function login() {
    const user = prompt("Введите логин:");
    const pass = prompt("Введите пароль:");

    const response = await fetch('handler.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action: 'login', username: user, password: pass })
    });

    const result = await response.json();
    if (result.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', result.role);
        selectRole(result.role);
    } else {
        alert("Неверный логин или пароль!");
    }
}

function selectRole(role) {
    document.getElementById('home-page').style.display = 'none';
    const interfaces = ['store-manager-interface', 'office-manager-interface', 'hr-specialist-interface'];
    interfaces.forEach(id => document.getElementById(id).style.display = 'none');

    const targetId = role + '-interface';
    document.getElementById(targetId).style.display = 'block';

    // При входе сразу подгружаем данные из БД
    loadTasksToInterface();
}

// ========== РАБОТА С ЗАДАНИЯМИ (FETCH) ==========

async function sendTaskToDB(status = 'new') {
    const taskData = {
        action: 'create_task',
        title: document.getElementById('task-name').value,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        requirements: document.getElementById('worker-requirements').value,
        status: status
    };

    const response = await fetch('handler.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(taskData)
    });

    if (response.ok) {
        showModal('success-modal');
        loadTasksToInterface(); // Обновляем список на лету
    }
}

// Функция для вывода данных из БД в таблицу на сайте (US.7)
async function loadTasksToInterface() {
    const response = await fetch('handler.php?action=get_tasks');
    const tasks = await response.json();

    // Находим таблицу (в твоем HTML это может быть dashboard или список)
    // Пример для таблицы в интерфейсе HR или Офиса:
    const tableBody = document.querySelector('.tasks-table tbody');
    if (!tableBody) return;

    // Используем метод массивов (map) из задания
    tableBody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.title}</td>
            <td>${task.start_date}</td>
            <td><span class="status-${task.status}">${task.status}</span></td>
        </tr>
    `).join('');
}

// ========== HR: РЕГИСТРАЦИЯ (US.8) ==========

async function registerSpecialist() {
    const data = {
        action: 'register_specialist',
        last_name: document.getElementById('last-name').value,
        first_name: document.getElementById('first-name').value,
        phone: document.getElementById('phone').value,
        specialization: document.getElementById('specialization').value
    };

    const response = await fetch('handler.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if (response.ok) {
        showModal('register-success-modal');
    }
}

// ========== СТАНДАРТНЫЕ ФУНКЦИИ ИНТЕРФЕЙСА ==========
function showModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); }

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Проверка localStorage (как просили в задании)
    const wasLoggedIn = localStorage.getItem('isLoggedIn');
    if (wasLoggedIn === 'true') {
        selectRole(localStorage.getItem('userRole'));
    }
});