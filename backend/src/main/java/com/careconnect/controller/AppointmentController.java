package com.careconnect.controller;

import com.careconnect.dto.request.AppointmentBookingRequest;
import com.careconnect.dto.response.ApiResponse;
import com.careconnect.entity.Appointment;
import com.careconnect.entity.AppointmentStatus;
import com.careconnect.entity.Prescription;
import com.careconnect.entity.User;
import com.careconnect.repository.UserRepository;
import com.careconnect.service.AppointmentService;
import com.careconnect.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final PrescriptionService prescriptionService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> bookAppointment(
            @Valid @RequestBody AppointmentBookingRequest request,
            Authentication auth
    ) {
        Long userId = getUserId(auth);
        Appointment appt = appointmentService.bookAppointment(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Appointment booked successfully", appt));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Appointment>>> getMyAppointments(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getPatientAppointments(userId)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Appointment>> updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status
    ) {
        Appointment updated = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated", updated));
    }

    @GetMapping("/{id}/prescription")
    public ResponseEntity<ApiResponse<Prescription>> getPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getPrescriptionByAppointmentId(id)));
    }
}
