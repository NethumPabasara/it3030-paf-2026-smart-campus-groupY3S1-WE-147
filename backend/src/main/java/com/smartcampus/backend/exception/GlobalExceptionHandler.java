package com.smartcampus.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.smartcampus.backend.exception.BookingConflictException;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, List<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {

        List<String> errors = new ArrayList<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.add(error.getDefaultMessage())
        );

        Map<String, List<String>> response = new HashMap<>();
        response.put("errors", errors);

        return response;
    }

    // ✅ ADD THIS (Resource not found)
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleResourceNotFound(ResourceNotFoundException ex) {

        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return error;
    }

    @ExceptionHandler(BookingConflictException.class)
@ResponseStatus(HttpStatus.CONFLICT)
public Map<String, Object> handleBookingConflict(BookingConflictException ex) {

    Map<String, Object> error = new HashMap<>();
    error.put("timestamp", new Date());
    error.put("status", 409);
    error.put("error", "Conflict");
    error.put("message", ex.getMessage());

    return error;
}
    


    @ExceptionHandler(BookingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleBookingNotFound(BookingNotFoundException ex) {

    Map<String, Object> error = new HashMap<>();
    error.put("timestamp", new Date());
    error.put("status", 404);
    error.put("error", "Not Found");
    error.put("message", ex.getMessage());

        return error;
    }

    @ExceptionHandler(Exception.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public Map<String, Object> handleGeneralException(Exception ex) {

    Map<String, Object> error = new HashMap<>();
    error.put("timestamp", new Date());
    error.put("status", 500);
    error.put("error", "Internal Server Error");
    error.put("message", "Something went wrong");

    return error;
}
}