package com.backend.IMS.controller;

import com.backend.IMS.dto.CategoryDTO;
import com.backend.IMS.dto.CategoryRequestDTO;
import com.backend.IMS.entity.Category;
import com.backend.IMS.repository.CategoryRepository;
import com.backend.IMS.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody CategoryRequestDTO request) {
        CategoryDTO created = categoryService.createCategory(request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Category created successfully");
        response.put("category", created);

        return ResponseEntity.ok(response);
    }



    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }
}
