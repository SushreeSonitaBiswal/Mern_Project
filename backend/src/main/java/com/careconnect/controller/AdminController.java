package com.careconnect.controller;

import com.careconnect.dto.response.ApiResponse;
import com.careconnect.entity.Appointment;
import com.careconnect.entity.Department;
import com.careconnect.entity.Doctor;
import com.careconnect.entity.DoctorStatus;
import com.careconnect.repository.DepartmentRepository;
import com.careconnect.repository.PatientRepository;
import com.careconnect.service.AppointmentService;
import com.careconnect.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final DepartmentRepository departmentRepository;
    private final PatientRepository patientRepository;
    private final com.careconnect.service.AuthService authService;

    /**
     * Admin Home / Landing overview endpoint
     */
    @GetMapping({"/home", "/dashboard"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminHome() {
        Map<String, Object> homeData = new HashMap<>();
        List<Doctor> doctors = doctorService.getAllDoctors();
        List<Appointment> appointments = appointmentService.getAllAppointments();
        
        homeData.put("totalDoctors", doctors.size());
        homeData.put("totalAppointments", appointments.size());
        homeData.put("totalPatients", patientRepository.count());
        homeData.put("totalDepartments", departmentRepository.count());
        homeData.put("pendingDoctors", doctors.stream().filter(d -> d.getStatus() == DoctorStatus.PENDING).count());
        homeData.put("recentAppointments", appointments.stream().limit(5).toList());
        return ResponseEntity.ok(ApiResponse.success("Admin Home data loaded", homeData));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctorService.getAllDoctors().size());
        stats.put("totalAppointments", appointmentService.getAllAppointments().size());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDepartments", departmentRepository.count());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAllDoctors()));
    }

    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<Doctor>> createDoctorByAdmin(
            @Valid @RequestBody com.careconnect.dto.request.DoctorRegisterRequest request
    ) {
        Doctor created = authService.registerDoctor(request, DoctorStatus.APPROVED);
        return ResponseEntity.ok(ApiResponse.success("Doctor onboarded and approved successfully", created));
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
