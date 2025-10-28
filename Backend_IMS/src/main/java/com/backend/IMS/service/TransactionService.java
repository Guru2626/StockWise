package com.backend.IMS.service;

import com.backend.IMS.dto.TransactionDTO;
import com.backend.IMS.dto.TransactionRequestDTO;
import com.backend.IMS.entity.*;
import com.backend.IMS.exception.*;
import com.backend.IMS.repository.*;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSupplierRepository productSupplierRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email);
                    return new UserNotFoundException("User not found with email: " + email);
                });
    }

    @Transactional
    public TransactionDTO purchaseProduct(TransactionRequestDTO request) {
        logger.info("Purchase request received for product: {}, quantity: {}", request.getProductName(), request.getQuantity());

        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByCategoryName(request.getCategoryName())
                .orElseThrow(() -> {
                    logger.error("Category not found: {}", request.getCategoryName());
                    return new CategoryNotFoundException("Category does not exist: " + request.getCategoryName());
                });

        ProductSupplier ps = productSupplierRepository.findByProductName(request.getProductName())
                .orElseThrow(() -> {
                    logger.error("ProductSupplier not found for product: {}", request.getProductName());
                    return new ProductSupplierNotFoundException("Product not available from any supplier");
                });

        if (!ps.getCategory().getCategoryName().equals(category.getCategoryName())) {
            logger.error("Product {} exists but belongs to a different category {}", ps.getProductName(), ps.getCategory().getCategoryName());
            throw new RuntimeException("Product exists but belongs to a different category");
        }

        Product product = productRepository.findByProductName(ps.getProductName())
                .orElseGet(() -> {
                    Product newProduct = new Product();
                    newProduct.setProductName(ps.getProductName());
                    newProduct.setCategory(category);
                    newProduct.setSupplier(ps.getSupplier());
                    newProduct.setPrice(ps.getSupplyPrice() * 1.1);
                    newProduct.setQuantityInStock(0);
                    newProduct.setMinStock(5);
                    newProduct.setLowStock(false);
                    return newProduct;
                });

        int currentStock = product.getQuantityInStock() == null ? 0 : product.getQuantityInStock();
        int newStock = currentStock + request.getQuantity();
        product.setQuantityInStock(newStock);

        // Update the lowStock flag based on updated stock
        product.setLowStock(newStock < (product.getMinStock() == null ? 0 : product.getMinStock()));

        double purchasePrice = ps.getSupplyPrice() * 1.1;
        product.setPrice(purchasePrice);

        productRepository.save(product);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("Purchase");
        transaction.setProduct(product);
        transaction.setSupplier(ps.getSupplier());
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(purchasePrice);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setUser(currentUser);

        Transaction savedTransaction = transactionRepository.save(transaction);
        logger.info("Purchase transaction saved successfully with ID: {}", savedTransaction.getTransactionId());

        TransactionDTO dto = new TransactionDTO();
        dto.setTransactionId(savedTransaction.getTransactionId());
        dto.setTransactionType(savedTransaction.getTransactionType());
        dto.setProductName(savedTransaction.getProduct().getProductName());
        dto.setSupplierName(savedTransaction.getSupplier().getSupplierName());
        dto.setUserName(savedTransaction.getUser().getUserName());
        dto.setQuantity(savedTransaction.getQuantity());
        dto.setPrice(savedTransaction.getPrice());
        dto.setTransactionDate(savedTransaction.getTransactionDate());

        return dto;
    }


    public TransactionDTO sellProduct(TransactionRequestDTO request) {
        logger.info("Sale request received for product: {}, quantity: {}", request.getProductName(), request.getQuantity());

        User currentUser = getCurrentUser();

        Product product = productRepository.findByProductName(request.getProductName())
                .orElseThrow(() -> {
                    logger.error("Product not found: {}", request.getProductName());
                    return new ProductNotFoundException("Product not found: " + request.getProductName());
                });

        if ((product.getQuantityInStock() == null ? 0 : product.getQuantityInStock()) < request.getQuantity()) {
            logger.error("Insufficient stock for product: {}, requested: {}, available: {}",
                    request.getProductName(), request.getQuantity(), product.getQuantityInStock());
            throw new RuntimeException("Insufficient stock for sale");
        }

        Supplier supplier = null;
        if (request.getSupplierName() != null && !request.getSupplierName().isEmpty()) {
            supplier = supplierRepository.findBySupplierName(request.getSupplierName())
                    .orElseThrow(() -> new SupplierNotFoundException("Supplier not found: " + request.getSupplierName()));
        } else {
            // Or fallback to the product’s linked supplier
            supplier = product.getSupplier();
        }

        int currentStock = product.getQuantityInStock();
        product.setQuantityInStock(currentStock - request.getQuantity());
        product.setLowStock(product.getQuantityInStock() < (product.getMinStock() == null ? 0 : product.getMinStock()));
        productRepository.save(product);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("Sale");
        transaction.setProduct(product);
        transaction.setSupplier(supplier);
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(request.getPrice());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setUser(currentUser);

        Transaction saved = transactionRepository.save(transaction);
        logger.info("Sale transaction saved successfully with ID: {}", saved.getTransactionId());

        TransactionDTO dto = new TransactionDTO();
        dto.setTransactionId(saved.getTransactionId());
        dto.setTransactionType(saved.getTransactionType());
        dto.setProductName(saved.getProduct().getProductName());
        dto.setSupplierName(null);
        dto.setUserName(saved.getUser().getUserName());
        dto.setQuantity(saved.getQuantity());
        dto.setPrice(saved.getPrice());
        dto.setTransactionDate(saved.getTransactionDate());

        return dto;
    }

    // ------------------ COMMON METHODS ------------------
    public List<TransactionDTO> getAllTransactions() {
        logger.info("Fetching all transactions");
        List<TransactionDTO> list = transactionRepository.findAll().stream().map(t -> {
            TransactionDTO dto = modelMapper.map(t, TransactionDTO.class);
            dto.setProductName(t.getProduct().getProductName());
            dto.setUserName(t.getUser() != null ? t.getUser().getUserName() : null);
            dto.setSupplierName(t.getSupplier() != null ? t.getSupplier().getSupplierName() : null);
            return dto;
        }).collect(Collectors.toList());
        logger.info("Total transactions fetched: {}", list.size());
        return list;
    }

    public TransactionDTO getTransactionById(Long id) {
        logger.info("Fetching transaction by ID: {}", id);
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Transaction not found with ID: {}", id);
                    return new TransactionNotFoundException("Transaction not found with ID: " + id);
                });

        TransactionDTO dto = modelMapper.map(t, TransactionDTO.class);
        dto.setProductName(t.getProduct().getProductName());
        dto.setUserName(t.getUser() != null ? t.getUser().getUserName() : null);
        dto.setSupplierName(t.getSupplier() != null ? t.getSupplier().getSupplierName() : null);

        logger.info("Transaction fetched successfully: ID {}", id);
        return dto;
    }

    public void deleteTransaction(Long id) {
        logger.info("Deleting transaction with ID: {}", id);
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Transaction not found with ID: {}", id);
                    return new TransactionNotFoundException("Transaction not found with ID: " + id);
                });
        transactionRepository.delete(t);
        logger.info("Transaction deleted successfully: ID {}", id);
    }
}
