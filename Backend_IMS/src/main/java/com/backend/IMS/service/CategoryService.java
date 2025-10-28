package com.backend.IMS.service;

import com.backend.IMS.dto.CategoryDTO;
import com.backend.IMS.dto.CategoryRequestDTO;
import com.backend.IMS.entity.Category;
import com.backend.IMS.exception.DuplicateResourceException;
import com.backend.IMS.exception.CategoryNotFoundException;
import com.backend.IMS.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    public CategoryDTO createCategory(CategoryRequestDTO request) {
        logger.info("Creating category with name: {}", request.getCategoryName());
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            logger.error("Category already exists with name: {}", request.getCategoryName());
            throw new DuplicateResourceException(
                    "Category already exists with name: " + request.getCategoryName());
        }
        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        category.setProductCount(0);
        Category saved = categoryRepository.save(category);
        logger.info("Category created successfully with id: {}", saved.getCategoryId());
        CategoryDTO dto = new CategoryDTO(
                saved.getCategoryId(),
                saved.getCategoryName(),
                saved.getProductCount()
        );
        return dto;
    }

    public CategoryDTO getCategoryById(Long id) {
        logger.info("Fetching category with id: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Category not found with id: {}", id);
                    return new CategoryNotFoundException("Category not found with id: " + id);
                });
        logger.info("Category fetched successfully: {}", category.getCategoryName());
        return modelMapper.map(category, CategoryDTO.class);
    }

    public List<CategoryDTO> getAllCategories() {
        logger.info("Fetching all categories");
        List<CategoryDTO> categories = categoryRepository.findAll().stream()
                .map(cat -> new CategoryDTO(
                         cat.getCategoryId(),
                        cat.getCategoryName(),
                        cat.getProductCount()  // ensure this value is included
                ))
                .collect(Collectors.toList());
        logger.info("Total categories fetched: {}", categories.size());
        return categories;
    }



    public CategoryDTO updateCategory(Long id, CategoryRequestDTO request) {
        logger.info("Updating category with id: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Category not found with id: {}", id);
                    return new CategoryNotFoundException("Category not found with id: " + id);
                });
        category.setCategoryName(request.getCategoryName());
        Category updated = categoryRepository.save(category);
        logger.info("Category updated successfully with id: {}", updated.getCategoryId());
        return modelMapper.map(updated, CategoryDTO.class);
    }

    public void deleteCategory(Long id) {
        logger.info("Deleting category with id: {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Category not found with id: {}", id);
                    return new CategoryNotFoundException("Category not found with id: " + id);
                });
        categoryRepository.delete(category);
        logger.info("Category deleted successfully: {}", category.getCategoryName());
    }
}
