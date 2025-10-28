package com.backend.IMS.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.IMS.entity.ProductSupplier;

@Repository
public interface ProductSupplierRepository extends JpaRepository<ProductSupplier, Long> {

    List<ProductSupplier> findBySupplier_SupplierId(Long supplierId);

    Optional<ProductSupplier> findByProductName(String productName);

    Optional<ProductSupplier> findByProductNameAndSupplier_SupplierId(String productName, Long supplierId);
}
