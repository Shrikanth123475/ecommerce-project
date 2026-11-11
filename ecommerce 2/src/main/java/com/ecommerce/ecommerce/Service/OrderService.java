package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.OrderDTO;
import com.ecommerce.ecommerce.DTO.OrderResponseDTO;

import java.util.List;

public interface OrderService {

  OrderResponseDTO placeOrder(Long userId);
    OrderResponseDTO getOrderById(Long orderId);
    List<OrderResponseDTO> getOrdersByUser(Long userId);
    void cancelOrder(Long orderId);

}