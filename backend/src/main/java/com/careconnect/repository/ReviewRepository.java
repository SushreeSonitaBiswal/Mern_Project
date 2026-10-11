package com.careconnect.repository;

import com.careconnect.entity.Doctor;
import com.careconnect.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctorOrderByCreatedAtDesc(Doctor doctor);
    Optional<Review> findByAppointmentId(Long appointmentId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctor = :doctor")
    Double calculateAverageRatingForDoctor(@Param("doctor") Doctor doctor);
}
