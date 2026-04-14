package com.smartcampus.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Status is required")
    private String status;
}