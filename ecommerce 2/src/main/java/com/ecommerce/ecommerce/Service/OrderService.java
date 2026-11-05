package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.OrderDTO;

import java.util.List;

public interface OrderService {

    OrderDTO createOrder(OrderDTO orderDTO);

    List<OrderDTO> getAllOrders();

    OrderDTO getOrderById(Long id);

    void deleteOrder(Long id);
}