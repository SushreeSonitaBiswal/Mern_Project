package com.careconnect.controller;

import com.careconnect.dto.request.LoginRequest;
import com.careconnect.dto.request.RegisterRequest;
import com.careconnect.dto.response.ApiResponse;
import com.careconnect.dto.response.AuthResponse;
import com.careconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerPatient(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/register-doctor")
    public ResponseEntity<ApiResponse<com.careconnect.entity.Doctor>> registerDoctor(
            @Valid @RequestBody com.careconnect.dto.request.DoctorRegisterRequest request
    ) {
        com.careconnect.entity.Doctor doctor = authService.registerDoctor(request, com.careconnect.entity.DoctorStatus.PENDING);
        return ResponseEntity.ok(ApiResponse.success(
                "Doctor application submitted successfully! Your account will be reviewed and approved by the hospital administrator.",
                doctor
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
