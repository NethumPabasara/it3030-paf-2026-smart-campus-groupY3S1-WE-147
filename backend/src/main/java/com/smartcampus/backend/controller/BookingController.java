package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.BookingDTO;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody Booking booking) {
        BookingDTO created = bookingService.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    // GET BOOKINGS BY USERNAME
    @GetMapping("/user/{username}")
    public ResponseEntity<List<BookingDTO>> getBookingsByUsername(@PathVariable String username) {
        List<BookingDTO> bookings = bookingService.getBookingsByUsername(username);
        return ResponseEntity.ok(bookings);
    }

    // GET BOOKINGS BY RESOURCE ID
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByResourceId(@PathVariable Long resourceId) {
        List<BookingDTO> bookings = bookingService.getBookingsByResourceId(resourceId);
        return ResponseEntity.ok(bookings);
    }

    // GET ACTIVE BOOKINGS BY USERNAME
    @GetMapping("/user/{username}/active")
    public ResponseEntity<List<BookingDTO>> getActiveBookingsByUsername(@PathVariable String username) {
        List<BookingDTO> bookings = bookingService.getActiveBookingsByUsername(username);
        return ResponseEntity.ok(bookings);
    }

    // GET ACTIVE BOOKINGS BY RESOURCE ID
    @GetMapping("/resource/{resourceId}/active")
    public ResponseEntity<List<BookingDTO>> getActiveBookingsByResourceId(@PathVariable Long resourceId) {
        List<BookingDTO> bookings = bookingService.getActiveBookingsByResourceId(resourceId);
        return ResponseEntity.ok(bookings);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody Booking booking) {
        BookingDTO updated = bookingService.updateBooking(id, booking);
        return ResponseEntity.ok(updated);
    }

    // DELETE (cancel instead of delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    // APPROVE
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingDTO> approve(@PathVariable Long id) {
        BookingDTO approved = bookingService.approveBooking(id);
        return ResponseEntity.ok(approved);
    }

    // REJECT
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingDTO> reject(@PathVariable Long id,
            @RequestParam String reason) {
        BookingDTO rejected = bookingService.rejectBooking(id, reason);
        return ResponseEntity.ok(rejected);
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancel(@PathVariable Long id) {
        BookingDTO cancelled = bookingService.cancelBooking(id);
        return ResponseEntity.ok(cancelled);
    }
}