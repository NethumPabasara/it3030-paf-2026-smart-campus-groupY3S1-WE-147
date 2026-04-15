package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 🔥 CHECK overlapping bookings
    List<Booking> findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long resourceId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}