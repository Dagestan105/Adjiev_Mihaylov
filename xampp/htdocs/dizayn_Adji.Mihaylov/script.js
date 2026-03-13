// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let currentRole = '';
let currentTaskId = null;
let currentRequestId = null;
let currentPersonnelId = null;

// ========== ФУНКЦИИ ДЛЯ ПЕРЕКЛЮЧЕНИЯ МЕЖДУ РОЛЯМИ ==========
function selectRole(role) {
    currentRole = role;

    const homePage = document.getElementById('home-page');
    if (homePage) homePage.style.display = 'none';

    const storeInterface = document.getElementById('store-manager-interface');
    const officeInterface = document.getElementById('office-manager-interface');
    const hrInterface = document.getElementById('hr-specialist-interface');

    if (storeInterface) storeInterface.style.display = 'none';
    if (officeInterface) officeInterface.style.display = 'none';
    if (hrInterface) hrInterface.style.display = 'none';

    if (role === 'store-manager') {
        if (storeInterface) {
            storeInterface.style.display = 'block';
            showStoreSection('store-dashboard');
        }
    } else if (role === 'office-manager') {
        if (officeInterface) {
            officeInterface.style.display = 'block';
            showOfficeSection('office-dashboard');
        }
    } else if (role === 'hr-specialist') {
        if (hrInterface) {
            hrInterface.style.display = 'block';
            showHRSection('hr-requests');
        }
    }
}

function showHomePage() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('store-manager-interface').style.display = 'none';
    document.getElementById('office-manager-interface').style.display = 'none';
    document.getElementById('hr-specialist-interface').style.display = 'none';
    currentRole = '';
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ МЕНЮ ==========
function showStoreSection(sectionId) {
    document.querySelectorAll('#store-manager-interface .content').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    updateActiveMenu('#store-manager-interface', sectionId);
}

function showOfficeSection(sectionId) {
    document.querySelectorAll('#office-manager-interface .content').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    updateActiveMenu('#office-manager-interface', sectionId);
}

function showHRSection(sectionId) {
    document.querySelectorAll('#hr-specialist-interface .content').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    updateActiveMenu('#hr-specialist-interface', sectionId);
}

function updateActiveMenu(interfaceSelector, sectionId) {
    const menuLinks = document.querySelectorAll(interfaceSelector + ' .sidebar-menu a, ' + interfaceSelector + ' nav a');
    menuLinks.forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) link.classList.add('active');
    });
}

// ========== РАБОТА С БАЗОЙ ДАННЫХ (FETCH API) ==========

// 1. Управляющий: Сохранение задачи в БД (US.1, US.2)
async function sendTaskToDB(statusType) {
    const taskData = {
        action: 'create_task',
        title: document.getElementById('task-name').value, // Соответствует вашему index.html
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        requirements: document.getElementById('worker-requirements').value, // Соответствует вашему index.html
        status: statusType
    };

    if (!taskData.title || !taskData.start_date) {
        alert("Пожалуйста, заполните название и дату начала!");
        return;
    }

    try {
        const response = await fetch('handler.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        const result = await response.json();
        if (result.success) {
            if (statusType === 'new') {
                showModal('success-modal');
            } else {
                alert('Задание успешно отправлено в работу!');
                showStoreSection('store-dashboard');
            }
            // Очистка формы
            document.getElementById('task-name').value = '';
            document.getElementById('worker-requirements').value = '';
        }
    } catch (error) {
        console.error("Ошибка соединения с сервером:", error);
        alert("Ошибка: Убедитесь, что XAMPP запущен и файлы PHP на месте.");
    }
}

// Переназначение ваших функций на работу с БД
function saveTaskDraft() { sendTaskToDB('new'); }
function saveAndSendTask() { sendTaskToDB('in_work'); }

// 2. HR: Регистрация специалиста в БД (US.8)
async function registerSpecialist() {
    const hrData = {
        action: 'register_specialist',
        last_name: document.getElementById('last-name').value, //
        first_name: document.getElementById('first-name').value, //
        phone: document.getElementById('phone').value, //
        specialization: document.getElementById('specialization').value //
    };

    if (!hrData.last_name || !hrData.first_name || !hrData.phone) {
        alert('Заполните все обязательные поля!');
        return;
    }

    try {
        const response = await fetch('handler.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hrData)
        });

        const result = await response.json();
        if (result.success) {
            showModal('register-success-modal');
            // Очистка формы
            document.getElementById('last-name').value = '';
            document.getElementById('first-name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('specialization').value = '';
        }
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
    }
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('start-date')) {
        document.getElementById('start-date').value = today;
    }
});

// Закрытие по клику вне окна
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) closeModal();
};