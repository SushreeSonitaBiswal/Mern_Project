package com.careconnect.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private String dosage; // e.g. "500mg"

    @Column(nullable = false)
    private String frequency; // e.g. "1-0-1" or "Twice daily"

    @Column(nullable = false)
    private String duration; // e.g. "5 days"

    private String instructions; // e.g. "After meals"
}
