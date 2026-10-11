package com.careconnect.config;

import com.careconnect.entity.*;
import com.careconnect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with user records.");
            return;
        }

        log.info("Seeding initial CareConnect database records...");

        // 1. Seed Admin
        User adminUser = User.builder()
                .email("admin@careconnect.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        userRepository.save(adminUser);

        // 2. Seed Departments
        Department cardiology = departmentRepository.save(Department.builder()
                .name("Cardiology")
                .iconName("Heart")
                .description("Heart and cardiovascular care")
                .build());

        Department neurology = departmentRepository.save(Department.builder()
                .name("Neurology")
                .iconName("Brain")
                .description("Brain and nervous system disorders")
                .build());

        Department pediatrics = departmentRepository.save(Department.builder()
                .name("Pediatrics")
                .iconName("Baby")
                .description("Infant, child and teen health")
                .build());

        Department orthopedics = departmentRepository.save(Department.builder()
                .name("Orthopedics")
                .iconName("Activity")
                .description("Joint, bone and sports injury care")
                .build());

        // 3. Seed Doctors
        User docUser1 = userRepository.save(User.builder()
                .email("raj.kumar@careconnect.com")
                .password(passwordEncoder.encode("Doctor@123"))
                .role(Role.ROLE_DOCTOR)
                .enabled(true)
                .build());

        Doctor doc1 = doctorRepository.save(Doctor.builder()
                .user(docUser1)
                .name("Dr. Raj Kumar")
                .phone("+91 98765 43210")
                .department(cardiology)
                .specialization("Cardiologist")
                .qualification("MBBS, MD (Cardiology)")
                .experienceYears(12)
                .consultationFee(new BigDecimal("800.00"))
                .status(DoctorStatus.APPROVED)
                .averageRating(4.9)
                .totalReviews(128)
                .bio("Senior Consultant Cardiologist specializing in preventative heart health.")
                .build());

        // Doctor Availability (Mon to Fri: 9:00 AM - 1:00 PM, 30 min slots)
        for (DayOfWeek day : List.of(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)) {
            availabilityRepository.save(DoctorAvailability.builder()
                    .doctor(doc1)
                    .dayOfWeek(day)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(13, 0))
                    .slotDurationMinutes(30)
                    .active(true)
                    .build());
        }

        User docUser2 = userRepository.save(User.builder()
                .email("ananya.sen@careconnect.com")
                .password(passwordEncoder.encode("Doctor@123"))
                .role(Role.ROLE_DOCTOR)
                .enabled(true)
                .build());

        Doctor doc2 = doctorRepository.save(Doctor.builder()
                .user(docUser2)
                .name("Dr. Ananya Sen")
                .phone("+91 98765 43211")
                .department(neurology)
                .specialization("Neurologist")
                .qualification("MBBS, DM (Neurology)")
                .experienceYears(9)
                .consultationFee(new BigDecimal("1000.00"))
                .status(DoctorStatus.APPROVED)
                .averageRating(4.8)
                .totalReviews(94)
                .bio("Specialist in migraine management, nerve conduction and stroke rehabilitation.")
                .build());

        for (DayOfWeek day : List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)) {
            availabilityRepository.save(DoctorAvailability.builder()
                    .doctor(doc2)
                    .dayOfWeek(day)
                    .startTime(LocalTime.of(10, 0))
                    .endTime(LocalTime.of(14, 0))
                    .slotDurationMinutes(30)
                    .active(true)
                    .build());
        }

        // 4. Seed Patient
        User patientUser = userRepository.save(User.builder()
                .email("rahul.sharma@careconnect.com")
                .password(passwordEncoder.encode("Patient@123"))
                .role(Role.ROLE_PATIENT)
                .enabled(true)
                .build());

        Patient patient = patientRepository.save(Patient.builder()
                .user(patientUser)
                .name("Rahul Sharma")
                .phone("+91 98111 22233")
                .gender("Male")
                .bloodGroup("O+")
                .dob(LocalDate.of(1995, 4, 12))
                .address("Bhubaneswar, Odisha")
                .emergencyContact("+91 98222 33344 (Father)")
                .build());

        // 5. Seed Confirmed Appointment
        Appointment appt1 = appointmentRepository.save(Appointment.builder()
                .patient(patient)
                .doctor(doc1)
                .appointmentDate(LocalDate.now().plusDays(2))
                .appointmentTime(LocalTime.of(10, 30))
                .durationMinutes(30)
                .status(AppointmentStatus.CONFIRMED)
                .symptoms("Mild chest discomfort after morning jogs.")
                .build());

        // 6. Seed Completed Appointment with Prescription
        Appointment appt2 = appointmentRepository.save(Appointment.builder()
                .patient(patient)
                .doctor(doc1)
                .appointmentDate(LocalDate.now().minusDays(5))
                .appointmentTime(LocalTime.of(11, 0))
                .durationMinutes(30)
                .status(AppointmentStatus.COMPLETED)
                .symptoms("Routine blood pressure checkup.")
                .doctorNotes("Blood pressure well managed.")
                .build());

        Prescription prescription = Prescription.builder()
                .appointment(appt2)
                .diagnosis("Essential Hypertension - Mild")
                .advice("Low sodium diet, brisk walking for 30 minutes daily.")
                .build();

        prescription.addItem(PrescriptionItem.builder()
                .medicineName("Amlodipine 5mg")
                .dosage("5mg")
                .frequency("Once daily (Morning)")
                .duration("30 days")
                .instructions("After breakfast")
                .build());

        prescriptionRepository.save(prescription);

        log.info("CareConnect seed data inserted successfully!");
    }
}
