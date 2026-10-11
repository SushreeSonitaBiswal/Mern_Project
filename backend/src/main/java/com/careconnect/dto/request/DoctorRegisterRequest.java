package com.careconnect.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DoctorRegisterRequest {

    @NotBlank(message = "Doctor full name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;
    private Long departmentId;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String bio;
}
