package com.backend.IMS.service;

import com.backend.IMS.dto.ProductSupplierDTO;
import com.backend.IMS.dto.ProductSupplierRequestDTO;
import com.backend.IMS.entity.Category;
import com.backend.IMS.entity.ProductSupplier;
import com.backend.IMS.entity.Supplier;
import com.backend.IMS.exception.CategoryNotFoundException;
import com.backend.IMS.exception.ProductSupplierNotFoundException;
import com.backend.IMS.exception.SupplierNotFoundException;
import com.backend.IMS.repository.CategoryRepository;
import com.backend.IMS.repository.ProductSupplierRepository;
import com.backend.IMS.repository.SupplierRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductSupplierService {

    private static final Logger logger = LoggerFactory.getLogger(ProductSupplierService.class);

    @Autowired
    private ProductSupplierRepository productSupplierRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ProductSupplierDTO createProductSupplier(ProductSupplierRequestDTO request) {
        logger.info("Creating ProductSupplier: {}", request.getProductName());

        ProductSupplier ps = new ProductSupplier();
        ps.setProductName(request.getProductName());
        ps.setSupplyPrice(request.getSupplyPrice());
        ps.setLeadTimeDays(request.getLeadTimeDays());

        if (request.getCategoryName() != null) {
            Category category = categoryRepository.findByCategoryName(request.getCategoryName())
                    .orElseThrow(() -> {
                        logger.error("Category not found: {}", request.getCategoryName());
                        return new CategoryNotFoundException("Category not found: " + request.getCategoryName());
                    });
            ps.setCategory(category);
        }

        if (request.getSupplierName() != null) {
            Supplier supplier = supplierRepository.findBySupplierName(request.getSupplierName())
                    .orElseThrow(() -> {
                        logger.error("Supplier not found: {}", request.getSupplierName());
                        return new SupplierNotFoundException("Supplier not found: " + request.getSupplierName());
                    });
            ps.setSupplier(supplier);
        }

        ProductSupplier saved = productSupplierRepository.save(ps);
        logger.info("ProductSupplier created successfully with ID: {}", saved.getId());

        ProductSupplierDTO dto = modelMapper.map(saved, ProductSupplierDTO.class);
        if (saved.getCategory() != null) dto.setCategoryName(saved.getCategory().getCategoryName());
        if (saved.getSupplier() != null) dto.setSupplierName(saved.getSupplier().getSupplierName());
        return dto;
    }

    public ProductSupplierDTO getById(Long id) {
        logger.info("Fetching ProductSupplier by ID: {}", id);

        ProductSupplier ps = productSupplierRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("ProductSupplier not found with ID: {}", id);
                    return new ProductSupplierNotFoundException("ProductSupplier not found with ID: " + id);
                });

        ProductSupplierDTO dto = modelMapper.map(ps, ProductSupplierDTO.class);
        if (ps.getCategory() != null) dto.setCategoryName(ps.getCategory().getCategoryName());
        if (ps.getSupplier() != null) dto.setSupplierName(ps.getSupplier().getSupplierName());
        logger.info("ProductSupplier fetched successfully: {}", ps.getProductName());
        return dto;
    }

    public List<ProductSupplierDTO> getAll() {
        logger.info("Fetching all ProductSuppliers");
        List<ProductSupplierDTO> list = productSupplierRepository.findAll().stream().map(ps -> {
            ProductSupplierDTO dto = modelMapper.map(ps, ProductSupplierDTO.class);
            if (ps.getCategory() != null) dto.setCategoryName(ps.getCategory().getCategoryName());
            if (ps.getSupplier() != null) dto.setSupplierName(ps.getSupplier().getSupplierName());
            return dto;
        }).collect(Collectors.toList());
        logger.info("Total ProductSuppliers fetched: {}", list.size());
        return list;
    }

    public ProductSupplierDTO updateProductSupplier(Long id, ProductSupplierRequestDTO request) {
        logger.info("Updating ProductSupplier with ID: {}", id);

        ProductSupplier ps = productSupplierRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("ProductSupplier not found with ID: {}", id);
                    return new ProductSupplierNotFoundException("ProductSupplier not found with ID: " + id);
                });

        if (request.getProductName() != null) ps.setProductName(request.getProductName());
        if (request.getSupplyPrice() != null) ps.setSupplyPrice(request.getSupplyPrice());
        if (request.getLeadTimeDays() != null) ps.setLeadTimeDays(request.getLeadTimeDays());

        if (request.getCategoryName() != null) {
            Category category = categoryRepository.findByCategoryName(request.getCategoryName())
                    .orElseThrow(() -> {
                        logger.error("Category not found: {}", request.getCategoryName());
                        return new CategoryNotFoundException("Category not found: " + request.getCategoryName());
                    });
            ps.setCategory(category);
        }

        if (request.getSupplierName() != null) {
            Supplier supplier = supplierRepository.findBySupplierName(request.getSupplierName())
                    .orElseThrow(() -> {
                        logger.error("Supplier not found: {}", request.getSupplierName());
                        return new SupplierNotFoundException("Supplier not found: " + request.getSupplierName());
                    });
            ps.setSupplier(supplier);
        }

        ProductSupplier updated = productSupplierRepository.save(ps);
        logger.info("ProductSupplier updated successfully with ID: {}", updated.getId());

        ProductSupplierDTO dto = modelMapper.map(updated, ProductSupplierDTO.class);
        if (updated.getCategory() != null) dto.setCategoryName(updated.getCategory().getCategoryName());
        if (updated.getSupplier() != null) dto.setSupplierName(updated.getSupplier().getSupplierName());
        return dto;
    }

    public void deleteProductSupplier(Long id) {
        logger.info("Deleting ProductSupplier with ID: {}", id);

        ProductSupplier ps = productSupplierRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("ProductSupplier not found with ID: {}", id);
                    return new ProductSupplierNotFoundException("ProductSupplier not found with ID: " + id);
                });

        productSupplierRepository.delete(ps);
        logger.info("ProductSupplier deleted successfully: {}", ps.getProductName());
    }
}
