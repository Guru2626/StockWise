package com.backend.IMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.IMS.entity.Transaction;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByTransactionType(String transactionType);
//    List<Transaction> findByUser_UserId(Long userId);
    List<Transaction> findByProduct_ProductId(Long productId);
}
