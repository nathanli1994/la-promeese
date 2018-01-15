<?php

require '../models/Database.php';
require '../models/Performance.php';
require '../models/Student.php';

header('Content-Type: application/json');

$pRepo = new Performance(Database::dbConnect());
$sRepo = new Student(Database::dbConnect());

if ($_GET['action'] == 'getPerformances') {
    $performances = $pRepo->performances($_GET['id']);
    foreach ($performances as &$p) {
        $p['semesters'] = $pRepo->semesters($p['id']);
    }
    echo json_encode($performances);
}

if ($_GET['action'] == 'upsertPerformance') {
    $pRepo->upsert($_POST);
    
    $semester = $pRepo->getLatestSemester($_POST['id']);
    $_POST['progress_id'] = $semester['progress_id'];
    
    $allPerformances = $sRepo->allPerformances($_POST['student_id']);
    //need to write function to get school name base on student_id and service_id
    // echo test;
    //check if service_id is 1 or 3, get the latest school
    //if service_id is 2, get all the school which service_id is 2, then implode the array to string and 
    //after getting to do what?
    $schools = $pRepo->getschool($_POST['student_id'],$_POST['service_id']);
    $schoolString = implode(", ", $schools);
    $schoolArray = explode(", ", $schoolString);
    if($_POST['service_id'] === 1 || $_POST['service_id'] === 3 ){
        $schoolsToShow = $schoolArray[0];
        // echo "test1";
    }
    else{
        // echo "test2";
        $schoolsToShow = $schoolString; 
    }
    echo $schoolsToShow;
    var_dump($schoolArray);
    if (count($allPerformances)) {
        // $schools = implode(', ', $allPerformances);   
        $_POST['schools'] = $schoolsToShow;
    }

    
    $sRepo->updateStudent($_POST);
    echo json_encode('ok');
}

if ($_GET['action'] == 'removePerformance') {
    $pRepo->remove($_POST['id']);
    $pRepo->removeSemesters($_POST['id']);
    echo json_encode('ok');
}

if ($_GET['action'] == 'semesters') {
    $semesters = $pRepo->semesters($_GET['id']);
    echo json_encode($semesters);
}

if ($_GET['action'] == 'upsertSemester') {
    $pRepo->upsertSemester($_POST);
    $p = $pRepo->performance($_POST['performance_id']);
    $_POST['service_id'] = $p['service_id'];
    $_POST['employee_id'] = $p['employee_id'];
    $_POST['employee_material_id'] = $p['employee_material_id'];
    $_POST['student_id'] = $p['student_id'];
    
    $sRepo = new Student(Database::dbConnect());
    $sRepo->updateStudent($_POST);
    echo json_encode('ok');
}
if ($_GET['action'] == 'removeSemester') {
    $pRepo->removeSemester($_POST['id']);
    echo json_encode('ok');
}