package com.careconnect.service;

import com.careconnect.dto.response.TimeSlotResponse;
import com.careconnect.entity.Doctor;
import com.careconnect.entity.DoctorStatus;
import com.careconnect.exception.ResourceNotFoundException;
import com.careconnect.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final SlotGenerationService slotGenerationService;

    public Page<Doctor> getDoctors(Long departmentId, String query, Pageable pageable) {
        return doctorRepository.searchDoctors(DoctorStatus.APPROVED, departmentId, query, pageable);
    }

    public List<Doctor> getAllApprovedDoctors() {
        return doctorRepository.findByStatus(DoctorStatus.APPROVED);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
    }

    public List<TimeSlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = getDoctorById(doctorId);
        return slotGenerationService.getAvailableSlotsForDate(doctor, date);
    }

    public Doctor updateDoctorStatus(Long id, DoctorStatus status) {
        Doctor doctor = getDoctorById(id);
        doctor.setStatus(status);
        return doctorRepository.save(doctor);
    }
}
