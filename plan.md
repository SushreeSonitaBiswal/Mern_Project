# 🏥 CareConnect — Full-Stack Hospital & Appointment Management System
## Comprehensive Master Blueprint & Development Plan

---

## 📌 1. Project Overview & Architecture

**CareConnect** is an enterprise-grade, production-ready Hospital & Appointment Management System designed with **Spring Boot (Java 17/21)**, **React (JSX) + Tailwind CSS**, **Spring Data JPA / Hibernate**, and **MySQL**. It implements a complete **Controller → Service → Repository** architecture with **Spring Security (JWT)** and role-based access control (RBAC).

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (.jsx)                   │
│        Tailwind CSS + React Router v6 + Axios Interceptors  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / REST API (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                SPRING BOOT BACKEND (Java 17/21)             │
│  Security / JWT Filter ──► Controllers ──► Services         │
│                                └──► Repositories (JPA)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Hibernate / JDBC Pool (Hikari)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       MySQL DATABASE                        │
│          Users, Patients, Doctors, Appointments, etc.       │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 2. User Roles & Detailed Matrix

| Feature / Action | 👤 Patient | 👨‍⚕️ Doctor | 👨‍💼 Admin |
| :--- | :---: | :---: | :---: |
| **User Registration / Auth** | ✅ Self Registration | 🔒 Admin-Created / Approved | 🔑 Pre-seeded / System Admin |
| **Doctor Search & Filters** | ✅ Specialization, Rating, Fee, Exp | 👁️ Public View | ✅ Full Management |
| **Availability Management** | 👁️ View Slots | ✅ Weekly Slots & Timings | ✅ Override / View |
| **Book / Cancel Appointment** | ✅ Book & Cancel own | ❌ | ✅ Manage All |
| **Accept / Reject / Complete Appt**| ❌ | ✅ Status Workflow | ✅ Status Override |
| **Prescription & Diagnosis** | 👁️ View / Download | ✅ Create / Edit | 👁️ View History |
| **Doctor Ratings & Reviews** | ✅ Submit for Completed | 👁️ View Feedback | ✅ Moderate Reviews |
| **System Analytics & Reports** | ❌ | 👁️ Own Patient Metrics | ✅ Global Hospital KPIs |
| **Doctor Approval Workflow** | ❌ | ❌ | ✅ Approve / Reject Doctors |

---

## 🗄️ 3. Complete MySQL Database Schema & ERD

```
                  ┌────────────────────────┐
                  │         users          │
                  ├────────────────────────┤
                  │ id (PK, BIGINT)        │
                  │ email (UNIQUE)         │
                  │ password (BCrypt)      │
                  │ role (ADMIN/DOCTOR/...)│
                  │ enabled (BOOLEAN)      │
                  │ created_at, updated_at │
                  └───────────┬────────────┘
                              │ 1:1
              ┌───────────────┴───────────────┐
              ▼                               ▼
  ┌────────────────────────┐      ┌────────────────────────┐
  │        patients        │      │        doctors         │
  ├────────────────────────┤      ├────────────────────────┤
  │ id (PK, BIGINT)        │      │ id (PK, BIGINT)        │
  │ user_id (FK -> users)  │      │ user_id (FK -> users)  │
  │ name, phone            │      │ department_id (FK)     │
  │ gender, dob, blood_grp │      │ name, phone, bio       │
  │ address, emergency_cnt │      │ specialization         │
  │ created_at             │      │ qualification, exp_yrs │
  └───────────┬────────────┘      │ consultation_fee       │
              │                   │ status (PENDING/...)   │
              │ 1:M               └───────────┬────────────┘
              │                               │ 1:M
              │       ┌───────────────────────┤
              │       │ 1:M                   │ 1:M
              │       ▼                       ▼
              │ ┌──────────────────┐  ┌───────────────────────┐
              │ │doctor_availabilty│  │     appointments      │
              │ ├──────────────────┤  ├───────────────────────┤
              │ │ id (PK)          │  │ id (PK, BIGINT)       │
              │ │ doctor_id (FK)   │  │ patient_id (FK)       │
              │ │ day_of_week      │  │ doctor_id (FK)        │
              │ │ start_time       │  │ appt_date, appt_time  │
              │ │ end_time         │  │ slot_duration_min     │
              │ │ slot_duration_min│  │ status (ENUM)         │
              │ │ is_active        │  │ symptoms, notes       │
              │ └──────────────────┘  └───────────┬───────────┘
              │                                   │ 1:1
              │                                   ▼
              │                       ┌───────────────────────┐
              │                       │     prescriptions     │
              │                       ├───────────────────────┤
              │                       │ id (PK, BIGINT)       │
              │                       │ appointment_id (FK)   │
              │                       │ diagnosis (TEXT)      │
              │                       │ advice_instructions   │
              │                       │ created_at            │
              │                       └───────────┬───────────┘
              │                                   │ 1:M
              │                                   ▼
              │                       ┌───────────────────────┐
              │                       │   prescription_items  │
              │                       ├───────────────────────┤
              │                       │ id (PK, BIGINT)       │
              │                       │ prescription_id (FK)  │
              │                       │ medicine_name, dosage │
              │                       │ frequency, duration   │
              │                       └───────────────────────┘
              │                                   ▲
              │ 1:M                               │
              └───────────────┬───────────────────┘
                              ▼
                  ┌────────────────────────┐
                  │        reviews         │
                  ├────────────────────────┤
                  │ id (PK, BIGINT)        │
                  │ appointment_id (FK)    │
                  │ patient_id (FK)        │
                  │ doctor_id (FK)         │
                  │ rating (1-5)           │
                  │ comment (TEXT)         │
                  │ created_at             │
                  └────────────────────────┘
```

---

## 📁 4. Project Directory Structure

```text
careconnect/
├── plan.md
├── careconnect-backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/careconnect/
│       │   │   ├── CareConnectApplication.java
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java
│       │   │   │   └── SwaggerConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── DoctorController.java
│       │   │   │   ├── PatientController.java
│       │   │   │   ├── AppointmentController.java
│       │   │   │   ├── PrescriptionController.java
│       │   │   │   ├── ReviewController.java
│       │   │   │   ├── DepartmentController.java
│       │   │   │   └── AdminController.java
│       │   │   ├── dto/
│       │   │   │   ├── request/
│       │   │   │   │   ├── LoginRequest.java
│       │   │   │   │   ├── RegisterRequest.java
│       │   │   │   │   ├── AppointmentBookingRequest.java
│       │   │   │   │   ├── AppointmentStatusUpdateRequest.java
│       │   │   │   │   ├── AvailabilityRequest.java
│       │   │   │   │   ├── PrescriptionRequest.java
│       │   │   │   │   ├── ReviewRequest.java
│       │   │   │   │   └── DoctorProfileUpdateRequest.java
│       │   │   │   └── response/
│       │   │   │       ├── AuthResponse.java
│       │   │   │       ├── ApiResponse.java
│       │   │   │       ├── DoctorCardResponse.java
│       │   │   │       ├── DoctorDetailResponse.java
│       │   │   │       ├── AppointmentResponse.java
│       │   │   │       ├── TimeSlotResponse.java
│       │   │   │       ├── PrescriptionResponse.java
│       │   │   │       └── AdminStatsResponse.java
│       │   │   ├── entity/
│       │   │   │   ├── User.java
│       │   │   │   ├── Role.java (Enum: ROLE_PATIENT, ROLE_DOCTOR, ROLE_ADMIN)
│       │   │   │   ├── Patient.java
│       │   │   │   ├── Doctor.java
│       │   │   │   ├── DoctorStatus.java (Enum: PENDING, APPROVED, REJECTED, SUSPENDED)
│       │   │   │   ├── Department.java
│       │   │   │   ├── DoctorAvailability.java
│       │   │   │   ├── Appointment.java
│       │   │   │   ├── AppointmentStatus.java (Enum: REQUESTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED)
│       │   │   │   ├── Prescription.java
│       │   │   │   ├── PrescriptionItem.java
│       │   │   │   └── Review.java
│       │   │   ├── exception/
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   ├── BadRequestException.java
│       │   │   │   ├── UnauthorizedException.java
│       │   │   │   └── SlotAlreadyBookedException.java
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── PatientRepository.java
│       │   │   │   ├── DoctorRepository.java
│       │   │   │   ├── DepartmentRepository.java
│       │   │   │   ├── DoctorAvailabilityRepository.java
│       │   │   │   ├── AppointmentRepository.java
│       │   │   │   ├── PrescriptionRepository.java
│       │   │   │   └── ReviewRepository.java
│       │   │   ├── security/
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   └── UserPrincipal.java
│       │   │   └── service/
│       │   │       ├── AuthService.java
│       │   │       ├── PatientService.java
│       │   │       ├── DoctorService.java
│       │   │       ├── AppointmentService.java
│       │   │       ├── SlotGenerationService.java
│       │   │       ├── PrescriptionService.java
│       │   │       ├── ReviewService.java
│       │   │       ├── DepartmentService.java
│       │   │       └── AdminService.java
│       │   └── resources/
│       │       ├── application.properties
│       │       └── data.sql (Initial mock seed data)
│
└── careconnect-frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js (or create-react-app config)
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── assets/
        ├── context/
        │   ├── AuthContext.jsx
        │   └── NotificationContext.jsx
        ├── routes/
        │   ├── AppRoutes.jsx
        │   └── ProtectedRoute.jsx
        ├── services/
        │   ├── api.js (Axios instance with JWT interceptor)
        │   ├── authService.js
        │   ├── patientService.js
        │   ├── doctorService.js
        │   ├── appointmentService.js
        │   ├── prescriptionService.js
        │   └── adminService.js
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Sidebar.jsx
        │   │   ├── Footer.jsx
        │   │   ├── StatusBadge.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Loader.jsx
        │   │   ├── StarRating.jsx
        │   │   └── Pagination.jsx
        │   ├── doctor/
        │   │   ├── DoctorCard.jsx
        │   │   ├── SlotPicker.jsx
        │   │   └── AvailabilityScheduler.jsx
        │   ├── appointment/
        │   │   ├── AppointmentCard.jsx
        │   │   └── AppointmentTable.jsx
        │   └── prescription/
        │       ├── PrescriptionForm.jsx
        │       └── PrescriptionViewModal.jsx
        └── pages/
            ├── public/
            │   ├── Home.jsx
            │   ├── FindDoctors.jsx
            │   ├── DoctorProfile.jsx
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   └── NotFound.jsx
            ├── patient/
            │   ├── PatientDashboard.jsx
            │   ├── BookAppointmentPage.jsx
            │   ├── PatientAppointments.jsx
            │   ├── PatientMedicalHistory.jsx
            │   └── PatientProfile.jsx
            ├── doctor/
            │   ├── DoctorDashboard.jsx
            │   ├── DoctorAppointments.jsx
            │   ├── DoctorAvailabilityPage.jsx
            │   ├── DoctorPrescriptions.jsx
            │   └── DoctorProfileSettings.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── ManageDoctors.jsx
                ├── ManagePatients.jsx
                ├── ManageAppointments.jsx
                ├── ManageDepartments.jsx
                └── SystemReports.jsx
```

---

## ⚡ 5. Step-by-Step Implementation Roadmap

```
  ┌──────────────────────────────────────────────────────────┐
  │  PHASE 1: Project Setup & Database Configuration         │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 2: Backend Core Entities, Repositories & Security │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 3: Business Logic Services & REST APIs            │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 4: Frontend Scaffolding, Tailwind & Auth State    │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 5: Public & Patient Portal (.jsx)                 │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 6: Doctor & Consultation Portal (.jsx)            │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 7: Admin Control Center & Analytics (.jsx)        │
  └─────────────────────────────┬────────────────────────────┘
                                │
  ┌─────────────────────────────▼────────────────────────────┐
  │  PHASE 8: End-to-End Integration, Validation & Testing   │
  └──────────────────────────────────────────────────────────┘
```

### Phase 1: Environment & Database Setup
- Configure MySQL schema `careconnect_db` with UTF8MB4 encoding.
- Initialize Spring Boot project with dependencies:
  - Spring Web, Spring Data JPA, Spring Security, MySQL Connector, Validation, Lombok, jjwt.
- Configure `application.properties` (Datasource, JPA DDL auto, JWT secret, server port 8080).

### Phase 2: Core Domain Models, JPA & Security Architecture
- Implement JPA entities with exact relationships (`@OneToOne`, `@OneToMany`, `@ManyToOne`).
- Setup Spring Security 6 with Stateless session management & BCrypt password encoder.
- Implement `JwtTokenProvider`, `JwtAuthenticationFilter`, and custom `UserDetailsService`.
- Create Auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).

### Phase 3: Service Layer & REST Controllers
- **Slot Generation Algorithm**: Dynamically compute available 30-minute time slots excluding already booked/pending appointments for a given date.
- **Appointment Lifecycle Management**: `REQUESTED` ➔ `CONFIRMED` / `REJECTED` ➔ `COMPLETED` / `CANCELLED`.
- **Prescription Service**: Multi-item diagnosis & medicine prescription generation.
- **Review & Rating Service**: Compute dynamic doctor average ratings.
- **Global Exception Handling**: Custom errors (`SlotAlreadyBookedException`, validation handlers).

### Phase 4: Frontend Infrastructure & Tailwind Setup
- Setup React + Vite app with Tailwind CSS configuration.
- Setup custom design system (medical color palettes: slate, emerald, cyan, indigo).
- Implement `api.js` Axios client with automatic `Authorization: Bearer <token>` injection & 401 response interceptor.
- Create `AuthContext` with login/logout/role helpers and `ProtectedRoute` guards.

### Phase 5: Patient Experience & Booking Flow (JSX)
- Responsive Navigation, Hero banner, department browser, doctor search with filters.
- Interactive Slot Picker component showing real-time booked vs available slots.
- Appointment confirmation checkout modal with symptom description input.
- Patient dashboard with stats cards, upcoming appointment timer, cancel option, and prescription viewer.

### Phase 6: Doctor Consultation Suite (JSX)
- Schedule & availability setup (configure daily working hours and break slots).
- Interactive appointment management board (Accept / Decline / Start Consultation).
- Consultation screen with full prescription composer (dynamic medicine row add/remove, dosage presets, diagnosis).

### Phase 7: Admin Command Center (JSX)
- Statistical KPI counters (Total Patients, Verified Doctors, Total Appointments, Completed Consultations).
- Doctor approval & verification workflow (review credentials, approve/suspend).
- Department management (create/edit medical departments).
- Appointment master audit table with search, filter, and status overrides.

### Phase 8: Testing, Polishing & Seed Data
- Seed comprehensive mock data (`data.sql` or DB migration) with predefined Admin, Doctors across departments, and Patients.
- Cross-browser responsive checks, error toasts, empty states, and loading skeletons.

---

## 🔒 6. Security & REST API Specification

### 🔑 Authentication Endpoints
- `POST /api/auth/register` — Register new Patient account.
- `POST /api/auth/login` — Authenticate and receive JWT token + role + profile metadata.
- `GET  /api/auth/me` — Current authenticated session profile.

### 🩺 Doctor Endpoints
- `GET  /api/doctors` — Public: List doctors with pagination (`page`, `size`), search (`query`), specialization, rating filter.
- `GET  /api/doctors/{id}` — Public: Get doctor detailed profile, reviews, and bio.
- `GET  /api/doctors/{id}/slots?date=YYYY-MM-DD` — Public/Patient: Get computed available time slots.
- `PUT  /api/doctor/profile` — Doctor: Update profile details, bio, consultation fee.
- `POST /api/doctor/availability` — Doctor: Set weekly schedule & slot timings.
- `GET  /api/doctor/appointments` — Doctor: Get assigned appointments with date/status filters.
- `PATCH /api/doctor/appointments/{id}/status` — Doctor: Update status (`CONFIRMED`, `REJECTED`, `COMPLETED`).

### 👤 Patient Endpoints
- `GET  /api/patient/dashboard` — Patient: Summary metrics, next upcoming appointment.
- `POST /api/patient/appointments` — Patient: Book appointment for a selected slot.
- `GET  /api/patient/appointments` — Patient: View appointment history.
- `PATCH /api/patient/appointments/{id}/cancel` — Patient: Cancel requested/confirmed appointment.
- `GET  /api/patient/prescriptions/{appointmentId}` — Patient: View/download prescription.
- `POST /api/patient/reviews` — Patient: Submit rating & review for completed appointment.

### 💊 Prescription Endpoints
- `POST /api/prescriptions` — Doctor: Create prescription for an appointment.
- `GET  /api/prescriptions/{appointmentId}` — Doctor/Patient/Admin: Retrieve full prescription details.

### 🛡️ Admin Endpoints
- `GET  /api/admin/stats` — Admin: Aggregated system statistics.
- `GET  /api/admin/doctors` — Admin: List all doctors including pending approval.
- `PATCH /api/admin/doctors/{id}/status` — Admin: Change status (`APPROVED`, `REJECTED`, `SUSPENDED`).
- `GET  /api/admin/appointments` — Admin: Master list of all appointments with filters.
- `POST /api/admin/departments` — Admin: Create medical departments.

---

## 🚀 7. Execution Checklist

- [ ] Initialize master git repository structure with backend and frontend folders.
- [ ] Write Spring Boot backend with complete entity models, DTOs, and Spring Security.
- [ ] Implement smart slot calculation service in backend.
- [ ] Write React JSX frontend with Tailwind CSS and modular component architecture.
- [ ] Integrate Axios API client with global error handling and authentication tokens.
- [ ] Provide initial database seed scripts with test accounts:
  - **Admin**: `admin@careconnect.com` / `Admin@123`
  - **Doctor**: `raj.kumar@careconnect.com` / `Doctor@123`
  - **Patient**: `rahul.sharma@careconnect.com` / `Patient@123`
