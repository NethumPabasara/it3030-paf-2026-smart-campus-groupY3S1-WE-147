package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.BookingStatus;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.dto.BookingDTO;
import com.smartcampus.backend.exception.BookingConflictException;
import com.smartcampus.backend.exception.BookingNotFoundException;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository,
            ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    // 🔥 CREATE BOOKING
    public BookingDTO createBooking(Booking booking) {

        // 🔥 CHECK CONFLICT
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        booking.getResource().getId(),
                        booking.getEndTime(),
                        booking.getStartTime());

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource already booked for this time slot");
        }

        // 🔥 SET DEFAULT STATUS
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        return convertToDTO(saved);
    }

    // 🔥 GET ALL
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // 🔥 GET BY ID
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        return convertToDTO(booking);
    }

    // 🔥 DELETE
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        bookingRepository.delete(booking);
    }

    // 🔥 UPDATE
    public BookingDTO updateBooking(Long id, Booking updatedBooking) {

        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        // 🔥 CHECK CONFLICT
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        updatedBooking.getResource().getId(),
                        updatedBooking.getEndTime(),
                        updatedBooking.getStartTime());

        conflicts.removeIf(b -> b.getId().equals(id));

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource already booked for this time slot");
        }

        Resource resource = resourceRepository.findById(
                updatedBooking.getResource().getId()).orElseThrow(() -> new RuntimeException("Resource not found"));

        existing.setResource(resource);
        existing.setBookedBy(updatedBooking.getBookedBy());
        existing.setStartTime(updatedBooking.getStartTime());
        existing.setEndTime(updatedBooking.getEndTime());

        Booking saved = bookingRepository.save(existing);

        return convertToDTO(saved);
    }

    // 🔥 APPROVE
    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        return bookingRepository.save(booking);
    }

    // 🔥 REJECT
    public Booking rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);

        return bookingRepository.save(booking);
    }

    // 🔥 CANCEL
    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    // 🔥 DTO CONVERSION
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
}