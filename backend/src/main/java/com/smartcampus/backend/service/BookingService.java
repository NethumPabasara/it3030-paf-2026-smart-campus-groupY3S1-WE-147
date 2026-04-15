package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.exception.BookingConflictException;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;
import com.smartcampus.backend.dto.BookingDTO;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingDTO createBooking(Booking booking) {

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

    // SAVE booking
    Booking saved = bookingRepository.save(booking);

    // 🔥 CONVERT TO DTO
    BookingDTO dto = new BookingDTO();
    dto.setId(saved.getId());
    dto.setResourceId(saved.getResource().getId());
    dto.setBookedBy(saved.getBookedBy());
    dto.setStartTime(saved.getStartTime());
    dto.setEndTime(saved.getEndTime());

    return dto;
}
}