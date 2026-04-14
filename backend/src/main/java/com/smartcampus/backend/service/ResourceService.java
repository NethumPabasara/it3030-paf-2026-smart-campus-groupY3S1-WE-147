package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource createResource(Resource resource) {
    return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updatedResource) {
    Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resource not found"));

    resource.setName(updatedResource.getName());
    resource.setType(updatedResource.getType());
    resource.setCapacity(updatedResource.getCapacity());
    resource.setLocation(updatedResource.getLocation());
    resource.setStatus(updatedResource.getStatus());

    return resourceRepository.save(resource);
    }

}