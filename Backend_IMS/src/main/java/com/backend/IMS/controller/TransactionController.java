package com.backend.IMS.controller;

import com.backend.IMS.dto.TransactionDTO;
import com.backend.IMS.dto.TransactionRequestDTO;
import com.backend.IMS.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired private TransactionService transactionService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/purchase")
    public ResponseEntity<TransactionDTO> purchaseProduct(@RequestBody TransactionRequestDTO request) {
        return ResponseEntity.ok(transactionService.purchaseProduct(request));
    }

    @PreAuthorize("hasAnyRole('MANAGER','STAFF')")
    @PostMapping("/sale")
    public ResponseEntity<TransactionDTO> sellProduct(@RequestBody TransactionRequestDTO request) {
        return ResponseEntity.ok(transactionService.sellProduct(request));
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}
