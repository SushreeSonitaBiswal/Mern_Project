package com.careconnect.repository;

import com.careconnect.entity.Doctor;
import com.careconnect.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorAndActiveTrue(Doctor doctor);
    Optional<DoctorAvailability> findByDoctorAndDayOfWeekAndActiveTrue(Doctor doctor, DayOfWeek dayOfWeek);
    List<DoctorAvailability> findByDoctorId(Long doctorId);
}
