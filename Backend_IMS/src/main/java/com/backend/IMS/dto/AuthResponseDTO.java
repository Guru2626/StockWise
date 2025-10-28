package com.backend.IMS.dto;
import lombok.*;

@Data
public class AuthResponseDTO {
    private String token;
    private String tokenType ;

    public AuthResponseDTO() {} // no-args

    public AuthResponseDTO(String token, String tokenType) {
        this.token = token;
        this.tokenType = tokenType;
    }


    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
