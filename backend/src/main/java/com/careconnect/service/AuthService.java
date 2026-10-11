package com.careconnect.service;

import com.careconnect.dto.request.LoginRequest;
import com.careconnect.dto.request.RegisterRequest;
import com.careconnect.dto.response.AuthResponse;
import com.careconnect.entity.Patient;
import com.careconnect.entity.Role;
import com.careconnect.entity.User;
import com.careconnect.repository.DoctorRepository;
import com.careconnect.repository.PatientRepository;
import com.careconnect.repository.UserRepository;
import com.careconnect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerPatient(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_PATIENT)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        Patient patient = Patient.builder()
                .user(user)
                .name(request.getName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .address(request.getAddress())
                .build();
        patient = patientRepository.save(patient);

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(patient.getName())
                .role(user.getRole().name())
                .profileId(patient.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String name = user.getEmail();
        Long profileId = null;

        if (user.getRole() == Role.ROLE_PATIENT) {
            Patient p = patientRepository.findByUser(user).orElse(null);
            if (p != null) {
                name = p.getName();
                profileId = p.getId();
            }
        } else if (user.getRole() == Role.ROLE_DOCTOR) {
            var doc = doctorRepository.findByUser(user).orElse(null);
            if (doc != null) {
                name = doc.getName();
                profileId = doc.getId();
            }
        } else {
            name = "Administrator";
        }

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(name)
                .role(user.getRole().name())
                .profileId(profileId)
                .build();
    }
}
