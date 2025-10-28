package com.backend.IMS.exception;

public class ProductSupplierNotFoundException extends RuntimeException {
    public ProductSupplierNotFoundException(String message) {
        super(message);
    }
}
