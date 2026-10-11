package com.careconnect.service;

import com.careconnect.entity.Appointment;
import com.careconnect.entity.AppointmentStatus;
import com.careconnect.entity.Prescription;
import com.careconnect.entity.PrescriptionItem;
import com.careconnect.exception.ResourceNotFoundException;
import com.careconnect.repository.AppointmentRepository;
import com.careconnect.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public Prescription createPrescription(Long appointmentId, String diagnosis, String advice, List<PrescriptionItem> items) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .diagnosis(diagnosis)
                .advice(advice)
                .build();

        if (items != null) {
            for (PrescriptionItem item : items) {
                prescription.addItem(item);
            }
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return prescriptionRepository.save(prescription);
    }

    public Prescription getPrescriptionByAppointmentId(Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found for appointment: " + appointmentId));
    }
}
