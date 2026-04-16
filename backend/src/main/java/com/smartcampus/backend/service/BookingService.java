package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.exception.BookingConflictException;
import com.smartcampus.backend.exception.BookingNotFoundException;
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
        dto.setResourceName(saved.getResource().getName());

        return dto;
    }

    public List<BookingDTO> getAllBookings() {
    return bookingRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .toList();
    }

private BookingDTO convertToDTO(Booking booking) {
    BookingDTO dto = new BookingDTO();

    dto.setId(booking.getId());
    dto.setBookedBy(booking.getBookedBy());
    dto.setStartTime(booking.getStartTime());
    dto.setEndTime(booking.getEndTime());

    dto.setResourceId(booking.getResource().getId());
    dto.setResourceName(booking.getResource().getName());

        return dto;
    }

    public BookingDTO getBookingById(Long id) {

    Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        return convertToDTO(booking);
    }
}