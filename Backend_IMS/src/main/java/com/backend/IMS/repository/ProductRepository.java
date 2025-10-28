package com.backend.IMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.IMS.entity.Product;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_CategoryName(String categoryName);
    List<Product> findBySupplier_SupplierName(String supplierName);
    boolean existsByProductName(String productName);
    Optional<Product> findByProductName(String productName);

}
