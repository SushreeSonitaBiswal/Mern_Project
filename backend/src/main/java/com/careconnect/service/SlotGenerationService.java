package com.careconnect.service;

import com.careconnect.dto.response.TimeSlotResponse;
import com.careconnect.entity.Appointment;
import com.careconnect.entity.AppointmentStatus;
import com.careconnect.entity.Doctor;
import com.careconnect.entity.DoctorAvailability;
import com.careconnect.repository.AppointmentRepository;
import com.careconnect.repository.DoctorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotGenerationService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    public List<TimeSlotResponse> getAvailableSlotsForDate(Doctor doctor, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        var availabilityOpt = availabilityRepository.findByDoctorAndDayOfWeekAndActiveTrue(doctor, dayOfWeek);

        if (availabilityOpt.isEmpty()) {
            return List.of();
        }

        DoctorAvailability availability = availabilityOpt.get();
        int slotDuration = availability.getSlotDurationMinutes() != null ? availability.getSlotDurationMinutes() : 30;

        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorAndAppointmentDateAndStatusNot(
                doctor,
                date,
                AppointmentStatus.CANCELLED
        );

        Set<LocalTime> bookedTimes = bookedAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.REJECTED)
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toSet());

        List<TimeSlotResponse> slots = new ArrayList<>();
        LocalTime current = availability.getStartTime();
        LocalTime end = availability.getEndTime();

        while (current.plusMinutes(slotDuration).isBefore(end) || current.plusMinutes(slotDuration).equals(end)) {
            boolean isBooked = bookedTimes.contains(current);
            boolean isPast = date.equals(LocalDate.now()) && current.isBefore(LocalTime.now());

            boolean isAvailable = !isBooked && !isPast;
            String reason = isBooked ? "Booked" : (isPast ? "Past Slot" : "Available");

            slots.add(TimeSlotResponse.builder()
                    .time(current)
                    .formattedTime(current.format(TIME_FORMATTER))
                    .available(isAvailable)
                    .reason(reason)
                    .build());

            current = current.plusMinutes(slotDuration);
        }

        return slots;
    }
}
