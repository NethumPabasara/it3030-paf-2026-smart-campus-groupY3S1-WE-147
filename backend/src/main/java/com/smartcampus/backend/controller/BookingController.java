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

    @PostMapping
    public BookingDTO createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<BookingDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public BookingDTO getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }
}