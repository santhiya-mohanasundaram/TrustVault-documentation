package com.trustvault.service;

import com.trustvault.dto.CategoryDto;
import com.trustvault.entity.Category;
import com.trustvault.exception.BadRequestException;
import com.trustvault.exception.ResourceNotFoundException;
import com.trustvault.repository.CategoryRepository;
import com.trustvault.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DocumentRepository documentRepository;

    public CategoryService(CategoryRepository categoryRepository, DocumentRepository documentRepository) {
        this.categoryRepository = categoryRepository;
        this.documentRepository = documentRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Category getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Category getCategoryEntityByName(String name) {
        return categoryRepository.findByCategoryNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.findByCategoryNameIgnoreCase("Other Documents")
                        .orElseGet(() -> categoryRepository.findAll().stream().findFirst()
                                .orElseThrow(() -> new ResourceNotFoundException("No default category available"))));
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Category name is required");
        }
        if (categoryRepository.existsByCategoryNameIgnoreCase(dto.getName().trim())) {
            throw new BadRequestException("Category '" + dto.getName() + "' already exists");
        }

        Category category = new Category();
        category.setCategoryName(dto.getName().trim());
        category.setDescription(dto.getDescription());
        category.setColor(dto.getColor() != null ? dto.getColor() : "#0f766e");
        category.setBgColor(dto.getBgColor() != null ? dto.getBgColor() : "#ccfbf1");
        category.setIcon(dto.getIcon() != null ? dto.getIcon() : "FaFolder");

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = getCategoryEntity(id);

        if (dto.getName() != null && !dto.getName().trim().equalsIgnoreCase(category.getCategoryName())) {
            if (categoryRepository.existsByCategoryNameIgnoreCase(dto.getName().trim())) {
                throw new BadRequestException("Another category with name '" + dto.getName() + "' already exists");
            }
            category.setCategoryName(dto.getName().trim());
        }

        if (dto.getDescription() != null) category.setDescription(dto.getDescription());
        if (dto.getColor() != null) category.setColor(dto.getColor());
        if (dto.getBgColor() != null) category.setBgColor(dto.getBgColor());
        if (dto.getIcon() != null) category.setIcon(dto.getIcon());

        Category updated = categoryRepository.save(category);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryEntity(id);
        categoryRepository.delete(category);
    }

    public CategoryDto mapToDto(Category c) {
        CategoryDto dto = new CategoryDto();
        dto.setId(c.getId());
        dto.setName(c.getCategoryName());
        dto.setDescription(c.getDescription());
        dto.setColor(c.getColor());
        dto.setBgColor(c.getBgColor());
        dto.setIcon(c.getIcon());
        return dto;
    }
}
