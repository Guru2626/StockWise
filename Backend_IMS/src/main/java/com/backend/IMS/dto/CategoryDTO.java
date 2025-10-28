package com.backend.IMS.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor

public class CategoryDTO {
    private Long categoryId;
    private String categoryName;
    private int productCount;


    public CategoryDTO(Long categoryId, String categoryName, int productCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.productCount = productCount;
    }



    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public int getProductCount() {
        return productCount;
    }

    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }


}
