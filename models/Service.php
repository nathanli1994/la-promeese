<?php

class Service {
    private $db;
    public function __construct($db) {
        $this->db = $db;
    }
    public function services($free) {
        $sql = 'SELECT * FROM services WHERE is_free = :free';
        $pdostmt = $this->db->prepare($sql);
        $pdostmt->bindValue(':free', $free, PDO::PARAM_INT);
        $pdostmt->execute();
        $services = $pdostmt->fetchAll(PDO::FETCH_ASSOC);
        return $services;
    }
    
    public function subServices($service_id) {
        if (in_array($service_id, array('5', '6'))) {
            $service_id = 5;
        }
        $sql = 'SELECT * FROM sub_services WHERE service_id = :service_id';
        $pdostmt = $this->db->prepare($sql);
        $pdostmt->bindValue(':service_id', $service_id, PDO::PARAM_INT);
        $pdostmt->execute();
        $subServices = $pdostmt->fetchAll(PDO::FETCH_ASSOC);
        return $subServices;
    }
    
    public function schoolServices() {
        $sql = 'SELECT * FROM services WHERE id = 5 OR id = 6';
        $pdostmt = $this->db->prepare($sql);
        $pdostmt->execute();
        $schoolServices = $pdostmt->fetchAll(PDO::FETCH_ASSOC);
        return $schoolServices;
    }
    
    public function getService($id) {
        $sql = 'SELECT name FROM services WHERE id = :id';
        $pdostmt = $this->db->prepare($sql);
        $pdostmt->bindValue(':id', $id, PDO::PARAM_INT);
        $pdostmt->execute();
        $service = $pdostmt->fetch(PDO::FETCH_ASSOC);
        return $service;
    }
    public function getSubService($id) {
        $sql = 'SELECT name FROM sub_services WHERE id = :id';
        $pdostmt = $this->db->prepare($sql);
        $pdostmt->bindValue(':id', $id, PDO::PARAM_INT);
        $pdostmt->execute();
        $subService = $pdostmt->fetch(PDO::FETCH_ASSOC);
        return $subService;
    }
}