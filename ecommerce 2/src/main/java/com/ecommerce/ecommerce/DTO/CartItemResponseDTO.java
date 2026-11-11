package com.ecommerce.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {

    private Long productId;
    private String productName;
    private String description;
    private BigDecimal price;
    private Integer quantity;
}