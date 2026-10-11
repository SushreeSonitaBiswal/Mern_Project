package com.careconnect.repository;

import com.careconnect.entity.Doctor;
import com.careconnect.entity.DoctorStatus;
import com.careconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByStatus(DoctorStatus status);

    @Query("SELECT d FROM Doctor d WHERE d.status = :status AND " +
           "(:deptId IS NULL OR d.department.id = :deptId) AND " +
           "(:query IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Doctor> searchDoctors(
            @Param("status") DoctorStatus status,
            @Param("deptId") Long deptId,
            @Param("query") String query,
            Pageable pageable
    );
}
