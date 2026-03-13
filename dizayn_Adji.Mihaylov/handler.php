<?php
include 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

if ($action == 'create_task') {
    $sql = "INSERT INTO tasks (title, start_date, end_date, requirements, status) VALUES (?, ?, ?, ?, 'new')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['title'], $data['start_date'], $data['end_date'], $data['requirements']]);
    echo json_encode(['success' => true]);
}

if ($action == 'register_specialist') {
    $sql = "INSERT INTO specialists (first_name, last_name, phone, specialization) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['first_name'], $data['last_name'], $data['phone'], $data['specialization']]);
    echo json_encode(['success' => true]);
}

if ($action == 'get_tasks') {
    $stmt = $pdo->query("SELECT * FROM tasks ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
?>