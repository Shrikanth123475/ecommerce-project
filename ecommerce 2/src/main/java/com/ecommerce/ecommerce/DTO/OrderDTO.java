package com.ecommerce.ecommerce.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private Double totalAmount;
    private String status;
    private Long userId;
    private List<OrderItemDTO> orderItems;
}