package com.careconnect.controller;

import com.careconnect.dto.response.ApiResponse;
import com.careconnect.entity.Appointment;
import com.careconnect.entity.Department;
import com.careconnect.entity.Doctor;
import com.careconnect.entity.DoctorStatus;
import com.careconnect.repository.DepartmentRepository;
import com.careconnect.service.AppointmentService;
import com.careconnect.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final DepartmentRepository departmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctorService.getAllDoctors().size());
        stats.put("totalAppointments", appointmentService.getAllAppointments().size());
        stats.put("totalDepartments", departmentRepository.count());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAllDoctors()));
    }

    @PatchMapping("/doctors/{id}/status")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctorStatus(
            @PathVariable Long id,
            @RequestParam DoctorStatus status
    ) {
        Doctor updated = doctorService.updateDoctorStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Doctor status updated", updated));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getAllAppointments()));
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department department) {
        Department saved = departmentRepository.save(department);
        return ResponseEntity.ok(ApiResponse.success("Department created", saved));
    }
}
