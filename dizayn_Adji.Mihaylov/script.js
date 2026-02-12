// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let currentRole = '';
let currentTaskId = null;
let currentRequestId = null;
let currentPersonnelId = null;

// ========== ФУНКЦИИ ДЛЯ ПЕРЕКЛЮЧЕНИЯ МЕЖДУ РОЛЯМИ ==========
function selectRole(role) {
    currentRole = role;
    
    // Скрываем главную страницу
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.style.display = 'none';
    
    // Скрываем все интерфейсы
    const storeInterface = document.getElementById('store-manager-interface');
    const officeInterface = document.getElementById('office-manager-interface');
    const hrInterface = document.getElementById('hr-specialist-interface');
    
    if (storeInterface) storeInterface.style.display = 'none';
    if (officeInterface) officeInterface.style.display = 'none';
    if (hrInterface) hrInterface.style.display = 'none';
    
    // Показываем нужный интерфейс
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
    const homePage = document.getElementById('home-page');
    const storeInterface = document.getElementById('store-manager-interface');
    const officeInterface = document.getElementById('office-manager-interface');
    const hrInterface = document.getElementById('hr-specialist-interface');
    
    if (homePage) homePage.style.display = 'block';
    if (storeInterface) storeInterface.style.display = 'none';
    if (officeInterface) officeInterface.style.display = 'none';
    if (hrInterface) hrInterface.style.display = 'none';
    
    currentRole = '';
}

// ========== ФУНКЦИИ ДЛЯ УПРАВЛЯЮЩЕГО МАГАЗИНОМ ==========
function showStoreSection(sectionId) {
    // Скрываем все разделы
    const sections = document.querySelectorAll('#store-manager-interface .content');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Показываем нужный раздел
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
    
    // Обновляем активную ссылку в меню
    updateActiveMenu('#store-manager-interface', sectionId);
}

// ========== ФУНКЦИИ ДЛЯ УПРАВЛЯЮЩЕГО ОФИСОМ ==========
function showOfficeSection(sectionId) {
    // Скрываем все разделы
    const sections = document.querySelectorAll('#office-manager-interface .content');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Показываем нужный раздел
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
    
    // Обновляем активную ссылку в меню
    updateActiveMenu('#office-manager-interface', sectionId);
}

// ========== ФУНКЦИИ ДЛЯ HR-СПЕЦИАЛИСТА ==========
function showHRSection(sectionId) {
    // Скрываем все разделы
    const sections = document.querySelectorAll('#hr-specialist-interface .content');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Показываем нужный раздел
    const section = document.getElementById(sectionId);
    if (section) section.style.display = 'block';
    
    // Обновляем активную ссылку в меню
    updateActiveMenu('#hr-specialist-interface', sectionId);
}

// ========== ОБЩАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ АКТИВНОГО МЕНЮ ==========
function updateActiveMenu(interfaceSelector, sectionId) {
    const menuLinks = document.querySelectorAll(interfaceSelector + ' .sidebar-menu a, ' + interfaceSelector + ' nav a');
    menuLinks.forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
            link.classList.add('active');
        }
    });
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАДАНИЯМИ ==========
function saveTaskDraft() {
    showModal('success-modal');
}

function saveAndSendTask() {
    alert('Задание сохранено и отправлено в работу. Статус изменен на "В работе".');
    showStoreSection('store-dashboard');
}

function editTask(taskId) {
    alert(`Редактирование задания #${taskId}`);
    showStoreSection('store-create-task');
}

function viewTaskDetails(taskId) {
    alert(`Просмотр деталей задания #${taskId}`);
}

function confirmCancel(taskId) {
    currentTaskId = taskId;
    showModal('cancel-modal');
}

function cancelTask() {
    alert(`Задание #${currentTaskId} отменено. Статус изменен на "Отменён".`);
    closeModal();
    showStoreSection('store-dashboard');
}

function sendToWork(taskId) {
    alert(`Задание #${taskId} отправлено в работу. Статус изменен на "В работе".`);
}

// ========== ФУНКЦИИ ДЛЯ УПРАВЛЯЮЩЕГО ОФИСОМ ==========
function assignPersonnel(taskId) {
    currentTaskId = taskId;
    showModal('assign-modal');
}

function assignToTask(personnelId, taskId) {
    alert(`Специалист #${personnelId} назначен на задание #${taskId}`);
    showModal('assign-modal');
}

// ========== ФУНКЦИИ ДЛЯ HR-СПЕЦИАЛИСТА ==========
function findCandidates(requestId) {
    currentRequestId = requestId;
    alert(`Поиск кандидатов по заявке #${requestId}`);
}

function registerSpecialist() {
    // Проверка заполнения обязательных полей
    const lastName = document.getElementById('last-name');
    const firstName = document.getElementById('first-name');
    const phone = document.getElementById('phone');
    const specialization = document.getElementById('specialization');
    
    if (!lastName || !firstName || !phone || !specialization) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    if (!lastName.value || !firstName.value || !phone.value || !specialization.value) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    showModal('register-success-modal');
    
    // Очищаем форму
    lastName.value = '';
    firstName.value = '';
    phone.value = '';
    specialization.value = '';
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С МОДАЛЬНЫМИ ОКНАМИ ==========
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт успешно загружен!');
    
    // Установка текущей даты в форму создания задания
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
    }
    
    const endDateInput = document.getElementById('end-date');
    if (endDateInput) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        endDateInput.value = endDate.toISOString().split('T')[0];
    }
});

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}