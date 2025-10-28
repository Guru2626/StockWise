package com.backend.IMS.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequestDTO {
    private String categoryName;

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}

