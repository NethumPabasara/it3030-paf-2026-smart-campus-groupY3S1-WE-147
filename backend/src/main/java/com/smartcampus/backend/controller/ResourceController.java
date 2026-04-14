package com.smartcampus.backend.controller;

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
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

   @PostMapping
    public Resource createResource(@Valid @RequestBody Resource resource) {
    return resourceService.createResource(resource);
    }
}