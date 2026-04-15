package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.exception.BookingConflictException;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {

        // 🔥 CHECK CONFLICT
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        booking.getResource().getId(),
                        booking.getEndTime(),
                        booking.getStartTime()
                );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource already booked for this time slot");
        }

        return bookingRepository.save(booking);
    }
}