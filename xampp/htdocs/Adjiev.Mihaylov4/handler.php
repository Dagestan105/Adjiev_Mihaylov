<?php
require_once 'db.php';

// Устанавливаем заголовок JSON, чтобы JavaScript понимал ответ
header('Content-Type: application/json');

// Получаем данные, которые прислал fetch (в формате JSON)
$input = json_decode(file_get_contents('php://input'), true);

// Определяем действие (из JSON или из URL)
$action = $_GET['action'] ?? $input['action'] ?? '';

switch ($action) {

    // --- АВТОРИЗАЦИЯ ---
    case 'login':
        $user = $input['username'] ?? '';
        $pass = $input['password'] ?? '';

        $stmt = $pdo->prepare("SELECT role FROM users WHERE username = ? AND password = ?");
        $stmt->execute([$user, $pass]);
        $result = $stmt->fetch();

        if ($result) {
            echo json_encode(['success' => true, 'role' => $result['role']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Неверные данные']);
        }
        break;

    // --- СОЗДАНИЕ ЗАДАЧИ (Для Управляющего) ---
    case 'create_task':
        $title = $input['title'] ?? 'Без названия';
        $s_date = $input['start_date'] ?? null;
        $reqs = $input['requirements'] ?? '';
        $status = $input['status'] ?? 'new';

        $stmt = $pdo->prepare("INSERT INTO tasks (title, start_date, requirements, status) VALUES (?, ?, ?, ?)");
        $success = $stmt->execute([$title, $s_date, $reqs, $status]);

        echo json_encode(['success' => $success]);
        break;

    // --- ПОЛУЧЕНИЕ ЗАДАЧ (Для HR) ---
    case 'get_tasks':
        $stmt = $pdo->query("SELECT * FROM tasks ORDER BY id DESC");
        $tasks = $stmt->fetchAll();
        echo json_encode($tasks);
        break;

    default:
        echo json_encode(['error' => 'Неизвестное действие']);
        break;
}
?>