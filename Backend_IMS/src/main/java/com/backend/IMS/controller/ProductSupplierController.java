package com.backend.IMS.controller;

import com.backend.IMS.dto.ProductSupplierDTO;
import com.backend.IMS.dto.ProductSupplierRequestDTO;
import com.backend.IMS.service.ProductSupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-suppliers")
public class ProductSupplierController {

    @Autowired
    private ProductSupplierService productSupplierService;

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    public ResponseEntity<ProductSupplierDTO> create(@RequestBody ProductSupplierRequestDTO request) {
        return ResponseEntity.ok(productSupplierService.createProductSupplier(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping
    public ResponseEntity<List<ProductSupplierDTO>> getAll() {
        return ResponseEntity.ok(productSupplierService.getAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<ProductSupplierDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productSupplierService.getById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductSupplierDTO> update(
            @PathVariable Long id,
            @RequestBody ProductSupplierRequestDTO request) {
        return ResponseEntity.ok(productSupplierService.updateProductSupplier(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        productSupplierService.deleteProductSupplier(id);
        return ResponseEntity.ok("ProductSupplier deleted successfully");
    }
}
