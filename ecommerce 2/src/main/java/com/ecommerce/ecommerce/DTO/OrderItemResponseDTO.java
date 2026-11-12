package com.ecommerce.ecommerce.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDTO {

    private Long productId;
    private String productName;
    private String description;
    private BigDecimal price;
    private Integer quantity;
}