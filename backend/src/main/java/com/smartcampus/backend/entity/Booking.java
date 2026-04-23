package com.smartcampus.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many bookings → One resource
    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    @NotNull(message = "Resource is required")
    private Resource resource;

    @NotBlank(message = "Booked by is required")
    @Size(max = 100, message = "Booked by must be less than 100 characters")
    private String bookedBy;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @Size(max = 500, message = "Rejection reason must be less than 500 characters")
    private String rejectionReason;

    // Validation method to ensure startTime is before endTime
    @AssertTrue(message = "Start time must be before end time")
    public boolean isTimeRangeValid() {
        if (startTime == null || endTime == null) {
            return true; // Will be validated by @NotNull
        }
        return startTime.isBefore(endTime);
    }
}