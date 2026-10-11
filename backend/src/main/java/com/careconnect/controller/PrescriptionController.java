package com.careconnect.controller;

import com.careconnect.dto.request.PrescriptionCreationRequest;
import com.careconnect.dto.response.ApiResponse;
import com.careconnect.entity.Prescription;
import com.careconnect.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<Prescription>> createPrescription(
            @PathVariable Long appointmentId,
            @Valid @RequestBody PrescriptionCreationRequest request
    ) {
        Prescription saved = prescriptionService.createPrescription(
                appointmentId,
                request.getDiagnosis(),
                request.getAdvice(),
                request.getItems()
        );
        return ResponseEntity.ok(ApiResponse.success("Prescription generated successfully", saved));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ApiResponse<Prescription>> getPrescriptionByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getPrescriptionByAppointmentId(appointmentId)));
    }
}
