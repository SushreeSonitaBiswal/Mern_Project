package com.careconnect.dto.request;

import com.careconnect.entity.PrescriptionItem;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class PrescriptionCreationRequest {
    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;
    private String advice;
    private List<PrescriptionItem> items;
}
