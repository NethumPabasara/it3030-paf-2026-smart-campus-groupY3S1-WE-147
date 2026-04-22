package com.smartcampus.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Many bookings → One resource
    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    private String bookedBy;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
private BookingStatus status;

private String rejectionReason;
}