package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.BookingDTO;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.service.BookingService;

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
    public BookingDTO createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // GET ALL
    @GetMapping
    public List<BookingDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public BookingDTO getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return "Booking deleted successfully";
    }

    // UPDATE
    @PutMapping("/{id}")
    public BookingDTO updateBooking(
            @PathVariable Long id,
            @RequestBody Booking booking) {
        return bookingService.updateBooking(id, booking);
    }

    // 🔥 APPROVE
    @PutMapping("/{id}/approve")
    public Booking approve(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    // 🔥 REJECT
    @PutMapping("/{id}/reject")
    public Booking reject(@PathVariable Long id,
            @RequestParam String reason) {
        return bookingService.rejectBooking(id, reason);
    }

    // 🔥 CANCEL
    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }
}