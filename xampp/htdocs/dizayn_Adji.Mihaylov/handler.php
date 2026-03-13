<?php
include 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $data['action'] ?? '';

// 1. Авторизация
if ($action == 'login') {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE username = ? AND password = ?");
    $stmt->execute([$data['username'], $data['password']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['success' => (bool)$user, 'role' => $user['role'] ?? null]);
}

// 2. Создание задачи
if ($action == 'create_task') {
    $sql = "INSERT INTO tasks (title, start_date, end_date, requirements, status) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['title'], $data['start_date'], $data['end_date'], $data['requirements'], $data['status']]);
    echo json_encode(['success' => true]);
}

// 3. Получение списка задач
if ($action == 'get_tasks') {
    $stmt = $pdo->query("SELECT * FROM tasks ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// 4. Регистрация специалиста
if ($action == 'register_specialist') {
    $sql = "INSERT INTO specialists (first_name, last_name, phone, specialization) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['first_name'], $data['last_name'], $data['phone'], $data['specialization']]);
    echo json_encode(['success' => true]);
}
?>