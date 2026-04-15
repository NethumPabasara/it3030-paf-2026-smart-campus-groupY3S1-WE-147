package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.ApiResponse;
import com.smartcampus.backend.dto.ResourceDTO;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ApiResponse<List<ResourceDTO>> getAllResources() {
    return new ApiResponse<>(true, resourceService.getAllResources());
   }

    @GetMapping("/{id}")
    public ApiResponse<ResourceDTO> getResourceById(@PathVariable Long id) {
    return new ApiResponse<>(true, resourceService.getResourceById(id));
    }

   @PostMapping
    public ApiResponse<ResourceDTO> createResource(@Valid @RequestBody Resource resource) {
    return new ApiResponse<>(true, resourceService.createResource(resource));
    }

    @PutMapping("/{id}")
        public ApiResponse<ResourceDTO> updateResource(
        @PathVariable Long id,
        @Valid @RequestBody Resource resource) {
    return new ApiResponse<>(true, resourceService.updateResource(id, resource));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteResource(@PathVariable Long id) {
    resourceService.deleteResource(id);
    return new ApiResponse<>(true, "Resource deleted successfully");
    }
}