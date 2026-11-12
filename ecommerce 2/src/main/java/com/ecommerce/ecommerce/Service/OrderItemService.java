package com.ecommerce.ecommerce.Service;

import com.ecommerce.ecommerce.DTO.OrderItemDTO;

import java.util.List;

public interface OrderItemService {

    OrderItemDTO createOrderItem(OrderItemDTO orderItemDTO);

    List<OrderItemDTO> getAllOrderItems();

    OrderItemDTO getOrderItemById(Long id);

    OrderItemDTO updateOrderItem(Long id, OrderItemDTO orderItemDTO);

    void deleteOrderItem(Long id);
}