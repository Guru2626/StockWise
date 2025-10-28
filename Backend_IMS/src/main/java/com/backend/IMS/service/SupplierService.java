package com.backend.IMS.service;

import com.backend.IMS.dto.SupplierDTO;
import com.backend.IMS.dto.SupplierRequestDTO;
import com.backend.IMS.entity.Supplier;
import com.backend.IMS.exception.SupplierNotFoundException;
import com.backend.IMS.repository.SupplierRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private static final Logger logger = LoggerFactory.getLogger(SupplierService.class);

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ModelMapper modelMapper;

    public SupplierDTO createSupplier(SupplierRequestDTO request) {
        logger.info("Creating supplier with name: {}", request.getSupplierName());
        Supplier supplier = modelMapper.map(request, Supplier.class);
        Supplier saved = supplierRepository.save(supplier);
        logger.info("Supplier created successfully with ID: {}", saved.getSupplierId());
        return modelMapper.map(saved, SupplierDTO.class);
    }

    public SupplierDTO getSupplierById(Long id) {
        logger.info("Fetching supplier with ID: {}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Supplier not found with ID: {}", id);
                    return new SupplierNotFoundException("Supplier not found with ID: " + id);
                });
        logger.info("Supplier fetched successfully: {}", supplier.getSupplierName());
        return modelMapper.map(supplier, SupplierDTO.class);
    }

    public List<SupplierDTO> getAllSuppliers() {
        logger.info("Fetching all suppliers");
        List<SupplierDTO> suppliers = supplierRepository.findAll().stream()
                .map(s -> modelMapper.map(s, SupplierDTO.class))
                .collect(Collectors.toList());
        logger.info("Total suppliers fetched: {}", suppliers.size());
        return suppliers;
    }

    public SupplierDTO updateSupplier(Long id, SupplierRequestDTO request) {
        logger.info("Updating supplier with ID: {}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Supplier not found with ID: {}", id);
                    return new SupplierNotFoundException("Supplier not found with ID: " + id);
                });
        supplier.setSupplierName(request.getSupplierName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());
        supplier.setCity(request.getCity());
        Supplier updated = supplierRepository.save(supplier);
        logger.info("Supplier updated successfully with ID: {}", updated.getSupplierId());
        return modelMapper.map(updated, SupplierDTO.class);
    }

    public void deleteSupplier(Long id) {
        logger.info("Deleting supplier with ID: {}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Supplier not found with ID: {}", id);
                    return new SupplierNotFoundException("Supplier not found with ID: " + id);
                });
        supplierRepository.delete(supplier);
        logger.info("Supplier deleted successfully: {}", supplier.getSupplierName());
    }
}
