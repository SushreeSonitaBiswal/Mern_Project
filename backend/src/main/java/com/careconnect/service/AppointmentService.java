package com.careconnect.service;

import com.careconnect.dto.request.AppointmentBookingRequest;
import com.careconnect.entity.*;
import com.careconnect.exception.ResourceNotFoundException;
import com.careconnect.exception.SlotAlreadyBookedException;
import com.careconnect.repository.AppointmentRepository;
import com.careconnect.repository.DoctorRepository;
import com.careconnect.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Appointment bookAppointment(Long patientUserId, AppointmentBookingRequest request) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + patientUserId));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));

        // Collision check
        var existing = appointmentRepository.findByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor,
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                AppointmentStatus.CANCELLED
        );

        if (existing.isPresent() && existing.get().getStatus() != AppointmentStatus.REJECTED) {
            throw new SlotAlreadyBookedException("This slot is already booked. Please choose another time.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .status(AppointmentStatus.CONFIRMED)
                .symptoms(request.getSymptoms())
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointments(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return appointmentRepository.findByPatientOrderByAppointmentDateDescAppointmentTimeDesc(patient);
    }

    public List<Appointment> getDoctorAppointments(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return appointmentRepository.findByDoctorOrderByAppointmentDateDescAppointmentTimeDesc(doctor);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }
}
