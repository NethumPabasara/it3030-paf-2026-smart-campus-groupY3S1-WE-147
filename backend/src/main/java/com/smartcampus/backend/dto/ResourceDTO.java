package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.enums.ResourceStatus;
import com.smartcampus.backend.model.enums.ResourceType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {

    private Long id;
    private String name;
    private ResourceType type;
    private int capacity;
    private String location;
    private ResourceStatus status;
}