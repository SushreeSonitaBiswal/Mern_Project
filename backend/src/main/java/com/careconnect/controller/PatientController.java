package com.careconnect.controller;

import com.careconnect.dto.response.ApiResponse;
import com.careconnect.entity.Patient;
import com.careconnect.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.success(patientRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> updateProfile(
            @PathVariable Long id,
            @RequestBody Patient updateReq
    ) {
        return patientRepository.findById(id)
                .map(p -> {
                    p.setName(updateReq.getName());
                    p.setPhone(updateReq.getPhone());
                    p.setGender(updateReq.getGender());
                    p.setBloodGroup(updateReq.getBloodGroup());
                    p.setAddress(updateReq.getAddress());
                    p.setEmergencyContact(updateReq.getEmergencyContact());
                    Patient saved = patientRepository.save(p);
                    return ResponseEntity.ok(ApiResponse.success("Profile updated", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
