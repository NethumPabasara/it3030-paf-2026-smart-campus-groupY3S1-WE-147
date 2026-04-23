package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // CHECK overlapping bookings - existing bookings that overlap with new time range
    List<Booking> findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
            Long resourceId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    // Find bookings by username
    List<Booking> findByBookedBy(String username);

    // Find bookings by resource ID
    List<Booking> findByResourceId(Long resourceId);

    // Find active bookings by username
    List<Booking> findByBookedByAndStatus(String username, BookingStatus status);

    // Find active bookings by resource ID
    List<Booking> findByResourceIdAndStatus(Long resourceId, BookingStatus status);

    // Find bookings by resource ID and multiple statuses (for active bookings)
    List<Booking> findByResourceIdAndStatusIn(Long resourceId, List<BookingStatus> statuses);

    // Find bookings by username and multiple statuses (for active bookings)
    List<Booking> findByBookedByAndStatusIn(String username, List<BookingStatus> statuses);

    // Check overlapping bookings excluding a specific booking (for updates)
    List<Booking> findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
            Long resourceId,
            LocalDateTime endTime,
            LocalDateTime startTime,
            Long bookingId
    );
}