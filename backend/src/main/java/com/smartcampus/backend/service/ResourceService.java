package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceDTO;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    private ResourceDTO mapToDTO(Resource resource) {
    return new ResourceDTO(
            resource.getId(),
            resource.getName(),
            resource.getType(),
            resource.getCapacity(),
            resource.getLocation(),
            resource.getStatus()
    );
    }

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<ResourceDTO> getAllResources() {
    return resourceRepository.findAll()
            .stream()
            .map(this::mapToDTO)
            .toList();
   }

    public ResourceDTO getResourceById(Long id) {
    Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

    return mapToDTO(resource);
   }

    public ResourceDTO createResource(Resource resource) {
    Resource saved = resourceRepository.save(resource);
    return mapToDTO(saved);
   }

    public ResourceDTO updateResource(Long id, Resource updatedResource) {
    Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

    resource.setName(updatedResource.getName());
    resource.setType(updatedResource.getType());
    resource.setCapacity(updatedResource.getCapacity());
    resource.setLocation(updatedResource.getLocation());
    resource.setStatus(updatedResource.getStatus());

    Resource saved = resourceRepository.save(resource);
    return mapToDTO(saved);
    }

    public void deleteResource(Long id) {
    Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

    resourceRepository.delete(resource);
    }

}