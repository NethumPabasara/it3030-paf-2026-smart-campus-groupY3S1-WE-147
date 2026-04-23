package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.BookingStatus;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.dto.BookingDTO;
import com.smartcampus.backend.exception.BookingConflictException;
import com.smartcampus.backend.exception.BookingNotFoundException;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Validated
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository,
            ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    // CREATE BOOKING with validation
    @Transactional
    public BookingDTO createBooking(@Valid Booking booking) {
        validateBookingTimeRange(booking);

        // CHECK CONFLICT
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
                        booking.getResource().getId(),
                        booking.getEndTime(),
                        booking.getStartTime());

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource already booked for this time slot");
        }

        // Validate resource exists
        Resource resource = resourceRepository.findById(booking.getResource().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource", booking.getResource().getId()));

        booking.setResource(resource);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    // GET ALL
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // GET BY ID
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        return convertToDTO(booking);
    }

    // DELETE (cancel instead of delete)
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        // Instead of deleting, mark as cancelled
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    // UPDATE with validation
    @Transactional
    public BookingDTO updateBooking(Long id, @Valid Booking updatedBooking) {
        validateBookingTimeRange(updatedBooking);

        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        // CHECK CONFLICT (excluding current booking)
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
                        updatedBooking.getResource().getId(),
                        updatedBooking.getEndTime(),
                        updatedBooking.getStartTime(),
                        id);

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource already booked for this time slot");
        }

        // Validate resource exists
        Resource resource = resourceRepository.findById(updatedBooking.getResource().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource", updatedBooking.getResource().getId()));

        existing.setResource(resource);
        existing.setBookedBy(updatedBooking.getBookedBy());
        existing.setStartTime(updatedBooking.getStartTime());
        existing.setEndTime(updatedBooking.getEndTime());

        Booking saved = bookingRepository.save(existing);
        return convertToDTO(saved);
    }

    // GET BOOKINGS BY USERNAME
    public List<BookingDTO> getBookingsByUsername(String username) {
        return bookingRepository.findByBookedBy(username)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // GET BOOKINGS BY RESOURCE ID
    public List<BookingDTO> getBookingsByResourceId(Long resourceId) {
        return bookingRepository.findByResourceId(resourceId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // GET ACTIVE BOOKINGS BY USERNAME
    public List<BookingDTO> getActiveBookingsByUsername(String username) {
        return bookingRepository.findByBookedByAndStatusIn(
                username,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // GET ACTIVE BOOKINGS BY RESOURCE ID
    public List<BookingDTO> getActiveBookingsByResourceId(Long resourceId) {
        return bookingRepository.findByResourceIdAndStatusIn(
                resourceId,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // APPROVE
    @Transactional
    public BookingDTO approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        Booking saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    // REJECT
    @Transactional
    public BookingDTO rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);

        Booking saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    // CANCEL
    @Transactional
    public BookingDTO cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    // VALIDATION HELPER METHOD
    private void validateBookingTimeRange(Booking booking) {
        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }

        if (!booking.getStartTime().isBefore(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in the future");
        }
    }

    // DTO CONVERSION
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();

        dto.setId(booking.getId());
        dto.setBookedBy(booking.getBookedBy());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());

        if (booking.getResource() != null) {
            dto.setResourceId(booking.getResource().getId());
            dto.setResourceName(booking.getResource().getName());
        }

        return dto;
    }
}