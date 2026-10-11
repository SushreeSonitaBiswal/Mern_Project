package com.careconnect.repository;

import com.careconnect.entity.Appointment;
import com.careconnect.entity.AppointmentStatus;
import com.careconnect.entity.Doctor;
import com.careconnect.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByDoctorAndAppointmentDateAndStatusNot(
            Doctor doctor, 
            LocalDate appointmentDate, 
            AppointmentStatus excludedStatus
    );

    Optional<Appointment> findByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Doctor doctor,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            AppointmentStatus excludedStatus
    );

    List<Appointment> findByPatientOrderByAppointmentDateDescAppointmentTimeDesc(Patient patient);

    List<Appointment> findByDoctorOrderByAppointmentDateDescAppointmentTimeDesc(Doctor doctor);

    Page<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc(Pageable pageable);

    long countByStatus(AppointmentStatus status);
}
