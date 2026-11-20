package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.OrderResponseDTO;

import java.util.List;

public interface OrderService {

    OrderResponseDTO placeOrder(String email);

    OrderResponseDTO getOrderById(
            Long orderId,
            String email
    );

    List<OrderResponseDTO> getOrdersByUser(
            String email
    );

    OrderResponseDTO cancelOrder(
            Long orderId,
            String email
    );
}