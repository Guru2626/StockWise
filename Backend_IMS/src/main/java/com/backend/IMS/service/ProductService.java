package com.backend.IMS.service;

import com.backend.IMS.dto.ProductDTO;
import com.backend.IMS.dto.ProductRequestDTO;
import com.backend.IMS.entity.Category;
import com.backend.IMS.entity.Product;
import com.backend.IMS.entity.ProductSupplier;
import com.backend.IMS.entity.Supplier;
import com.backend.IMS.exception.CategoryNotFoundException;
import com.backend.IMS.exception.ProductNotFoundException;
import com.backend.IMS.exception.ProductSupplierNotFoundException;
import com.backend.IMS.exception.SupplierNotFoundException;
import com.backend.IMS.repository.CategoryRepository;
import com.backend.IMS.repository.ProductRepository;
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
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductSupplierRepository productSupplierRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ------------------ CREATE ------------------
    public ProductDTO createProduct(ProductRequestDTO request) {
        logger.info("Creating product: {}", request.getProductName());
        if (productRepository.existsByProductName(request.getProductName())) {
            logger.error("Product already exists: {}", request.getProductName());
            throw new RuntimeException("Product already exists");
        }

        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setMinStock(request.getMinStock() != null ? request.getMinStock() : 10);
        product.setLowStock(product.getQuantityInStock() < product.getMinStock());

        // Handle supplier and price
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> {
                        logger.error("Supplier not found with ID: {}", request.getSupplierId());
                        return new SupplierNotFoundException("Supplier not found with ID: " + request.getSupplierId());
                    });
            product.setSupplier(supplier);

            // Get supply price from ProductSupplier table
            ProductSupplier ps = productSupplierRepository.findByProductNameAndSupplier_SupplierId(
                    request.getProductName(), request.getSupplierId()
            ).orElseThrow(() -> {
                logger.error("ProductSupplier not found for product {} and supplier {}", request.getProductName(), request.getSupplierId());
                return new ProductSupplierNotFoundException("ProductSupplier not found");
            });

            // Set price 10% higher than supplier price
            product.setPrice(ps.getSupplyPrice() * 1.1);
        } else {
            // Fallback: use price from request if no supplier is given
            product.setPrice(request.getPrice());
        }

        // Handle category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> {
                        logger.error("Category not found with ID: {}", request.getCategoryId());
                        return new CategoryNotFoundException("Category not found with ID: " + request.getCategoryId());
                    });
            product.setCategory(category);


            category.setProductCount(category.getProductCount() + 1);
            categoryRepository.save(category);
        }

        Product saved = productRepository.save(product);
        logger.info("Product created successfully with ID: {}", saved.getProductId());
        ProductDTO dto = modelMapper.map(saved, ProductDTO.class);
        if (saved.getCategory() != null) dto.setCategoryName(saved.getCategory().getCategoryName());
        if (saved.getSupplier() != null) dto.setSupplierName(saved.getSupplier().getSupplierName());
        return dto;
    }

    // ------------------ PARTIAL UPDATE ------------------
    public ProductDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Product not found with ID: {}", id);
                    return new ProductNotFoundException("Product not found with ID: " + id);
                });

        if (request.getProductName() != null) product.setProductName(request.getProductName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());

        // Add quantity to stock instead of overwriting
        if (request.getQuantityInStock() != null) {
            Integer currentStock = product.getQuantityInStock() == null ? 0 : product.getQuantityInStock();
            product.setQuantityInStock(currentStock + request.getQuantityInStock());
        }

        if (request.getMinStock() != null) product.setMinStock(request.getMinStock());

        // Handle category change
        if (request.getCategoryId() != null &&
                (product.getCategory() == null || product.getCategory().getCategoryId() != (request.getCategoryId()))) {

            // Decrement old category count
            if (product.getCategory() != null) {
                Category oldCategory = product.getCategory();
                oldCategory.setProductCount(Math.max(oldCategory.getProductCount() - 1, 0));
                categoryRepository.save(oldCategory);
            }

            // Increment new category count
            Category newCategory = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> {
                        logger.error("Category not found with ID: {}", request.getCategoryId());
                        return new CategoryNotFoundException("Category not found with ID: " + request.getCategoryId());
                    });
            newCategory.setProductCount(newCategory.getProductCount() + 1);
            categoryRepository.save(newCategory);

            product.setCategory(newCategory);
        }

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> {
                        logger.error("Supplier not found with ID: {}", request.getSupplierId());
                        return new SupplierNotFoundException("Supplier not found with ID: " + request.getSupplierId());
                    });
            product.setSupplier(supplier);
        }

        // Update low stock status automatically
        product.setLowStock(product.getQuantityInStock() < product.getMinStock());

        Product updated = productRepository.save(product);
        logger.info("Product updated successfully with ID: {}", updated.getProductId());
        ProductDTO dto = modelMapper.map(updated, ProductDTO.class);
        if (updated.getCategory() != null) dto.setCategoryName(updated.getCategory().getCategoryName());
        if (updated.getSupplier() != null) dto.setSupplierName(updated.getSupplier().getSupplierName());
        return dto;
    }

    // ------------------ GET / DELETE ------------------
    public ProductDTO getProductById(Long id) {
        logger.info("Fetching product by ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Product not found with ID: {}", id);
                    return new ProductNotFoundException("Product not found with ID: " + id);
                });

        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        if (product.getCategory() != null) dto.setCategoryName(product.getCategory().getCategoryName());
        if (product.getSupplier() != null) dto.setSupplierName(product.getSupplier().getSupplierName());
        logger.info("Product fetched successfully: {}", product.getProductName());
        return dto;
    }

    public List<ProductDTO> getAllProducts() {
        logger.info("Fetching all products");
        List<ProductDTO> list = productRepository.findAll().stream().map(product -> {
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);
            if (product.getCategory() != null) dto.setCategoryName(product.getCategory().getCategoryName());
            if (product.getSupplier() != null) dto.setSupplierName(product.getSupplier().getSupplierName());
            return dto;
        }).collect(Collectors.toList());

        logger.info("Total products fetched: {}", list.size());
        return list;
    }

    public void deleteProduct(Long id) {
        logger.info("Deleting product with ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Product not found with ID: {}", id);
                    return new ProductNotFoundException("Product not found with ID: " + id);
                });
        // Decrement category product count
        if (product.getCategory() != null) {
            Category category = product.getCategory();
            category.setProductCount(Math.max(category.getProductCount() - 1, 0)); // ✅ fixed
            categoryRepository.save(category);
        }

        productRepository.delete(product);
        logger.info("Product deleted successfully: {}", product.getProductName());
    }

}

