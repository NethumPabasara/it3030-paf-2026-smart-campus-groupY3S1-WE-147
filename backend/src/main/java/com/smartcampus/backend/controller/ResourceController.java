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

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

   @PostMapping
    public Resource createResource(@Valid @RequestBody Resource resource) {
    return resourceService.createResource(resource);
    }

    @PutMapping("/{id}")
        public Resource updateResource(
        @PathVariable Long id,
        @Valid @RequestBody Resource resource) {
    return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable Long id) {
    resourceService.deleteResource(id);
    return "Resource deleted successfully";
    }
}