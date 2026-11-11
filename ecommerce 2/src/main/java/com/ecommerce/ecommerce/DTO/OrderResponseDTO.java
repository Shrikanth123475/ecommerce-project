package com.ecommerce.ecommerce.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {

    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemResponseDTO> items;
}
